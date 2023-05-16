import request from "@/utils/request";

const URL = "interfaces";

export async function get(): Promise<string[]> {
  return await request.get(URL).json();
}
