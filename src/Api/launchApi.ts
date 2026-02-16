import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { LaunchResponse } from '../models/launch_model'

export const useLaunchHook = (page: number) => {
    const fetchGoForLaunch = async (): Promise<LaunchResponse> => {
        try {
            const response = await fetch(
                `https://ll.thespacedevs.com/2.2.0/launch/upcoming?limit=10&offset=0&status=1&offset=${
                    page * 10
                }`
            )
            return response.json()
        } catch (error) {
            console.log(error)
            return {
                count: 0,
                next: null,
                previous: null,
                results: [],
            }
        }
    }

    const launchQuery = useQuery({
        queryKey: ['goForLaunch', page],
        queryFn: fetchGoForLaunch,
        placeholderData: keepPreviousData,
    })

    return { launchQuery }
}
