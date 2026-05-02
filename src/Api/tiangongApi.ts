import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

/** One orbit sample from astroviewer ISS/Tiangong ws. */
export type TiangongOrbitSample = {
    t: number
    ln: number
    lt: number
    h: number
    v: number
    s: boolean
}

/** Raw payload from astroviewer orbit.php?sat=48274 */
export type TiangongResponse = {
    sat: number
    tRef: number
    orbitData: TiangongOrbitSample[]
}

/** Latest sample by UNIX time `t`; longitude → `ln`, latitude → `lt`. */
export function getLatestTiangongPosition(
    data: TiangongResponse
): { latitude: number; longitude: number; t: number } | null {
    const { orbitData } = data
    if (!orbitData?.length) return null
    let best = orbitData[0]
    for (let i = 1; i < orbitData.length; i++) {
        if (orbitData[i].t > best.t) best = orbitData[i]
    }
    return { latitude: best.lt, longitude: best.ln, t: best.t }
}

export const useTiangongHook = () => {
    const [isPaused, setIsPaused] = useState(false)

    const fetchtiangong = async (): Promise<TiangongResponse> => {
        try {
            const response = await fetch(
                'https://www.astroviewer.net/iss/ws/orbit.php?sat=48274'
            )
            return response.json() as Promise<TiangongResponse>
        } catch (error) {
            throw error
        }
    }

    const tiangongQuery = useQuery({
        queryKey: ['tiangong'],
        queryFn: fetchtiangong,
        refetchInterval: 10000,
        enabled: !isPaused,
    })

    return { tiangongQuery, isPaused, setIsPaused }
}
