import { Parser } from '@dice-roller/rpg-dice-roller'

export const validate = (expression: string) => {
  try {
    Parser.parse(expression)
    return true
  } catch (err) {
    return false
  }
}
