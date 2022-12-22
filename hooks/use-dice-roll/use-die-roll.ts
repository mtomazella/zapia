import { useCallback, useState } from 'react'

import RpgRoller from 'roll'

const rpgRoller = new RpgRoller()

type UseDieRollParams = {
  duration?: number // ms
}

export const useDieRoll = ({ duration = 1000 }: UseDieRollParams = {}) => {
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<number | undefined>(undefined)
  const [error, setError] = useState<string>()

  const roll = useCallback(
    (expression: string) => {
      setError(undefined)
      setIsRolling(true)
      expression = !expression ? '1d20' : expression

      if (!rpgRoller.validate(expression)) {
        setTimeout(() => {
          setIsRolling(false)
          setError('Expressão inválida')
        })
        return
      }

      console.log(expression)

      setTimeout(() => {
        setResult(rpgRoller.roll(expression).result)
        setIsRolling(false)
      }, duration)
    },
    [duration, setError, setIsRolling, setResult],
  )

  return {
    roll,
    isRolling,
    result,
    error,
  }
}
