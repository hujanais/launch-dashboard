import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export interface LaunchResponse {
    count: number
    next: string | null
    previous: string | null
    results: Launch[]
}

export interface Launch {
    id: string
    url: string
    slug: string
    name: string
    status: Status
    last_updated: string // ISO 8601 date-time string
    net: string // ISO 8601 date-time string (No Earlier Than)
    window_end: string // ISO 8601 date-time string
    window_start: string // ISO 8601 date-time string
    net_precision: NetPrecision
    probability: number | null
    weather_concerns: string | null
    holdreason: string
    failreason: string
    hashtag: string | null
    launch_service_provider: LaunchServiceProvider | null
}

export interface Status {
    id: number
    name: string
    abbrev: string
    description: string
}

export interface NetPrecision {
    id: number
    name: string
    abbrev: string
    description: string
}

export interface LaunchServiceProvider {
    id: number
    url: string
    name: string
    type: string
}

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
