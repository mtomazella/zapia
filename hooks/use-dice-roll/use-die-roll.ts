import { useCallback, useState } from 'react'

import { DiceRoll, DiceRoller } from '@dice-roller/rpg-dice-roller'
import { validate } from 'utils/dice'
import { Expression } from 'hooks/use-situation-interpreter'

const rpgRoller = new DiceRoller()

type UseDieRollParams = {
  duration?: number // ms
}

export type RollResult = {
  result: DiceRoll
} & Expression

export const useDieRoll = ({ duration = 1000 }: UseDieRollParams = {}) => {
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<
    | { results: RollResult[]; total: number; stringResults: string[] }
    | undefined
  >(undefined)
  const [error, setError] = useState<string>()

  const roll = useCallback(
    async (
      expressions: Expression[]
    ): Promise<
      | { results: RollResult[]; total: number; stringResults: string[] }
      | undefined
    > => {
      setError(undefined)
      setIsRolling(true)
      setResult(undefined)
      expressions = !expressions ? [{ expression: '1d20' }] : expressions

      const results: RollResult[] = []
      for (const { expression, group } of expressions) {
        if (!validate(expression)) {
          setTimeout(() => {
            setIsRolling(false)
            setError('Expressão inválida')
          })
          return
        }
        const result = rpgRoller.roll(expression)
        results.push({ result: result as DiceRoll, expression, group })
      }

      const stringResults: string[] = []
      let total = 0

      results.forEach(r => {
        let string = r.result.toString()

        if (results.length !== 1 || r.group) {
          string = `${string.split(':')[0]} (${r.group}):${
            string.split(':')[1]
          }`
        }

        stringResults.push(string)

        total += r.result.total
      })

      await new Promise<void>(resolve => {
        setTimeout(() => {
          setResult({ results, stringResults, total })
          setIsRolling(false)
          resolve()
        }, duration)
      })

      return { results, stringResults, total }
    },
    [duration, setError, setIsRolling, setResult]
  )

  return {
    roll,
    isRolling,
    result,
    error,
  }
}
