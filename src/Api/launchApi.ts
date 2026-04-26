import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { LaunchResponse } from '../models/launch_model'

const EMPTY_LAUNCH_RESPONSE: LaunchResponse = {
    count: 0,
    next: null,
    previous: null,
    results: [],
}

export const fetchUpcomingLaunches = async (page: number): Promise<LaunchResponse> => {
    try {
        const utcNow = encodeURIComponent(new Date().toISOString())
        const response = await fetch(
            `https://ll.thespacedevs.com/2.2.0/launch/upcoming?limit=10&offset=${page * 10}&status=1&net__gte=${utcNow}`
        )
        const data: LaunchResponse = await response.json()

        return {
            ...data,
            results: data.results.filter(
                (launch) => launch.status.name === 'Go for Launch'
            ),
        }
    } catch (error) {
        console.log(error)
        return EMPTY_LAUNCH_RESPONSE
    }
}

export const useLaunchHook = (page: number) => {
    const launchQuery = useQuery({
        queryKey: ['goForLaunch', page],
        queryFn: () => fetchUpcomingLaunches(page),
        placeholderData: keepPreviousData,
    })

    return { launchQuery }
}
