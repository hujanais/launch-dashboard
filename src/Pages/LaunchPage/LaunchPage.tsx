import launchData from '../../assets/launch_mock.json'
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Typography,
} from '@mui/material'
import styles from './LaunchPage.module.scss'
import { useNavigate } from 'react-router-dom'
// import type { LaunchData } from '../../models/launch_model'

export const LaunchPage = () => {
    // const [page, setPage] = useState(0)
    // const { launchQuery } = useLaunchHook(page)

    const navigate = useNavigate()
    const launches = launchData

    const viewDetail = (id: string) => {
        const launchObj = launches.results.find((launch) => launch.id === id)
        navigate('/launch-detail', { state: launchObj })
    }

    return (
        <div className={styles.scrollableContainer}>
            <List>
                <ListSubheader>Launches</ListSubheader>
                {launches.results.map((launch) => (
                    <>
                        <ListItem
                            key={launch.id}
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
