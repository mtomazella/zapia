import { faDiceD20 } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CardContent, IconButton } from '@mui/material'
import React, { useCallback, useEffect, useMemo } from 'react'
import { TSituation } from 'shared/types'

import { StyledSituation } from './Situation.styled'

type TSituationComponent = {
  situation: TSituation
  roll: (expression: string) => void
  save: (situation: TSituation) => void
}

export const Situation: React.FC<TSituationComponent> = ({ situation, roll }) => {
  const { expression, name } = situation

  useEffect(() => {
    // save(situation)
  })

  const currentExpression = useMemo(() => expression, [expression])

  const rollCurrentExpression = useCallback(() => roll(currentExpression), [roll, currentExpression])

  return (
    <StyledSituation>
      <CardContent>
        <section>
          <h3>{name}</h3>
          <h4>{expression}</h4>
        </section>
        <section>
          <IconButton onClick={rollCurrentExpression}>
            <FontAwesomeIcon icon={faDiceD20} />
          </IconButton>
        </section>
      </CardContent>
    </StyledSituation>
  )
}
