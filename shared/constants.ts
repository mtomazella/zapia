import { MaterialColor, TActionType } from './types'

export const ACTION_TYPE_DISPLAY_TEXT: Record<TActionType, string> = {
  add: 'Adicionar',
  substitute: 'Substituir',
  variable: 'Variável',
}

export const ACTION_TYPE_COLORS: Record<TActionType, MaterialColor> = {
  add: 'success',
  substitute: 'error',
  variable: 'warning',
}

export const LOCAL_STORAGE_KEY = 'rpg-dice-data'
export const DEFAULT_SPACE = 'Padrão'
export const CONNECTION_STORAGE_KEY = 'rpg-dice-connection'

export const SPACE_PAGE_ROUTE = ''
export const EDIT_SITUATION_PAGE_ROUTE = 'situation'
export const HELP_PAGE_ROUTE = 'help'
export const EDIT_SPACES_PAGE_ROUTE = 'spaces'
export const CONNECTION_CONFIG_ROUTE = 'connection'

export const BOT_URL =
  'https://discord.com/api/oauth2/authorize?client_id=1190519346708086954&permissions=8&scope=bot%20applications.commands'
