import { useIssHook } from '../../Api/issApi'
import {
    getLatestTiangongPosition,
    useTiangongHook,
} from '../../Api/tiangongApi'
import { IssMap } from './Components/IssMap'
import styles from './IssPage.module.scss'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export const IssPage = () => {
    const { issQuery } = useIssHook()
    const { tiangongQuery } = useTiangongHook()

    const issLat = Number(issQuery.data?.iss_position.latitude ?? 0)
    const issLon = Number(issQuery.data?.iss_position.longitude ?? 0)

    const tiangongLatest = tiangongQuery.data
        ? getLatestTiangongPosition(tiangongQuery.data)
        : null
    const tgLat = tiangongLatest?.latitude ?? 0
    const tgLon = tiangongLatest?.longitude ?? 0

    const fmt = (t: number) => new Date(t).toLocaleString()
    const issUpdated = issQuery.dataUpdatedAt ? fmt(issQuery.dataUpdatedAt) : '—'
    const tgUpdated = tiangongQuery.dataUpdatedAt
        ? fmt(tiangongQuery.dataUpdatedAt)
        : '—'

    return (
        <div className={styles.mainContainer}>
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: '1',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h6">ISS and Tiangong</Typography>
            </Box>
            <div>
                ISS updated: {issUpdated} · Tiangong updated: {tgUpdated}
            </div>
            <div className={styles.mapContainer}>
                <IssMap title="ISS" lat={issLat} lon={issLon} />
                <IssMap title="Tiangong" lat={tgLat} lon={tgLon} />
            </div>
        </div>
    )
}
