export interface DynDNS {
  server: string;
  username: string;
  password: string;
  hostname: string;
  ip: number;
  interface: string;
  sleep_interval: number;
}

export interface History {
  old_ip: string | null;
  new_ip: string;
  version: string;
  updated: string;
}

export interface HistoryRes {
  total: number;
  histories: History[];
}

export enum HistoryIpVersion {
  V4 = "V4",
  V6 = "V6",
}
