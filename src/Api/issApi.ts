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
        const response = await fetch('http://api.open-notify.org/iss-now.json')
        return response.json()
    }

    const issQuery = useQuery({
        queryKey: ['iss'],
        queryFn: fetchIss,
        refetchInterval: 10000,
        enabled: !isPaused,
    })

    return { issQuery, isPaused, setIsPaused }
}
