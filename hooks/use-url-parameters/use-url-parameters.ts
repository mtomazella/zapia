import { useRouter } from 'next/router'

export const useUrlParameters = (): {
  space?: string
} => {
  const { query } = useRouter()

  return {
    space: query.space as string | undefined,
  }
}
