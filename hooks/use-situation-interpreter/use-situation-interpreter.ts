import { useCallback, useMemo, useState } from 'react'
import { clone, isNaN } from 'lodash'

import { TSituation } from 'shared/types'
import { validate } from 'utils/dice'
import { Parser } from 'expr-eval'

export const useSituationInterpreter = ({
  situation,
}: {
  situation: TSituation
}): { expression: string; displayExpression: string; error: string | null } => {
  const { expression, variables = [], controls = [] } = situation

  const [error, setError] = useState<string | null>(null)
  const [displayExpression, setDisplayExpression] = useState('')

  const cleanExpression = (expr: string) => expr.replaceAll(' ', '')

  const getVariablesToReplace = (expr: string) =>
    Array.from(expr.matchAll(/\[(.*?)\]/g)).map(e => e[1])

  const getVariableValue = useCallback(
    (targetKey: string) => {
      const foundKey = variables.find(
        ({ key }) => key.toLowerCase() === targetKey.toLowerCase()
      )
      if (!foundKey) return null

      let variableValue = foundKey.value
      controls.forEach(({ active, actionType, value }) => {
        if (!active || actionType !== 'variable') return

        const variableChanges = value.split(';')
        variableChanges.forEach(variableChange => {
          let [variableKey, change] = variableChange.split(':')

          variableKey = variableKey.trim()

          if (variableKey.toLowerCase() !== targetKey.toLowerCase().trim())
            return

          const valueBeforeChange = clone(variableValue)

          const changeWithVariablesApplied = applyVariables(change)

          try {
            if (changeWithVariablesApplied.charAt(0) === '=')
              variableValue = changeWithVariablesApplied.slice(1)
            else
              variableValue = Parser.evaluate(
                `${variableValue}${changeWithVariablesApplied}`
              ).toString()

            if (isNaN(variableValue)) {
              setError(
                `Erro ao calcular variável ${variableKey}: ${valueBeforeChange}${change}`
              )
              return
            }
          } catch (e) {
            setError(
              `Erro ao calcular variável ${variableKey}: ${valueBeforeChange}${change}`
            )
          }
        })
      })

      return variableValue
    },
    [variables, controls]
  )

  const applyVariables = useCallback(
    (expr: string) => {
      const neededVariables = getVariablesToReplace(expr)
      let builtExpression = expr

      for (const key of neededVariables) {
        const value = getVariableValue(key)

        if (!value) {
          setError(`Variável não encontrada (${key})`)
          return expr
        }

        builtExpression = builtExpression.replaceAll(`[${key}]`, value)
      }

      return builtExpression
    },
    [variables, controls]
  )

  const preparedExpression = useMemo(() => {
    setError(null)

    const treatedExpression = cleanExpression(expression)

    let controlledExpression = treatedExpression
    controls.forEach(({ active, actionType, value }) => {
      if (!active) return

      if (actionType === 'substitute') controlledExpression = value
      else if (actionType === 'add')
        controlledExpression += `${
          value.charAt(0) === '+' || value.charAt(0) === '-' ? '' : '+'
        }${value}`
    })
    setDisplayExpression(controlledExpression)

    let builtExpression = applyVariables(controlledExpression)

    if (!validate(builtExpression)) {
      setError('Expressão inválida')
      return expression
    }

    return builtExpression
  }, [situation])

  return {
    expression: preparedExpression,
    displayExpression,
    error,
  }
}
