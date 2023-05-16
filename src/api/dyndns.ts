import request from "@/utils/request";
import { DynDNS } from "@/types/dyndns";

const URL = "dyndns";

export async function get(): Promise<DynDNS | null> {
  return await request.get(URL).json();
}

export function update(dynDNS: DynDNS): Promise<DynDNS> {
  return request.put(URL, { json: dynDNS }).json();
}

export function create(dynDNS: DynDNS): Promise<DynDNS> {
  return request.post(URL, { json: dynDNS }).json();
}
