// 0.1

export type TActionType_0_1 = 'add' | 'substitute'
export type TControlType_0_1 = 'boolean'

export type TSituationVariable_0_1 = {
  key: string
  value: string
}
export type TSituationControl_0_1 = {
  name: string
  active: boolean
  actionType: TActionType_0_1
  controlType: TControlType_0_1
  value: string
}

export type TSituation_0_1 = {
  id: string
  name: string
  expression: string
  variables?: TSituationVariable_0_1[]
  controls?: TSituationControl_0_1[]
}

export type TSpace_0_1 = {
  situations: TSituation_0_1[]
}

export type TData_0_1 = {
  version: '0.1'
  spaces: Record<string, TSpace_0_1>
}
