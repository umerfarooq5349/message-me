// import { ApiResponse } from "@/types/apiResponse";

export function sendResponce(
  success: boolean,
  message: string,
  status: number,
  data?: unknown
): Response {
  return Response.json({ success, message, data }, { status });
}
