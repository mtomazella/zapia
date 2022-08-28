import {
  faDiceD20,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CardContent, IconButton } from '@mui/material'
import React, { useCallback, useEffect, useMemo } from 'react'
import { TSituation } from 'shared/types'
import RpgRoller from 'roll'

import { Row, StyledSituation } from './Situation.styled'
import { ErrorOutlineOutlined } from '@mui/icons-material'

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
    [currentExpression]
  )

  const rollCurrentExpression = useCallback(
    () => isValidExpression && roll(currentExpression),
    [roll, currentExpression]
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
