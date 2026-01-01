import { isArray } from 'lodash'

export const updateLocalStorageData = () => undefined

const updateData = (data: unknown[] | Record<string, unknown>): unknown => {
  const version: number | string = isArray(data)
    ? '0'
    : (data.version as string) ?? '0.1'
  if (converters[version]) return updateData(converters[version](data))
  return data
}

// NOTE: the current version MUST be the last in the object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const converters: Record<string, (data: any) => any> = {}
