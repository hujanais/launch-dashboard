import type { LaunchResult } from '../../../../models/launch_model'
import styles from './LaunchCard.module.scss'
import Card from '@mui/material/Card'
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
        const sign = seconds < 0 ? '-' : ''
        const normalizedSeconds = Math.abs(seconds)
        const days = Math.floor(normalizedSeconds / 86400)
        const hours = Math.floor((normalizedSeconds % 86400) / 3600)
        const minutes = Math.floor((normalizedSeconds % 3600) / 60)
        const remainingSeconds = Math.floor(normalizedSeconds % 60)

        return `${sign}${days}d ${hours}h ${minutes}m ${remainingSeconds}s`
    }

    return (
        <Card className={styles.card} onClick={() => onClick(launch.id)}>
            <CardMedia
                component="img"
                className={styles.image}
                sx={{
                    width: '72px',
                    height: '72px',
                    minWidth: '72px',
                    flex: '0 0 72px',
                }}
                image={launch.image}
                alt={launch.name}
            />
            <div className={styles.content}>
                <div className={styles.topRow}>
                    <Typography className={styles.countdown}>
                        T-{convertToHHMMSS(launch.countdown_sec / 1000)}
                    </Typography>
                    <Typography className={styles.status}>
                        {launch.status.name}
                    </Typography>
                </div>

                <Typography className={styles.date}>
                    {new Date(launch.net).toLocaleString()}
                </Typography>

                <div className={styles.metaRow}>
                    <Typography className={styles.metaItem}>
                        {launch.launch_service_provider.name}
                    </Typography>
                    <Typography className={styles.metaItem}>
                        {launch.rocket.configuration.name}
                    </Typography>
                    <Typography className={styles.metaItem}>
                        {launch.mission.name}
                    </Typography>
                    <Typography className={styles.metaItem}>
                        {launch.pad.country_code}
                    </Typography>
                    <Typography className={styles.metaItem}>
                        {launch.pad.name}
                    </Typography>
                </div>
            </div>
        </Card>
    )
}
