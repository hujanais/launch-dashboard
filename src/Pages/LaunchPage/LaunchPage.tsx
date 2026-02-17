import { useEffect, useState } from 'react'
import { Box, Button, List, ListSubheader } from '@mui/material'
import styles from './LaunchPage.module.scss'
import { useNavigate } from 'react-router-dom'
import type { LaunchResponse } from '../../models/launch_model'
import { LaunchCard } from './Components/LaunchCardComponent/LaunchCard'
// import type { LaunchData } from '../../models/launch_model'

export const LaunchPage = () => {
    // const [page, setPage] = useState(0)
    // const { launchQuery } = useLaunchHook(page)
    const [launches, setLaunches] = useState<LaunchResponse>({
        count: 0,
        next: null,
        previous: null,
        results: [],
    })
    const navigate = useNavigate()

    const getLaunches = async () => {
        const page = 0
        const response = await fetch(
            `https://ll.thespacedevs.com/2.2.0/launch/upcoming?limit=10&offset=0&status=1&offset=${
                page * 10
            }`
        )

        const launchResponse = await response.json()
        setLaunches(launchResponse)
        localStorage.setItem('launches', JSON.stringify(launchResponse))
    }

    const viewDetail = (id: string) => {
        const launchObj = launches.results.find((launch) => launch.id === id)
        navigate('/launch-detail', { state: launchObj })
    }

    useEffect(() => {
        const launches = localStorage.getItem('launches')
        if (launches) {
            setLaunches(JSON.parse(launches))
        }

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
            <Box sx={{ m: '1rem' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => getLaunches()}
                >
                    Refresh
                </Button>
            </Box>
            <List>
                <ListSubheader>Upcoming Launches</ListSubheader>
                {launches.results.map((launch) => (
                    <LaunchCard launch={launch} onClick={viewDetail} />
                ))}
            </List>
        </div>
    )
}
