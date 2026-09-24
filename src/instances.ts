export interface Instances {
  hosts: Host[]
  last_update: string
  latest_commit: string
}

export interface Host {
  url: string
  domain: string
  points: number
  rss: boolean
  recent_pings: number | undefined[]
  ping_max: number
  ping_min: number
  ping_avg: number
  version?: string
  version_url?: string
  healthy: boolean
  last_healthy: string
  version_state: string
  is_upstream: boolean
  is_latest_version: boolean
  is_bad_host: boolean
  country: string
  recent_checks: [string, boolean][]
  healthy_percentage_overall: number
  connectivity: string
  __show_last_seen: boolean
}
