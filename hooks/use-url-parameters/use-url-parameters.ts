import { useRouter } from 'next/router'
import React from 'react'

export const useUrlParameters = (): {
  space?: string
} => {
  const { query } = useRouter()

  return {
    space: query.space as string | undefined
  }
}
