import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { LaunchResult } from '../../models/launch_model'
import styles from './LaunchDetailPage.module.scss'
import { ArrowBack } from '@mui/icons-material'
import { Box, Button, Chip, Divider, Link, Typography } from '@mui/material'

export const LaunchDetailPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { state } = location as { state?: LaunchResult }
    const [countdownMs, setCountdownMs] = useState(() =>
        state ? Date.parse(state.net) - Date.now() : 0
    )

    const goBack = () => {
        navigate(-1)
    }

    useEffect(() => {
        if (!state) {
            return
        }

        setCountdownMs(Date.parse(state.net) - Date.now())

        const timerObj = setInterval(() => {
            setCountdownMs(Date.parse(state.net) - Date.now())
        }, 1000)

        return () => {
            clearInterval(timerObj)
        }
    }, [state])

    const formatCountdown = (milliseconds: number) => {
        const totalSeconds = milliseconds / 1000
        const sign = totalSeconds < 0 ? '-' : ''
        const normalizedSeconds = Math.abs(totalSeconds)
        const days = Math.floor(normalizedSeconds / 86400)
        const hours = Math.floor((normalizedSeconds % 86400) / 3600)
        const minutes = Math.floor((normalizedSeconds % 3600) / 60)
        const seconds = Math.floor(normalizedSeconds % 60)

        return `${sign}${days}d ${hours}h ${minutes}m ${seconds}s`
    }

    const launchTimeLabel = useMemo(() => {
        if (!state) {
            return ''
        }

        return new Date(state.net).toLocaleString()
    }, [state])

    const primaryAgency = state?.mission?.agencies?.[0]
    const missionInfoUrl = state?.mission?.info_urls?.[0]
    const missionVideoUrl = state?.mission?.vid_urls?.[0]
    const padMapUrl = state?.pad?.map_url
    const padWikiUrl = state?.pad?.wiki_url

    const hasWatchItems = Boolean(
        state?.weather_concerns || state?.holdreason || state?.failreason
    )

    if (!state) {
        return (
            <div className={styles.launchDetailContainer}>
                <Box className={styles.fallback}>
                    <Typography variant="h5">
                        Launch details unavailable
                    </Typography>
                    <Typography className={styles.mutedText}>
                        Open a launch from the Upcoming Launch list to view
                        details.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/')}
                    >
                        Back to launches
                    </Button>
                </Box>
            </div>
        )
    }

    return (
        <div className={styles.launchDetailContainer}>
            <div className={styles.launchDetailHeader}>
                <Button
                    className={styles.backButton}
                    startIcon={<ArrowBack />}
                    onClick={goBack}
                >
                    Back
                </Button>
                <Typography variant="h5" className={styles.title}>
                    {state.name}
                </Typography>
                <div className={styles.headerMetaRow}>
                    <Typography className={styles.nextEventInline}>
                        Next Event Time: {launchTimeLabel}
                    </Typography>
                    <div className={styles.badgeRow}>
                        <Chip
                            label={`T-${formatCountdown(countdownMs)}`}
                            color="primary"
                            variant="filled"
                            size="small"
                        />
                        <Chip
                            label={state.status.name}
                            variant="outlined"
                            size="small"
                        />
                        <Chip label={state.type} variant="outlined" size="small" />
                    </div>
                </div>
            </div>

            <div className={styles.launchDetailContent}>
                <div className={styles.previewRows}>
                    <div className={styles.previewRow}>
                        <img
                            src={state.image}
                            alt={state.name}
                            className={styles.previewImage}
                        />
                        <div className={styles.previewInfo}>
                            <div className={styles.previewInfoHeader}>
                                <Typography
                                    variant="subtitle1"
                                    className={styles.sectionTitle}
                                >
                                    Launch Snapshot
                                </Typography>
                                <Typography className={styles.timeText}>
                                    T-{formatCountdown(countdownMs)}
                                </Typography>
                                <Typography className={styles.mutedText}>
                                    Status: {state.status.name}
                                </Typography>
                                <Typography className={styles.mutedText}>
                                    Type: {state.type}
                                </Typography>
                                {state.hashtag && (
                                    <Typography className={styles.mutedText}>
                                        Hashtag: {state.hashtag}
                                    </Typography>
                                )}
                            </div>
                            <Divider className={styles.divider} />
                            <div className={styles.topInfoGrid}>
                                <Box
                                    className={`${styles.sectionCard} ${styles.quickFactsSpan}`}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        className={styles.sectionTitle}
                                    >
                                        Quick Facts
                                    </Typography>
                                    <Divider className={styles.divider} />
                                    <div className={styles.quickFactsInner}>
                                        <div className={styles.kv}>
                                            <span>Provider</span>
                                            <span>
                                                {primaryAgency?.name ??
                                                    state.launch_service_provider
                                                        ?.name ??
                                                    'N/A'}
                                            </span>
                                        </div>
                                        <div className={styles.kv}>
                                            <span>Rocket</span>
                                            <span>
                                                {
                                                    state.rocket.configuration
                                                        .full_name
                                                }
                                            </span>
                                        </div>
                                        <div className={styles.kv}>
                                            <span>Mission Type</span>
                                            <span>
                                                {state.mission?.type ?? 'N/A'}
                                            </span>
                                        </div>
                                        <div className={styles.kv}>
                                            <span>Orbit</span>
                                            <span>
                                                {state.mission?.orbit?.name ??
                                                    'N/A'}
                                            </span>
                                        </div>
                                        <div className={styles.kv}>
                                            <span>Window Start</span>
                                            <span>
                                                {new Date(
                                                    state.window_start
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className={styles.kv}>
                                            <span>Window End</span>
                                            <span>
                                                {new Date(
                                                    state.window_end
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </Box>

                                <Box className={styles.sectionCard}>
                                    <Typography
                                        variant="subtitle1"
                                        className={styles.sectionTitle}
                                    >
                                        Launch Site
                                    </Typography>
                                    <Divider className={styles.divider} />
                                    <Typography>
                                        {state.pad?.name ?? 'N/A'}
                                    </Typography>
                                    <Typography className={styles.mutedText}>
                                        {state.pad?.location?.name ?? 'N/A'} (
                                        {state.pad?.country_code ?? 'N/A'})
                                    </Typography>
                                    <Typography className={styles.mutedText}>
                                        {state.pad?.latitude ?? 'N/A'},{' '}
                                        {state.pad?.longitude ?? 'N/A'}
                                    </Typography>
                                    <div className={styles.linkRow}>
                                        {padMapUrl && (
                                            <Link
                                                href={padMapUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View pad map
                                            </Link>
                                        )}
                                        {padWikiUrl && (
                                            <Link
                                                href={padWikiUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Pad wiki
                                            </Link>
                                        )}
                                    </div>
                                </Box>

                                <Box className={styles.sectionCard}>
                                    <Typography
                                        variant="subtitle1"
                                        className={styles.sectionTitle}
                                    >
                                        Agency Information
                                    </Typography>
                                    <Divider className={styles.divider} />
                                    <div className={styles.agencyKvGrid}>
                                        <div className={styles.kv}>
                                            <span>Country Code</span>
                                            <span>
                                                {primaryAgency?.country_code ||
                                                    'N/A'}
                                            </span>
                                        </div>
                                        <div className={styles.kv}>
                                            <span>Launchers</span>
                                            <span>
                                                {primaryAgency?.launchers ||
                                                    'N/A'}
                                            </span>
                                        </div>
                                        <div className={styles.kv}>
                                            <span>Spacecraft</span>
                                            <span>
                                                {primaryAgency?.spacecraft ||
                                                    'N/A'}
                                            </span>
                                        </div>
                                        <div className={styles.kv}>
                                            <span>Total Launch Count</span>
                                            <span>
                                                {primaryAgency?.total_launch_count ??
                                                    'N/A'}
                                            </span>
                                        </div>
                                        <div className={styles.kv}>
                                            <span>Consecutive Successful</span>
                                            <span>
                                                {primaryAgency?.consecutive_successful_launches ??
                                                    'N/A'}
                                            </span>
                                        </div>
                                        <div className={styles.kv}>
                                            <span>Successful Launches</span>
                                            <span>
                                                {primaryAgency?.successful_launches ??
                                                    'N/A'}
                                            </span>
                                        </div>
                                        <div className={styles.kv}>
                                            <span>Failed Launches</span>
                                            <span>
                                                {primaryAgency?.failed_launches ??
                                                    'N/A'}
                                            </span>
                                        </div>
                                        <div className={styles.kv}>
                                            <span>Pending Launches</span>
                                            <span>
                                                {primaryAgency?.pending_launches ??
                                                    'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider className={styles.sectionDivider} />

                <div className={styles.moreInfoSection}>
                    <Box
                        className={`${styles.sectionCard} ${!hasWatchItems ? styles.missionFullWidth : ''}`}
                    >
                        <Typography
                            variant="subtitle1"
                            className={styles.sectionTitle}
                        >
                            Mission Overview
                        </Typography>
                        <Divider className={styles.divider} />
                        <Typography className={styles.missionDescription}>
                            {state.mission?.description ??
                                'Mission details are not available for this launch.'}
                        </Typography>
                        <div className={styles.linkRow}>
                            {missionInfoUrl && (
                                <Link
                                    href={missionInfoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Mission info
                                </Link>
                            )}
                            {missionVideoUrl && (
                                <Link
                                    href={missionVideoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Video link
                                </Link>
                            )}
                        </div>
                    </Box>

                    {hasWatchItems && (
                        <Box className={styles.sectionCard}>
                            <Typography
                                variant="subtitle1"
                                className={styles.sectionTitle}
                            >
                                Watch Items
                            </Typography>
                            <Divider className={styles.divider} />
                            {state.weather_concerns && (
                                <Typography>
                                    <strong>Weather:</strong>{' '}
                                    {state.weather_concerns}
                                </Typography>
                            )}
                            {state.holdreason && (
                                <Typography>
                                    <strong>Hold reason:</strong>{' '}
                                    {state.holdreason}
                                </Typography>
                            )}
                            {state.failreason && (
                                <Typography>
                                    <strong>Failure reason:</strong>{' '}
                                    {state.failreason}
                                </Typography>
                            )}
                        </Box>
                    )}
                </div>
            </div>
        </div>
    )
}
