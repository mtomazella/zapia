export type MaterialColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'

export type TActionType = 'add' | 'substitute' | 'variable'
export type TControlType = 'boolean'

export type TSituationVariable = {
  key: string
  value: string
}
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
  variables?: TSituationVariable[]
  controls?: TSituationControl[]
}

export type TSpaceVariable = TSituationVariable
export type TSpace = {
  situations: TSituation[]
  variables: TSpaceVariable[]
}

export type TSavedData = {
  version: '0.1'
  spaces: Record<string, TSpace>
}

export type TConnectionInfo = {
  player?: string
  destinationKey?: string
  sendRolls?: boolean
}
export type TAllConnectionInfo = Record<string, TConnectionInfo>
