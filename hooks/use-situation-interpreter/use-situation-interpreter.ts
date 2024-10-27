import { useCallback, useMemo, useState } from 'react'
import { clone, isNaN } from 'lodash'

import { TSituation } from 'shared/types'
import { validate } from 'utils/dice'
import { Parser } from 'expr-eval'

export type TComputedVariable = {
  key: string
  value: string
  computedValue: string
}

export const useSituationInterpreter = ({
  situation,
}: {
  situation: TSituation
}): {
  expression: string
  displayExpression: string
  error: string | null
  computedVariables: Record<string, TComputedVariable>
} => {
  const { expression, variables = [], controls = [] } = situation

  const [error, setError] = useState<string | null>(null)
  const [displayExpression, setDisplayExpression] = useState('')

  const cleanExpression = (expr: string) => expr.replaceAll(' ', '')

  const getVariablesToReplace = (expr: string) => {
    try {
      if (!expr) return []
      expr = expr.toString()
      return Array.from(expr.matchAll(/\[(.*?)\]/g)).map(e => e[1])
    } catch (e) {
      console.error(e, expr)
      return []
    }
  }

  const computeVariableValue = useCallback(
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

          const changeWithVariablesApplied = applyVariablesToExpression(change)

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

  const applyVariablesToExpression = useCallback(
    (expr: string) => {
      const neededVariables = getVariablesToReplace(expr)
      let builtExpression = expr

      for (const key of neededVariables) {
        const value = computeVariableValue(key)

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

  const computedVariables = useMemo(() => {
    const result = variables
      .map(({ key, value }) => {
        debugger
        const computedValue = applyVariablesToExpression(`[${key}]`)
        return { key, value, computedValue }
      })
      .reduce((acc: Record<string, TComputedVariable>, variable) => {
        acc[variable.key] = variable
        return acc
      }, {})

    debugger
    return result
  }, [variables, controls])

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

    let builtExpression = applyVariablesToExpression(controlledExpression)

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
    computedVariables,
  }
}
