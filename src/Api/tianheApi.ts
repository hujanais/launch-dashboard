import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

function getN2yoApiKey(): string {
    const v = import.meta.env.VITE_N2YO_API_KEY
    return typeof v === 'string' ? v.trim() : ''
}

/** NORAD catalog id (example: 25544 = ISS). */
const NORAD_ID = 48274 // Tianhe core module

/** Observer location for azimuth / elevation and visibility; coords in decimal degrees, alt in meters. */
const OBSERVER_LAT = 41.702
const OBSERVER_LNG = -76.014
const OBSERVER_ALT_M = 0
/** Seconds of positions to retrieve (multiple samples spaced ~1 s apart). */
const POSITION_SAMPLES_SECS = 30

/** `info` object from `/rest/v1/satellite/positions/...`. */
export type N2yoSatellitePositionsInfo = {
    satname: string
    satid: number
    transactionscount: number
}

/** One timestep in the `positions` array (latitude/longitude footprint from satellite subpoint). */
export type N2yoSatellitePosition = {
    satlatitude: number
    satlongitude: number
    sataltitude: number
    azimuth: number
    elevation: number
    ra: number
    dec: number
    /** Unix UTC time for this sample (seconds). */
    timestamp: number
}

export type N2yoSatellitePositionsResponse = {
    info: N2yoSatellitePositionsInfo
    positions: N2yoSatellitePosition[]
}

export function getLatestTianhePosition(
    data: N2yoSatellitePositionsResponse
): { latitude: number; longitude: number; t: number } | null {
    const { positions } = data
    if (!positions?.length) return null
    let best = positions[0]
    for (let i = 1; i < positions.length; i++) {
        if (positions[i].timestamp > best.timestamp) best = positions[i]
    }
    return {
        latitude: best.satlatitude,
        longitude: best.satlongitude,
        t: best.timestamp,
    }
}

export const useTianheHook = () => {
    const [isPaused, setIsPaused] = useState(false)
    const n2yoApiKey = getN2yoApiKey()
    const canFetchTianhe = n2yoApiKey.length > 0

    const fetchTianhe =
        async (): Promise<N2yoSatellitePositionsResponse> => {
            if (!n2yoApiKey) {
                throw new Error('VITE_N2YO_API_KEY is not set')
            }
            const path = [
                NORAD_ID,
                OBSERVER_LAT,
                OBSERVER_LNG,
                OBSERVER_ALT_M,
                POSITION_SAMPLES_SECS,
            ].join('/')
            /** Proxied via Vite (dev/preview) and `vercel.json` so responses are same-origin → no n2yo CORS. */
            const url = `/api/n2yo/rest/v1/satellite/positions/${path}?apiKey=${encodeURIComponent(n2yoApiKey)}`
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(
                    `n2yo positions request failed: ${response.status} ${response.statusText}`
                )
            }
            return response.json() as Promise<N2yoSatellitePositionsResponse>
        }

    const tianheQuery = useQuery({
        queryKey: ['tianhe'],
        queryFn: fetchTianhe,
        refetchInterval: canFetchTianhe ? 60000 : false,
        enabled: canFetchTianhe && !isPaused,
    })

    return { tianheQuery, isPaused, setIsPaused, canFetchTianhe }
}
