import { MaterialColor, TActionType } from './types'

export const ACTION_TYPE_DISPLAY_TEXT: Record<TActionType, string> = {
  add: 'Adicionar',
  substitute: 'Substituir',
}

export const ACTION_TYPE_COLORS: Record<TActionType, MaterialColor> = {
  add: 'success',
  substitute: 'error',
}
