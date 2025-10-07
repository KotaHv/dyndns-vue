export interface History {
  oldIp: string | null
  newIp: string
  version: string
  updated: string
}

export interface HistoryRes {
  total: number
  histories: History[]
}

export enum HistoryIpVersion {
  V4 = 'V4',
  V6 = 'V6',
}

export type SortOrder = 'asc' | 'desc'

export interface SortItem {
  key: string
  order: SortOrder
}
