import { useRouter } from 'next/router'

export const useUrlParameters = (): {
  space?: string
  id?: string
  initialExpression?: string
} => {
  const { query } = useRouter()

  return {
    space: query.space as string | undefined,
    id: query.id as string | undefined,
    initialExpression: query.initialExpression as string | undefined,
  }
}
