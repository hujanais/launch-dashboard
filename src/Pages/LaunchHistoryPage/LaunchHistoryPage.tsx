import {
    Alert,
    Box,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { useMemo, useState } from 'react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import styles from './LaunchHistoryPage.module.scss'
import {
    fetchAgenciesByIds,
    fetchPreviousLaunchesYearToDate,
    type AgencyDirectory,
} from '../../Api/launchApi'
import type {
    LaunchResult,
    PreviousLaunchesResponse,
} from '../../models/launch_model'

type AgencyHistory = {
    groupKey: string
    name: string
    launches: number
    success: number
    failures: number
}

type PreviousLaunchCache = {
    data: PreviousLaunchesResponse
    agencies: AgencyDirectory
    lastUpdated: string
}

const PREVIOUS_LAUNCHES_CACHE_KEY = 'previousLaunchesYtdCache'

const EMPTY_PREVIOUS_LAUNCHES_RESPONSE: PreviousLaunchesResponse = {
    count: 0,
    next: null,
    previous: null,
    results: [],
}

const CHART_TOP_AGENCY_COUNT = 7

const truncateAgencyLabel = (name: string, max = 14) => {
    const t = name.trim()
    if (t.length <= max) return t
    return `${t.slice(0, Math.max(max - 1, 3))}\u2026`
}

type StackedDatum = {
    name: string
    fullLabel: string
    launches: number
    success: number
    failures: number
}

const isSuccessfulLaunch = (launch: LaunchResult) => {
    const statusText =
        `${launch.status.name} ${launch.status.abbrev}`.toLowerCase()
    return statusText.includes('success')
}

const isFailedLaunch = (launch: LaunchResult) => {
    const statusText =
        `${launch.status.name} ${launch.status.abbrev}`.toLowerCase()
    return statusText.includes('failure') || statusText.includes('fail')
}

const buildStackedChartData = (rows: AgencyHistory[]): StackedDatum[] => {
    if (rows.length === 0) return []

    const sorted = [...rows].sort((a, b) => b.launches - a.launches)
    const topAgencies = sorted.slice(0, CHART_TOP_AGENCY_COUNT)
    const remainingAgencies = sorted.slice(CHART_TOP_AGENCY_COUNT)

    const toDatum = (
        label: string,
        fullLabel: string,
        success: number,
        failures: number,
        launches: number
    ): StackedDatum => ({
        name: label,
        fullLabel,
        launches,
        success,
        failures,
    })

    const out: StackedDatum[] = topAgencies.map((a) =>
        toDatum(
            truncateAgencyLabel(a.name),
            a.name,
            a.success,
            a.failures,
            a.launches
        )
    )

    if (remainingAgencies.length > 0) {
        let launchesSum = 0
        let successSum = 0
        let failureSum = 0
        for (const m of remainingAgencies) {
            launchesSum += m.launches
            successSum += m.success
            failureSum += m.failures
        }
        out.push(
            toDatum(
                'Others',
                `All remaining agencies (${remainingAgencies.length})`,
                successSum,
                failureSum,
                launchesSum
            )
        )
    }

    return out
}

const getCachedPreviousLaunches = (): PreviousLaunchCache | null => {
    const cachedValue = localStorage.getItem(PREVIOUS_LAUNCHES_CACHE_KEY)
    if (!cachedValue) return null

    try {
        return JSON.parse(cachedValue) as PreviousLaunchCache
    } catch {
        return null
    }
}

export const LaunchHistoryPage = () => {
    const cachedPayload = getCachedPreviousLaunches()
    const [launches, setLaunches] = useState<PreviousLaunchesResponse>(
        cachedPayload?.data ?? EMPTY_PREVIOUS_LAUNCHES_RESPONSE
    )
    const [lastUpdated, setLastUpdated] = useState<string | null>(
        cachedPayload?.lastUpdated ?? null
    )
    const [agencies, setAgencies] = useState<AgencyDirectory>(
        cachedPayload?.agencies ?? {}
    )
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isError, setIsError] = useState(false)

    const agencyHistory = useMemo(() => {
        const grouped = new Map<string, AgencyHistory>()

        launches.results.forEach((launch) => {
            const agency = launch.launch_service_provider
            const agencyId = agency?.id ?? launch.id
            const agencyDetails =
                typeof agencyId === 'number' ? agencies[agencyId] : undefined
            const key = `${agencyId}-${agency?.name ?? 'Unknown agency'}`

            const current = grouped.get(key) ?? {
                groupKey: key,
                name: agencyDetails?.name ?? agency?.name ?? 'Unknown agency',
                launches: 0,
                success: 0,
                failures: 0,
            }

            current.launches += 1
            if (isSuccessfulLaunch(launch)) current.success += 1
            if (isFailedLaunch(launch)) current.failures += 1

            grouped.set(key, current)
        })

        return Array.from(grouped.values()).sort(
            (a, b) => b.launches - a.launches
        )
    }, [agencies, launches])

    const launchTotals = useMemo(
        () =>
            agencyHistory.reduce(
                (totals, agency) => {
                    totals.launches += agency.launches
                    totals.success += agency.success
                    totals.failures += agency.failures
                    return totals
                },
                { launches: 0, success: 0, failures: 0 }
            ),
        [agencyHistory]
    )

    const stackedChartData = useMemo(
        () => buildStackedChartData(agencyHistory),
        [agencyHistory]
    )

    const refreshLaunchHistory = async () => {
        setIsRefreshing(true)
        setIsError(false)

        try {
            const response = await fetchPreviousLaunchesYearToDate(0)
            const agencyIds = response.results
                .map((launch) => launch.launch_service_provider?.id)
                .filter((id): id is number => typeof id === 'number')
            const agencyDirectory = await fetchAgenciesByIds(agencyIds)
            const updatedAt = new Date().toISOString()

            setLaunches(response)
            setAgencies(agencyDirectory)
            setLastUpdated(updatedAt)
            localStorage.setItem(
                PREVIOUS_LAUNCHES_CACHE_KEY,
                JSON.stringify({
                    data: response,
                    agencies: agencyDirectory,
                    lastUpdated: updatedAt,
                } satisfies PreviousLaunchCache)
            )
        } catch {
            setIsError(true)
        } finally {
            setIsRefreshing(false)
        }
    }

    return (
        <div className={styles.scrollableContainer}>
            <header className={styles.topBar}>
                <div className={styles.topBarRow}>
                    <div className={styles.titleBlock}>
                        <Typography
                            variant="overline"
                            className={styles.eyebrow}
                        >
                            Previous Launches
                        </Typography>
                    </div>
                    <IconButton
                        aria-label={
                            isRefreshing
                                ? 'Refreshing launch history'
                                : 'Refresh launch history'
                        }
                        size="small"
                        onClick={refreshLaunchHistory}
                        disabled={isRefreshing}
                        className={styles.refreshBtn}
                    >
                        <RefreshRoundedIcon
                            fontSize="small"
                            className={
                                isRefreshing
                                    ? styles.refreshSpinning
                                    : undefined
                            }
                        />
                    </IconButton>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <Typography variant="body2" className={styles.metaLine}>
                        Total launches: {launchTotals.launches} | Successes:{' '}
                        {launchTotals.success} | Failures:{' '}
                        {launchTotals.failures} Last updated:
                    </Typography>
                    <Typography
                        variant="caption"
                        className={styles.metaLine}
                        style={{
                            marginLeft: '1.5rem',
                            minWidth: 140,
                            textAlign: 'right',
                        }}
                    >
                        {lastUpdated
                            ? new Date(lastUpdated).toLocaleString()
                            : 'Not refreshed yet'}
                    </Typography>
                </div>
            </header>

            {isRefreshing ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress size={22} />
                </Box>
            ) : null}

            {isError ? (
                <Alert severity="error" className={styles.alert}>
                    Could not load previous launches. Please try again.
                </Alert>
            ) : null}

            {!isRefreshing && !isError ? (
                <div className={styles.mainRow}>
                    <aside className={styles.chartPanel}>
                        <Typography
                            variant="caption"
                            className={styles.chartLegendNote}
                            component="div"
                        >
                            Launch outcomes by agency (top{' '}
                            {CHART_TOP_AGENCY_COUNT}; final bar aggregates the
                            rest)
                        </Typography>
                        {agencyHistory.length === 0 ? (
                            <div className={styles.chartEmpty}>
                                <Typography className={styles.chartEmptyText}>
                                    Refresh to load chart data.
                                </Typography>
                            </div>
                        ) : (
                            <div className={styles.chartInner}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={stackedChartData}
                                        margin={{
                                            top: 8,
                                            right: 6,
                                            left: -12,
                                            bottom: 12,
                                        }}
                                        barCategoryGap={10}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(51, 65, 85, 0.45)"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#475569"
                                            tick={{
                                                fill: '#94a3b8',
                                                fontSize: 10,
                                            }}
                                            angle={-32}
                                            textAnchor="end"
                                            interval={0}
                                            height={68}
                                            tickMargin={10}
                                            tickLine={{ stroke: '#475569' }}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            stroke="#475569"
                                            tick={{
                                                fill: '#94a3b8',
                                                fontSize: 11,
                                            }}
                                            tickLine={{ stroke: '#475569' }}
                                            axisLine={{ stroke: '#475569' }}
                                            label={{
                                                value: 'Launches',
                                                angle: -90,
                                                position: 'insideLeft',
                                                offset: 8,
                                                fill: '#64748b',
                                                fontSize: 11,
                                            }}
                                        />
                                        <Tooltip
                                            cursor={{
                                                fill: 'rgba(30, 41, 59, 0.35)',
                                            }}
                                            content={({ active, payload }) => {
                                                if (
                                                    !active ||
                                                    !payload?.length
                                                )
                                                    return null
                                                const first = payload[0] as {
                                                    payload?: StackedDatum
                                                }
                                                const row =
                                                    first?.payload ??
                                                    undefined
                                                if (!row) return null
                                                const other = Math.max(
                                                    0,
                                                    row.launches -
                                                        row.success -
                                                        row.failures
                                                )
                                                return (
                                                    <div
                                                        className={
                                                            styles.chartTooltip
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.chartTooltipTitle
                                                            }
                                                        >
                                                            {row.fullLabel}
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.chartTooltipRowMuted
                                                            }
                                                        >
                                                            Total launches:{' '}
                                                            {row.launches}
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.chartTooltipRow
                                                            }
                                                        >
                                                            Success:{' '}
                                                            <span
                                                                className={
                                                                    styles.chartTooltipOk
                                                                }
                                                            >
                                                                {row.success}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.chartTooltipRow
                                                            }
                                                        >
                                                            Failures:{' '}
                                                            <span
                                                                className={
                                                                    styles.chartTooltipFail
                                                                }
                                                            >
                                                                {row.failures}
                                                            </span>
                                                        </div>
                                                        {other > 0 ? (
                                                            <div
                                                                className={
                                                                    styles.chartTooltipRowMuted
                                                                }
                                                            >
                                                                Neither counted
                                                                as success nor
                                                                failure: {other}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                )
                                            }}
                                        />
                                        <Bar
                                            dataKey="success"
                                            name="Success"
                                            stackId="stack"
                                            fill="#34d399"
                                            radius={[0, 0, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="failures"
                                            name="Failures"
                                            stackId="stack"
                                            fill="#fb7185"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </aside>

                    <div className={styles.tableColumn}>
                        {agencyHistory.length === 0 ? (
                            <Alert
                                severity="info"
                                className={styles.tableColumnAlert}
                            >
                                No launch history found.
                            </Alert>
                        ) : (
                            <TableContainer className={styles.tableContainer}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Agency</TableCell>
                                            <TableCell align="right">
                                                Launches
                                            </TableCell>
                                            <TableCell align="right">
                                                Success
                                            </TableCell>
                                            <TableCell align="right">
                                                Failures
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {agencyHistory.map((agency) => (
                                            <TableRow key={agency.groupKey}>
                                                <TableCell>
                                                    {agency.name}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {agency.launches}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {agency.success}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {agency.failures}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    )
}
