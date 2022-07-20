import { ApiRequest, ApiResponse } from "./helpers/types";

interface Query {
  socketId: string
  name: string
  roomId: string | undefined
}
interface Response {
  roomId: string
}

export default ({ query }: ApiRequest<Query, undefined>, response: ApiResponse<Response>) => {
  return response.
}