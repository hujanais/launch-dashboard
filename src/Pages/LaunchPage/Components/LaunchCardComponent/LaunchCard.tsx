import type { LaunchResult } from '../../../../models/launch_model'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

export const LaunchCard = ({
    launch,
    onClick,
}: {
    launch: LaunchResult
    onClick: (id: string) => void
}) => {
    const convertToHHMMSS = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const remainingSeconds = Math.floor(seconds % 60)
        return `${hours}h ${minutes}m ${remainingSeconds}s`
    }

    return (
        <Card
            sx={{ display: 'flex', padding: '0.2rem' }}
            onClick={() => onClick(launch.id)}
        >
            <CardMedia
                component="img"
                sx={{ width: 100 }}
                image={launch.image}
                alt="Live from space album cover"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <div>{convertToHHMMSS(launch.countdown_sec / 1000)}</div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        columnGap: '1rem',
                    }}
                >
                    <Typography color="green">{launch.status.name}</Typography>
                    <Typography>
                        {new Date(launch.net).toLocaleString()}
                    </Typography>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        columnGap: '1rem',
                    }}
                >
                    <Typography>
                        {launch.launch_service_provider.name}
                    </Typography>
                    <Typography>{launch.rocket.configuration.name}</Typography>
                    <Typography>{launch.mission.name}</Typography>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        columnGap: '1rem',
                    }}
                >
                    <Typography>{launch.pad.country_code}</Typography>
                    <Typography>{launch.pad.name}</Typography>
                </div>
            </Box>
        </Card>
    )
}
