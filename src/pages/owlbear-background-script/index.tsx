import { useOwlbearIntegration } from 'hooks/use-owlbear-integration'
import { useEffect } from 'react'

export const OwlbearBackgroundScript = () => {
  const { initializeHistoryOnReady } = useOwlbearIntegration()
  useEffect(() => {
    initializeHistoryOnReady()
  }, [])

  return null
}
