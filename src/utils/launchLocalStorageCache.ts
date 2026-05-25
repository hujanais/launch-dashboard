export const LOCAL_STORAGE_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

export type TimedLocalStorageCache<T> = {
    data: T
    lastUpdated: string
}

export const isLocalStorageCacheStale = (
    lastUpdated: string | null | undefined
): boolean => {
    if (!lastUpdated) return true

    const updatedAt = Date.parse(lastUpdated)
    if (Number.isNaN(updatedAt)) return true

    return Date.now() - updatedAt > LOCAL_STORAGE_CACHE_MAX_AGE_MS
}

export const shouldRehydrateLocalStorageCache = (
    lastUpdated: string | null | undefined
): boolean => isLocalStorageCacheStale(lastUpdated)

export const isTimedLocalStorageCache = (
    value: unknown
): value is TimedLocalStorageCache<unknown> => {
    if (typeof value !== 'object' || value === null) return false

    const candidate = value as TimedLocalStorageCache<unknown>
    return (
        'data' in candidate &&
        'lastUpdated' in candidate &&
        typeof candidate.lastUpdated === 'string'
    )
}
