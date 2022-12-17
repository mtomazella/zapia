export type MaterialColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'

export type TActionType = 'add' | 'substitute'
export type TControlType = 'boolean'

export type TSituationVariables = Record<string, string>
export type TSituationControl = {
  name: string
  active: boolean
  actionType: TActionType
  controlType: TControlType
  value: string
}

export type TSituation = {
  id: string
  name: string
  expression: string
  variables?: TSituationVariables
  controls?: TSituationControl[]
}
