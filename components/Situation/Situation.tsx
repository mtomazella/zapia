import React, { useCallback } from 'react'

import { faDiceD20 } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ErrorOutlineOutlined } from '@mui/icons-material'
import { CardContent, IconButton } from '@mui/material'
import { useSituationInterpreter } from 'hooks'
import { TSituation } from 'shared/types'

import { Row, StyledSituation } from './Situation.styled'

type TSituationComponent = {
  situation: TSituation
  roll: (expression: string) => void
  save: (situation: TSituation) => void
}

export const Situation: React.FC<TSituationComponent> = ({
  situation,
  roll,
}) => {
  const { name } = situation
  const { expression, displayExpression, error } = useSituationInterpreter({
    situation,
  })

  // useEffect(() => {
  //   save(situation)
  // })

  const rollCurrentExpression = useCallback(
    () => !error && roll(expression),
    [roll, expression],
  )

  return (
    <StyledSituation>
      <CardContent>
        <Row>
          <div>
            <h3>{name}</h3>
            <h4>{displayExpression}</h4>
          </div>
          <div>
            <IconButton onClick={rollCurrentExpression}>
              <FontAwesomeIcon icon={faDiceD20} />
            </IconButton>
          </div>
        </Row>

        {!!error && (
          <Row className="invalid-expression">
            <ErrorOutlineOutlined />
            <label>{error}</label>
          </Row>
        )}
      </CardContent>
    </StyledSituation>
  )
}
