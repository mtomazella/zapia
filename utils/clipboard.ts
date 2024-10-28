import { TSituation } from 'shared/types'

export const getSituationJsonStringDefinition = (situation: TSituation) => {
  return JSON.stringify(situation, null, 2)
}

export class SituationValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SituationValidationError'
  }
}

export const validateSituation = (situation: TSituation) => {
  if (!situation.name) {
    throw new SituationValidationError('Situação não possui nome')
  }

  if (!situation.expression) {
    throw new SituationValidationError('Situação não possui expressão')
  }

  if (!situation.controls || !Array.isArray(situation.controls)) {
    throw new SituationValidationError('Situação não possui controles')
  }

  if (!situation.variables || !Array.isArray(situation.variables)) {
    throw new SituationValidationError('Situação não possui variáveis')
  }

  situation.controls.forEach(control => {
    if (!control.name) {
      throw new SituationValidationError('Um controle não possui nome')
    }

    if (!control.actionType) {
      throw new SituationValidationError('Um controle não possui tipo de ação')
    }

    if (!control.controlType) {
      throw new SituationValidationError(
        'Um controle não possui tipo de controle'
      )
    }

    if (!control.value) {
      throw new SituationValidationError('Um controle não possui valor')
    }
  })

  situation.variables.forEach(variable => {
    if (!variable.key) {
      throw new SituationValidationError('Uma variável não possui nome')
    }

    if (!variable.value) {
      throw new SituationValidationError('Uma variável não possui valor')
    }
  })

  return true
}
