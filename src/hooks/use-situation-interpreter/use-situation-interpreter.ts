import { useCallback, useMemo, useState } from 'react'

import { Parser } from 'expr-eval'
import { clone, isNaN } from 'lodash'
import { TSituation, TSpaceVariable } from 'shared/types'
import { validate } from 'utils/dice'

export type TComputedVariable = {
  key: string
  value: string
  computedValue: string
}

export type Expression = {
  expression: string
  group?: string
}

type Result = {
  expression: Expression[]
  displayExpression: Expression[]
  error: string | null
  computedVariables: Record<string, TComputedVariable>
}

export const extractExpressionGroups = (rawExpression: string) => {
  let duppedGroupedExpressions: Expression[] = []
  while (rawExpression.includes('{') && rawExpression.includes('}')) {
    const openingIndex = rawExpression.indexOf('{') + 1
    const closingIndex = rawExpression.indexOf('}')
    let [expression, group] = rawExpression
      .slice(openingIndex, closingIndex)
      .split(';')

    rawExpression =
      rawExpression.slice(0, openingIndex - 1) +
      rawExpression.slice(closingIndex + 1)

    if (!expression || expression.trim() === '') continue

    group = (group ?? '').trim().toLowerCase()

    duppedGroupedExpressions.push({
      expression,
      group: !group ? undefined : group,
    })
  }

  duppedGroupedExpressions = duppedGroupedExpressions.filter(
    e => e !== null
  ) as Expression[]

  if (rawExpression.replaceAll(' ', '').length) {
    duppedGroupedExpressions.push({
      expression: rawExpression,
    })
  }

  return duppedGroupedExpressions
}

export const useSituationInterpreter = ({
  situation,
  globalVariables,
}: {
  situation: TSituation
  globalVariables?: TSpaceVariable[]
}): Result => {
  const { expression, variables, controls } = situation ?? {}

  const [error, setError] = useState<string | null>(null)
  const [displayExpression, setDisplayExpression] = useState<Expression[]>([])

  const cleanExpression = (expr: string) => (expr ?? '').replaceAll(' ', '')

  const getVariablesToReplace = (expr: string) => {
    try {
      expr = expr.toString()
      return Array.from(expr.matchAll(/\[(.*?)\]/g)).map(e => e[1])
    } catch (e) {
      console.error(e, expr)
      return []
    }
  }

  const computeVariableValue = useCallback(
    (targetKey: string) => {
      const foundKey = [...(variables ?? []), ...(globalVariables ?? [])].find(
        ({ key }) => key.toLowerCase() === targetKey.toLowerCase()
      )
      if (!foundKey) return null

      let variableValue = foundKey.value
      ;(controls ?? []).forEach(({ active, actionType, value }) => {
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

      return (variableValue ?? '').toString()
    },
    [variables, controls, globalVariables]
  )

  const applyVariablesToExpression = useCallback(
    (expr: string) => {
      const neededVariables = getVariablesToReplace(expr)
      let builtExpression = expr

      for (const key of neededVariables) {
        const value = computeVariableValue(key)

        if (!value && value !== '') {
          setError(`Variável não encontrada (${key})`)
          return expr
        }

        builtExpression = builtExpression.replaceAll(`[${key}]`, value)
      }

      return builtExpression
    },
    [variables, controls, getVariablesToReplace, computeVariableValue]
  )

  const computedVariables = useMemo(() => {
    const result = (variables ?? [])
      .map(({ key, value }) => {
        const computedValue = applyVariablesToExpression(`[${key}]`)
        return { key, value, computedValue }
      })
      .reduce((acc: Record<string, TComputedVariable>, variable) => {
        acc[variable.key] = variable
        return acc
      }, {})

    return result
  }, [variables, controls])

  const preparedExpression: Expression[] = useMemo(() => {
    setError(null)

    const treatedExpression = cleanExpression(expression)

    let controlledExpression = treatedExpression
    ;(controls ?? []).forEach(({ active, actionType, value }) => {
      if (!active) return

      if (actionType === 'substitute') controlledExpression = value
      else if (actionType === 'add')
        controlledExpression += `${
          ['+', '-', '{'].includes(value.charAt(0)) ? '' : '+'
        }${value}`
    })

    const duppedGroupedExpressions =
      extractExpressionGroups(controlledExpression)

    const groupedExpressions: Expression[] = []
    duppedGroupedExpressions.forEach(({ expression, group }) => {
      const alreadyMapped = groupedExpressions.findIndex(
        ge => ge.group === group
      )

      if (alreadyMapped === -1) {
        groupedExpressions.push({ group, expression })
      } else {
        groupedExpressions[alreadyMapped] = {
          group,
          expression: `${groupedExpressions[alreadyMapped]?.expression}${
            ['+', '-'].includes(expression.charAt(0)) &&
            expression.trim().length
              ? ''
              : '+'
          }${expression}`,
        }
      }
    })

    setDisplayExpression(groupedExpressions)

    const builtExpressions = groupedExpressions.map(e => {
      const builtExpression = applyVariablesToExpression(e.expression).trim()
      if (!validate(builtExpression)) {
        setError(`Expressão inválida no grupo ${e.group ?? 'padrão'}`)
      }
      return {
        ...e,
        expression: builtExpression,
      }
    })

    return builtExpressions as Expression[]
  }, [expression, controls, globalVariables])

  return {
    expression: preparedExpression,
    displayExpression,
    error,
    computedVariables,
  }
}
