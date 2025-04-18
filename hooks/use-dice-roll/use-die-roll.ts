import { useCallback, useState } from 'react'

import { DiceRoll, DiceRoller } from '@dice-roller/rpg-dice-roller'
import { validate } from 'utils/dice'

const rpgRoller = new DiceRoller()

type UseDieRollParams = {
  duration?: number // ms
}

export const useDieRoll = ({ duration = 1000 }: UseDieRollParams = {}) => {
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<DiceRoll | DiceRoll[] | undefined>(
    undefined
  )
  const [error, setError] = useState<string>()

  const roll = useCallback(
    async (expression: string) => {
      setError(undefined)
      setIsRolling(true)
      setResult(undefined)
      expression = !expression ? '1d20' : expression

      if (!validate(expression)) {
        setTimeout(() => {
          setIsRolling(false)
          setError('Expressão inválida')
        })
        return
      }

      console.log(expression)

      const result = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const result = rpgRoller.roll(expression)
          setResult(result)
          setIsRolling(false)
          resolve(result)
        }, duration)
      })

      return { result: result as DiceRoll }
    },
    [duration, setError, setIsRolling, setResult]
  )

  return {
    roll,
    isRolling,
    result: (result as DiceRoll)?.total,
    completeTotal: (result as DiceRoll)?.toString(),
    error,
  }
}
