import request from '@/utils/request'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import type { HistoryRes, History, SortItem } from '@/types/history'
import { HistoryIpVersion } from '@/types/history'

dayjs.extend(utc)

const URL = 'history'

export async function get(page: number, perPage: number, sortBy: SortItem[]): Promise<HistoryRes> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  })
  if (sortBy.length) {
    params.append('sort_items', JSON.stringify(sortBy))
  }
  const res: HistoryRes = await request
    .get(URL, {
      searchParams: params,
    })
    .json()
  for (const h of res.histories) {
    h.updated = dayjs.utc(h.updated).local().format()
  }
  return res
}

export async function current(version: HistoryIpVersion): Promise<History | null> {
  const res: History | null = await request
    .get(URL + '/current', {
      searchParams: new URLSearchParams({
        version,
      }),
    })
    .json()
  if (res != null) {
    res.updated = dayjs.utc(res.updated).local().format()
  }
  return res
}
