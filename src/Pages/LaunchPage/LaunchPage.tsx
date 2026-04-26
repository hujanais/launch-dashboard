import { useEffect, useState } from 'react'
import { Box, Button, List, Typography } from '@mui/material'
import styles from './LaunchPage.module.scss'
import { useNavigate } from 'react-router-dom'
import type { LaunchResponse } from '../../models/launch_model'
import { LaunchCard } from './Components/LaunchCardComponent/LaunchCard'
import { fetchUpcomingLaunches } from '../../Api/launchApi'

export const LaunchPage = () => {
    const [launches, setLaunches] = useState<LaunchResponse>(() => {
        const cachedLaunches = localStorage.getItem('launches')
        if (cachedLaunches) {
            return JSON.parse(cachedLaunches)
        }

        return {
            count: 0,
            next: null,
            previous: null,
            results: [],
        }
    })
    const [isRefreshing, setIsRefreshing] = useState(false)
    const navigate = useNavigate()
    const nextLaunch = launches.results[0]

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

    const getLaunches = async () => {
        setIsRefreshing(true)
        try {
            const page = 0
            const launchResponse = await fetchUpcomingLaunches(page)
            setLaunches(launchResponse)
            localStorage.setItem('launches', JSON.stringify(launchResponse))
        } finally {
            setIsRefreshing(false)
        }
    }

    const viewDetail = (id: string) => {
        const launchObj = launches.results.find((launch) => launch.id === id)
        navigate('/launch-detail', { state: launchObj })
    }

    useEffect(() => {
        const timerObj = setInterval(() => {
            setLaunches((prevLaunchResp) => {
                if (!prevLaunchResp?.results) {
                    return prevLaunchResp
                }

                return {
                    ...prevLaunchResp,
                    results: prevLaunchResp.results.map((launch) => ({
                        ...launch,
                        countdown_sec: Date.parse(launch.net) - Date.now(),
                    })),
                }
            })
        }, 1000)

        return () => {
            clearInterval(timerObj)
        }
    }, [])

    return (
        <div className={styles.scrollableContainer}>
            <Box className={styles.header}>
                <Typography variant="h5" component="h1">
                    Upcoming Launch
                </Typography>
                <Typography className={styles.subHeader}>
                    Next Launch:{' '}
                    {nextLaunch
                        ? `T-${formatCountdown(nextLaunch.countdown_sec)}`
                        : 'N/A'}
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={getLaunches}
                    disabled={isRefreshing}
                >
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
            </Box>
            <List className={styles.list}>
                {launches.results.map((launch) => (
                    <LaunchCard
                        key={launch.id}
                        launch={launch}
                        onClick={viewDetail}
                    />
                ))}
            </List>
        </div>
    )
}
