import { useEffect, useState } from 'react'
import { useIssHook, type IssResponse } from '../../Api/issApi'
import { IssMap } from './Components/IssMap'
import styles from './IssPage.module.scss'

export const IssPage = () => {
    const { issQuery } = useIssHook()
    const MAX_TRACK_LENGTH = 50

    const [lastUpdated, setLastUpdated] = useState<number>(0)
    const [track, setTrack] = useState<IssResponse[]>([])

    useEffect(() => {
        // Only add to list when we have data
        if (issQuery.data) {
            console.log('New data:', issQuery.data)
            setTrack((prev) => {
                const newTrack = [...prev, issQuery.data]
                if (newTrack.length > MAX_TRACK_LENGTH) {
                    newTrack.shift()
                }
                return newTrack
            })
            setLastUpdated(Date.now())
        } else {
            setTrack((prev) => [
                ...prev,
                {
                    timestamp: 0,
                    message: 'error',
                    iss_position: { latitude: 0, longitude: 0 },
                },
            ])
        }
    }, [issQuery.data])

    return (
        <div className={styles.mapContainer}>
            <div>Last updated: {lastUpdated.toLocaleString()}</div>
            <div>ISS Position History ({track.length} updates)</div>
            <IssMap track={track} />
        </div>
    )
}
