import { TSituation } from 'shared/types'

export const getSituationJsonStringDefinition = (situation: TSituation) => {
  return JSON.stringify(situation, null, 2)
}
