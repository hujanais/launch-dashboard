import { Fragment, useEffect, useState } from 'react'
import {
    Avatar,
    Box,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Typography,
} from '@mui/material'
import styles from './LaunchPage.module.scss'
import { useNavigate } from 'react-router-dom'
import type { LaunchResponse } from '../../models/launch_model'
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
                    <Fragment key={launch.id}>
                        <ListItem
                            sx={{ bgcolor: 'background.paper' }}
                            onClick={() => viewDetail(launch.id)}
                        >
                            <Avatar sx={{ m: '0.5rem' }} src={launch.image} />
                            <ListItemText
                                primary={
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            columnGap: '1rem',
                                        }}
                                    >
                                        <Typography>
                                            {
                                                launch.launch_service_provider
                                                    .name
                                            }
                                        </Typography>
                                        <Typography>
                                            {launch.rocket.configuration.name}
                                        </Typography>
                                        <Typography>
                                            {launch.mission.name}
                                        </Typography>
                                    </div>
                                }
                                secondary={
                                    <>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                columnGap: '5px',
                                            }}
                                        >
                                            <Typography color="green">
                                                {launch.status.name}
                                            </Typography>
                                            <Typography>
                                                {new Date(
                                                    launch.net
                                                ).toLocaleString()}
                                            </Typography>
                                        </div>
                                        <Typography>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    columnGap: '5px',
                                                }}
                                            >
                                                <div>
                                                    {launch.pad.location.name}
                                                </div>
                                                <div>{launch.pad.name}</div>
                                            </div>
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </Fragment>
                ))}
            </List>
        </div>
    )
}

{
    /* <List>
<ListSubheader>Launches</ListSubheader>
{launches.results.map((launch) => (
    <>
        <ListItem sx={{ bgcolor: 'background.paper' }}>
            <Avatar
                sx={{ m: '0.5rem' }}
                src={launch.image}
            />
            <ListItemText
                primary={
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            columnGap: '1rem',
                        }}
                    >
                        <Typography>
                            {
                                launch
                                    .launch_service_provider
                                    .name
                            }
                        </Typography>
                        <Typography>
                            {
                                launch.rocket.configuration
                                    .name
                            }
                        </Typography>
                    </div>
                }
                secondary={
                    <>
                        {launch.net}{' '}
                        <Typography sx={{ color: 'green' }}>
                            {launch.status.name}
                        </Typography>
                    </>
                }
            />
        </ListItem>
        <Divider variant="inset" component="li" />
    </>
))}
</List> */
}
