export type TSituation = {
  id: string
  name: string
  expression: string
  variables?: Record<string, string>
  controls?: {
    name: string
    active: boolean
    actionType: 'add' | 'substitute'
    controlType: 'boolean'
    value: string
  }[]
}
