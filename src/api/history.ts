import request from "@/utils/request";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { HistoryRes, HistoryIpVersion, History } from "@/types/dyndns";

dayjs.extend(utc);

const URL = "history";

export async function get(page: number, perPage: number): Promise<HistoryRes> {
  const res: HistoryRes = await request
    .get(URL, {
      searchParams: new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      }),
    })
    .json();
  for (const h of res.histories) {
    h.updated = dayjs.utc(h.updated).local().format();
  }
  return res;
}

export async function current(
  version: HistoryIpVersion
): Promise<History | null> {
  const res: History | null = await request
    .get(URL + "/current", {
      searchParams: new URLSearchParams({
        version,
      }),
    })
    .json();
  if (res != null) {
    res.updated = dayjs.utc(res.updated).local().format();
  }
  return res;
}
