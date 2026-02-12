import React, { useEffect, useState } from 'react'
import { useIssHook, type IssResponse } from '../../Api/issApi'

export const IssPage = () => {
    const { issQuery, isPaused, setIsPaused } = useIssHook()

    const [dataList, setDataList] = useState<IssResponse[]>([])

    if (issQuery.status === 'pending') {
        return <div>Pending...</div>
    }
    if (issQuery.status === 'error') {
        return <div>Error: {issQuery.error.message}</div>
    }

    useEffect(() => {
        // Only add to list when we have data
        if (issQuery.data) {
            console.log('New data:', issQuery.data)
            setDataList((prev) => [...prev, issQuery.data])
        }
    }, [issQuery.data]) // Watch 'data' instead of 'status'

    return (
        <div>
            <h2>ISS Position History ({dataList.length} updates)</h2>
            {dataList.map((item, index) => (
                <div key={index}>
                    {new Date(item.timestamp * 1000).toLocaleString()}
                </div>
            ))}
        </div>
    )
}
