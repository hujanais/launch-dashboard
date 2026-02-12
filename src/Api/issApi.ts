import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export type IssResponse = {
    timestamp: number
    message: string
    iss_position: {
        latitude: number
        longitude: number
    }
}

export const useIssHook = () => {
    const [isPaused, setIsPaused] = useState(false)

    const fetchIss = async (): Promise<IssResponse> => {
        try {
            const response = await fetch(
                'http://api.open-notify.org/iss-now.json'
            )
            return response.json()
        } catch (error) {
            console.log(error)
            return {
                timestamp: 0,
                message: 'error',
                iss_position: { latitude: 0, longitude: 0 },
            }
        }
    }

    const issQuery = useQuery({
        queryKey: ['iss'],
        queryFn: fetchIss,
        refetchInterval: 10000,
        enabled: !isPaused,
    })

    return { issQuery, isPaused, setIsPaused }
}
