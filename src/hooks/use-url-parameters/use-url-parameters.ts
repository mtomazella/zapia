import { useLocation } from 'react-router-dom'

export const useUrlParameters = (): {
  space?: string
  id?: string
  initialExpression?: string
} => {
  const { search } = useLocation()
  const query = new URLSearchParams(search)

  return {
    space: query.get('space') ?? undefined,
    id: query.get('id') ?? undefined,
    initialExpression: query.get('initialExpression') ?? undefined,
  }
}
