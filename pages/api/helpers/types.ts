import { NextApiRequest, NextApiResponse } from 'next'

export interface ApiRequest<Q, B extends Record<string, string> | undefined>
  extends Omit<NextApiRequest, 'query' | 'body'> {
  query: Q
  body: B
}

export type ApiResponse<T> = NextApiResponse<T>
