import { useMemo } from 'react'
import { Tooltip } from '@mui/material'
import type { LaunchResult } from '../../../../models/launch_model'
import styles from './LaunchTimeline.module.scss'

const DAY_MS = 86_400_000
const WINDOW_DAYS = 30
const ROCKET = '🚀'
const MIN_GAP_PCT = 8

/** Avoid overlapping markers when launches cluster on adjacent days */
function assignLanes(items: { launch: LaunchResult; pct: number }[]) {
    const sorted = [...items].sort((a, b) => a.pct - b.pct)
    const out: { launch: LaunchResult; pct: number; lane: number }[] = []

    for (const item of sorted) {
        let lane = 0
        while (
            out.some(
                (o) =>
                    Math.abs(o.pct - item.pct) < MIN_GAP_PCT && o.lane === lane
            )
        ) {
            lane += 1
        }
        out.push({ ...item, lane: Math.min(lane, 3) })
    }
    return out
}

export const LaunchTimeline = ({
    launches,
    onLaunchClick,
}: {
    launches: LaunchResult[]
    onLaunchClick: (id: string) => void
}) => {
    const markers = useMemo(() => {
        const windowMsInner = WINDOW_DAYS * DAY_MS
        const now = Date.now()
        const end = now + windowMsInner
        const inWindow = launches
            .map((launch) => ({ launch, t: Date.parse(launch.net) }))
            .filter(({ t }) => t > now && t <= end)

        const normalized = inWindow.map(({ launch, t }) => ({
            launch,
            pct: Math.min(
                100,
                Math.max(0, ((t - now) / windowMsInner) * 100)
            ),
        }))

        return assignLanes(normalized)
    }, [launches])

    if (markers.length === 0) {
        return (
            <div className={styles.empty}>
                <span className={styles.emptyRocket} aria-hidden>
                    {ROCKET}
                </span>
                <p className={styles.emptyCopy}>
                    No launches scheduled in the next {WINDOW_DAYS} days with
                    the current filters.
                </p>
            </div>
        )
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.axisLabels}>
                <span>Now</span>
                <span className={styles.axisRight}>+{WINDOW_DAYS} days</span>
            </div>
            <div className={styles.track}>
                <div className={styles.line} aria-hidden />
                <div className={styles.gradMask} aria-hidden />
                {markers.map(({ launch, pct, lane }) => {
                    const when = new Date(launch.net)
                    const rocketName =
                        launch.rocket.configuration.full_name ||
                        launch.rocket.configuration.name
                    const datetimeLabel = when.toLocaleString(undefined, {
                        dateStyle: 'short',
                        timeStyle: 'short',
                    })
                    const title = `${launch.name}\n${rocketName}\n${datetimeLabel}`

                    return (
                        <div
                            key={launch.id}
                            className={styles.launchGroup}
                            style={{ left: `${pct}%` }}
                        >
                            <div
                                className={styles.tick}
                                aria-hidden
                            />
                            <time
                                className={styles.when}
                                dateTime={launch.net}
                                title={datetimeLabel}
                            >
                                {datetimeLabel}
                            </time>
                            <Tooltip
                                title={title}
                                arrow
                                placement="top"
                                slotProps={{
                                    tooltip: {
                                        className: styles.tooltip,
                                    },
                                }}
                            >
                                <button
                                    type="button"
                                    className={styles.marker}
                                    style={{
                                        ['--lane-shift' as string]: `${lane * 22}px`,
                                    }}
                                    onClick={() => onLaunchClick(launch.id)}
                                    aria-label={`${launch.name}, ${rocketName}, ${datetimeLabel}`}
                                >
                                    <span className={styles.markerStack}>
                                        <span
                                            className={styles.rocketLabel}
                                            title={rocketName}
                                        >
                                            {rocketName}
                                        </span>
                                        <span className={styles.rocket} aria-hidden>
                                            {ROCKET}
                                        </span>
                                    </span>
                                </button>
                            </Tooltip>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
