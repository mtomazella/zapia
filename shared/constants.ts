import { MaterialColor, TActionType } from './types'

export const ACTION_TYPE_DISPLAY_TEXT: Record<TActionType, string> = {
  add: 'Adicionar',
  substitute: 'Substituir',
}

export const ACTION_TYPE_COLORS: Record<TActionType, MaterialColor> = {
  add: 'success',
  substitute: 'error',
}

export const LOCAL_STORAGE_KEY = 'rpg-dice-data'
export const DEFAULT_SPACE = 'Padrão'

export const SPACE_PAGE_ROUTE = ''
export const EDIT_SITUATION_PAGE_ROUTE = 'situation'
export const HELP_PAGE_ROUTE = 'help'
export const EDIT_SPACES_PAGE_ROUTE = 'spaces'
