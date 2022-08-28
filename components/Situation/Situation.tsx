import React, { useCallback, useEffect, useMemo } from 'react'

import { faDiceD20 } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ErrorOutlineOutlined } from '@mui/icons-material'
import { CardContent, IconButton } from '@mui/material'
import RpgRoller from 'roll'
import { TSituation } from 'shared/types'

import { Row, StyledSituation } from './Situation.styled'

const { validate } = new RpgRoller()

type TSituationComponent = {
  situation: TSituation
  roll: (expression: string) => void
  save: (situation: TSituation) => void
}

export const Situation: React.FC<TSituationComponent> = ({
  situation,
  roll,
}) => {
  const { expression, name } = situation

  // useEffect(() => {
  //   save(situation)
  // })

  const currentExpression = useMemo(() => expression, [expression])

  const isValidExpression = useMemo(
    () => validate(currentExpression),
    [currentExpression],
  )

  const rollCurrentExpression = useCallback(
    () => isValidExpression && roll(currentExpression),
    [roll, currentExpression],
  )

  return (
    <StyledSituation>
      <CardContent>
        <Row>
          <div>
            <h3>{name}</h3>
            <h4>{currentExpression}</h4>
          </div>
          <div>
            <IconButton onClick={rollCurrentExpression}>
              <FontAwesomeIcon icon={faDiceD20} />
            </IconButton>
          </div>
        </Row>

        {!isValidExpression && (
          <Row className="invalid-expression">
            <ErrorOutlineOutlined />
            <label>Expressão inválida</label>
          </Row>
        )}
      </CardContent>
    </StyledSituation>
  )
}
