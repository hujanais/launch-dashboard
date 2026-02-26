import { useEffect, useState } from 'react'
import { useIssHook, type IssResponse } from '../../Api/issApi'
import { IssMap } from './Components/IssMap'
import styles from './IssPage.module.scss'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export const IssPage = () => {
    const { issQuery } = useIssHook()

    const [lastUpdated, setLastUpdated] = useState<number>(0)
    const [latitude, setLatitude] = useState<number>(0)
    const [longitude, setLongitude] = useState<number>(0)

    useEffect(() => {
        // Only add to list when we have data
        if (issQuery.data) {
            setLatitude(issQuery.data.iss_position.latitude)
            setLongitude(issQuery.data.iss_position.longitude)
            setLastUpdated(Date.now())
        }
    }, [issQuery.data])

    return (
        <div className={styles.mapContainer}>
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: '1',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h6">Where is the ISS now?</Typography>
            </Box>
            <div>Last updated: {lastUpdated.toLocaleString()}</div>
            <IssMap lat={latitude} lon={longitude} />
        </div>
    )
}
