import React, { useEffect } from 'react'
import { useLaunchHook } from '../../Api/launchApi'

export const LaunchPage = () => {
    const { launchQuery } = useLaunchHook()

    useEffect(() => {
        launchQuery.refetch()
    }, [])

    return <div></div>
}
