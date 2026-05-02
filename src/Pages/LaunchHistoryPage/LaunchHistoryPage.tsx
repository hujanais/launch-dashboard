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
                    <aside
                        className={styles.graphPlaceholder}
                        aria-label="Chart area — work in progress"
                    >
                        <Typography
                            variant="caption"
                            className={styles.graphPlaceholderText}
                        >
                            Graph — coming soon
                        </Typography>
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
