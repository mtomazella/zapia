import { useOwlbearIntegration } from 'hooks/use-owlbear-integration'
import { useEffect } from 'react'

export const OwlbearBackgroundScript = () => {
  const { initializeHistory } = useOwlbearIntegration()
  useEffect(() => {
    initializeHistory()
  }, [])

  return null
}
