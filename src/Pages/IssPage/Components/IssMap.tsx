import 'maplibre-gl/dist/maplibre-gl.css'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import type { StyleSpecification } from 'maplibre-gl'
import Map, {
    AttributionControl,
    Layer,
    Marker,
    NavigationControl,
    Source,
    type MapRef,
} from 'react-map-gl/maplibre'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import styles from './IssMap.module.scss'

const INITIAL_PLACEHOLDER: [number, number] = [-98, 39]

const ISS_MAP_STYLE: StyleSpecification = {
    version: 8,
    sources: {
        satellite: {
            type: 'raster',
            tiles: [
                'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution:
                '&copy; Esri, Earthstar Geographics, Maxar Technologies',
            maxzoom: 19,
        },
    },
    layers: [
        {
            id: 'satellite',
            type: 'raster',
            source: 'satellite',
            minzoom: 0,
            maxzoom: 22,
        },
    ],
}

const isPlaceholderCoords = (lat: number, lon: number) => lat === 0 && lon === 0

export const IssMap = ({
    title,
    lat,
    lon,
}: {
    title: string
    lat: number
    lon: number
}) => {
    const mapRef = useRef<MapRef>(null)

    const [trail, setTrail] = useState<[number, number][]>([])
    const [followIss, setFollowIss] = useState(true)

    const lineGeoJSON = useMemo(() => {
        if (trail.length < 2) return null
        return {
            type: 'Feature' as const,
            properties: {},
            geometry: {
                type: 'LineString' as const,
                coordinates: trail,
            },
        }
    }, [trail])

    const syncToIss = useCallback(() => {
        const map = mapRef.current?.getMap()
        if (!map || isPlaceholderCoords(lat, lon)) return
        map.flyTo({
            center: [lon, lat],
            zoom: Math.max(map.getZoom(), 3.5),
            pitch: 0,
            bearing: 0,
            duration: 1200,
            essential: true,
        })
    }, [lat, lon])

    useEffect(() => {
        if (isPlaceholderCoords(lat, lon)) return
        // eslint-disable-next-line react-hooks/set-state-in-effect -- trail mirrors polled lat/lon (react-query polling)
        setTrail((prev) => {
            const next: [number, number] = [lon, lat]
            const last = prev[prev.length - 1]
            if (last && last[0] === next[0] && last[1] === next[1]) {
                return prev
            }
            return [...prev, next]
        })
    }, [lat, lon])

    useEffect(() => {
        if (!followIss) return
        syncToIss()
    }, [followIss, lat, lon, syncToIss])

    const clearTrail = () => setTrail([])

    const suppressFollowInteraction = () => setFollowIss(false)

    const centerLon = !isPlaceholderCoords(lat, lon)
        ? lon
        : INITIAL_PLACEHOLDER[0]
    const centerLat = !isPlaceholderCoords(lat, lon)
        ? lat
        : INITIAL_PLACEHOLDER[1]
    const showMarker = !isPlaceholderCoords(lat, lon)

    return (
        <div className={styles.container}>
            <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                sx={{ alignSelf: 'stretch', mb: 1 }}
                alignItems="center"
            >
                <Typography>{title}</Typography>
                <Button variant="outlined" size="small" onClick={clearTrail}>
                    Clear trail
                </Button>
                <Button variant="text" size="small" onClick={syncToIss}>
                    Center {title}
                </Button>
                <Button
                    variant={followIss ? 'contained' : 'outlined'}
                    size="small"
                    color={followIss ? 'primary' : 'inherit'}
                    onClick={() => {
                        setFollowIss((v) => {
                            const next = !v
                            if (next) queueMicrotask(() => syncToIss())
                            return next
                        })
                    }}
                >
                    {followIss ? `Following ${title}` : 'Follow off'}
                </Button>
            </Stack>
            <Paper variant="outlined" className={styles.mapPaper} elevation={0}>
                <Map
                    ref={mapRef}
                    mapLib={maplibregl}
                    mapStyle={ISS_MAP_STYLE}
                    projection={{ type: 'mercator' }}
                    attributionControl={false}
                    style={{ width: '100%', height: '100%' }}
                    initialViewState={{
                        longitude: centerLon,
                        latitude: centerLat,
                        zoom: 2,
                        pitch: 0,
                        bearing: 0,
                    }}
                    maxPitch={0}
                    dragRotate={false}
                    touchPitch={false}
                    onDragStart={suppressFollowInteraction}
                    onWheel={suppressFollowInteraction}
                >
                    <NavigationControl
                        position="top-right"
                        showCompass={false}
                    />
                    <AttributionControl compact position="bottom-left" />
                    {lineGeoJSON ? (
                        <Source
                            id="iss-trail"
                            type="geojson"
                            data={lineGeoJSON}
                        >
                            <Layer
                                id="iss-trail-line"
                                type="line"
                                paint={{
                                    'line-color': '#ffab40',
                                    'line-width': 3,
                                    'line-opacity': 0.9,
                                }}
                            />
                        </Source>
                    ) : null}
                    {showMarker ? (
                        <Marker longitude={lon} latitude={lat} anchor="center">
                            <div
                                className={styles.marker}
                                aria-label="International Space Station position"
                            />
                        </Marker>
                    ) : null}
                </Map>
            </Paper>
        </div>
    )
}
