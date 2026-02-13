export interface LaunchData {
    count: number
    next: string | null
    previous: string | null
    results: LaunchResult[]
}

export interface LaunchResult {
    id: string
    url: string
    slug: string
    name: string
    status: LaunchStatus
    last_updated: string
    net: string
    window_end: string
    window_start: string
    net_precision: Precision
    probability: number | null
    weather_concerns: string | null
    holdreason: string
    failreason: string
    hashtag: string | null
    launch_service_provider: Agency
    rocket: Rocket
    mission: Mission
    pad: Pad
    webcast_live: boolean
    image: string
    infographic: string | null
    program: Program[]
    orbital_launch_attempt_count: number
    location_launch_attempt_count: number
    pad_launch_attempt_count: number
    agency_launch_attempt_count: number
    orbital_launch_attempt_count_year: number
    location_launch_attempt_count_year: number
    pad_launch_attempt_count_year: number
    agency_launch_attempt_count_year: number
    type: string
}

interface LaunchStatus {
    id: number
    name: string
    abbrev: string
    description: string
}

interface Precision {
    id: number
    name: string
    abbrev: string
    description: string
}

interface Agency {
    id: number
    url: string
    name: string
    type: string
    featured?: boolean
    country_code?: string
    abbrev?: string
    description?: string
    administrator?: string
    founding_year?: string
    launchers?: string
    spacecraft?: string
    launch_library_url?: string | null
    total_launch_count?: number
    consecutive_successful_launches?: number
    successful_launches?: number
    failed_launches?: number
    pending_launches?: number
    consecutive_successful_landings?: number
    successful_landings?: number
    failed_landings?: number
    attempted_landings?: number
    info_url?: string
    wiki_url?: string
    logo_url?: string
    image_url?: string
    nation_url?: string
}

interface Rocket {
    id: number
    configuration: RocketConfiguration
}

interface RocketConfiguration {
    id: number
    url: string
    name: string
    family: string
    full_name: string
    variant: string
}

interface Mission {
    id: number
    name: string
    description: string
    launch_designator: string | null
    type: string
    orbit: Orbit
    agencies: Agency[]
    info_urls: string[]
    vid_urls: string[]
}

interface Orbit {
    id: number
    name: string
    abbrev: string
}

interface Pad {
    id: number
    url: string
    agency_id: string | null
    name: string
    description: string
    info_url: string | null
    wiki_url: string
    map_url: string
    latitude: string
    longitude: string
    location: Location
    country_code: string
    map_image: string
    total_launch_count: number
    orbital_launch_attempt_count: number
}

interface Location {
    id: number
    url: string
    name: string
    country_code: string
    description: string
    map_image: string
    timezone_name: string
    total_launch_count: number
    total_landing_count: number
}

interface Program {
    id: number
    url: string
    name: string
    description: string
    agencies: Agency[]
    image_url: string
    start_date: string
    end_date: string | null
    info_url: string
    wiki_url: string
    mission_patches: MissionPatch[]
    type: ProgramType
}

interface MissionPatch {
    id: number
    name: string
    priority: number
    image_url: string
    agency: Agency
}

interface ProgramType {
    id: number
    name: string
}
