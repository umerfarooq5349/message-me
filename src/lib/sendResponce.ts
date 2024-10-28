export function sendResponce(
  success: boolean,
  message: string,
  status: number,
  data?: unknown
) {
  return Response.json({ success, message, data }, { status });
}
