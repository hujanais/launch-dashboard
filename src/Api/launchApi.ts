import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type {
    APIThrottleResponse,
    LaunchResponse,
    PreviousLaunchesResponse,
} from '../models/launch_model'

const EMPTY_LAUNCH_RESPONSE: LaunchResponse = {
    count: 0,
    next: null,
    previous: null,
    results: [],
}
const EMPTY_API_THROTTLE_RESPONSE: APIThrottleResponse = []
const EMPTY_AGENCY_DIRECTORY: AgencyDirectory = {}

type AgencyDirectoryEntry = {
    name: string
    country: string
}

export type AgencyDirectory = Record<number, AgencyDirectoryEntry>

type AgencyLookupResponse = {
    results: Array<{
        id: number
        name: string
        country: Array<{ name: string }>
        country_code: string | null
    }>
}

export const fetchUpcomingLaunches = async (
    page: number
): Promise<LaunchResponse> => {
    try {
        const utcNow = encodeURIComponent(new Date().toISOString())
        const response = await fetch(
            `https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=10&offset=${page * 10}&status=1&net__gte=${utcNow}`
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

export const fetchPreviousLaunchesYearToDate = async (
    page: number
): Promise<PreviousLaunchesResponse> => {
    try {
        const now = new Date()
        const year = now.getUTCFullYear()
        const limit = 100
        let offset = page * limit
        let next: string | null = null
        const allResults: PreviousLaunchesResponse['results'] = []
        let totalCount = 0
        let firstPrevious: string | null = null

        do {
            const response = await fetch(
                `https://ll.thespacedevs.com/2.3.0/launches/previous/?year=${year}&mode=normal&limit=${limit}&offset=${offset}`
            )
            const data: PreviousLaunchesResponse = await response.json()

            totalCount = data.count
            firstPrevious = firstPrevious ?? data.previous
            allResults.push(...data.results)
            next = data.next
            offset += limit
        } while (next)

        return {
            count: totalCount,
            next: null,
            previous: firstPrevious,
            results: allResults,
        }
    } catch (error) {
        console.log(error)
        return EMPTY_LAUNCH_RESPONSE
    }
}

export const fetchAgenciesByIds = async (
    agencyIds: number[]
): Promise<AgencyDirectory> => {
    try {
        if (agencyIds.length === 0) return EMPTY_AGENCY_DIRECTORY

        const uniqueAgencyIds = Array.from(new Set(agencyIds))
        const response = await fetch(
            `https://ll.thespacedevs.com/2.3.0/agencies/?mode=list&limit=100&id=${uniqueAgencyIds.join(',')}`
        )
        const data: AgencyLookupResponse = await response.json()

        return data.results.reduce<AgencyDirectory>((acc, agency) => {
            acc[agency.id] = {
                name: agency.name,
                country:
                    agency.country?.[0]?.name ?? agency.country_code ?? 'N/A',
            }
            return acc
        }, {})
    } catch (error) {
        console.log(error)
        return EMPTY_AGENCY_DIRECTORY
    }
}

export const fetchAPIThrottle = async (): Promise<APIThrottleResponse> => {
    try {
        const response = await fetch(
            'https://ll.thespacedevs.com/2.3.0/api-throttle/'
        )
        const data: APIThrottleResponse = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return EMPTY_API_THROTTLE_RESPONSE
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

export const usePreviousLaunchHook = (page: number) => {
    const previousLaunchQuery = useQuery({
        queryKey: ['previousLaunchesYTD', page],
        queryFn: () => fetchPreviousLaunchesYearToDate(page),
        placeholderData: keepPreviousData,
    })

    return { previousLaunchQuery }
}

export const useAPIThrottleHook = () => {
    const apiThrottleQuery = useQuery({
        queryKey: ['apiThrottle'],
        queryFn: fetchAPIThrottle,
    })

    return { apiThrottleQuery }
}
