import { useCallback, useEffect, useState } from 'react'

import { DiceRoll } from '@dice-roller/rpg-dice-roller'

type UseDieRollParams = {
  expression: string
  duration?: number // ms
}

export const useDieRoll = ({
  expression,
  duration = 2000,
}: UseDieRollParams) => {
  const [isRolling, setRolling] = useState(false)
  const [result, setIsRolling] = useState<number | undefined>(undefined)

  const roll = useCallback(() => {
    setRolling(true)
    setTimeout(() => {
      setIsRolling(new DiceRoll(expression).total)
      setRolling(false)
    }, duration)
  }, [expression, duration])

  useEffect(() => {
    roll()
  }, [])

  return {
    roll,
    isRolling,
    result,
  }
}
