import { useEffect, useState } from 'react'
import type { IssResponse } from '../../../Api/issApi'
import styles from './IssMap.module.scss'
import Globe from 'react-globe.gl'
import Button from '@mui/material/Button'

export const IssMap = ({ lat, lon }: { lat: number; lon: number }) => {
    const [latitude, setLatitude] = useState<number>(lat)
    const [longitude, setLongitude] = useState<number>(lon)

    const [pointsData, setPointsData] = useState<
        { lat: number; lng: number; size: number }[]
    >([])

    const clearMap = () => {
        setPointsData([])
    }

    useEffect(() => {
        setLatitude(lat)
        setLongitude(lon)

        setPointsData((prevState) => [
            ...prevState,
            { lat: lat, lng: lon, size: 0.5 },
        ])
    }, [lat, lon])

    return (
        <div className={styles.container}>
            <Button onClick={clearMap}>Clear Map</Button>
            <Globe
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                pointsData={pointsData}
                pointAltitude={0}
            />
        </div>
    )
}
