import React, { useCallback } from 'react'

import { faDiceD20 } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DataArray, ErrorOutlineOutlined, Settings } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CardContent,
  Chip,
  IconButton,
  Switch,
} from '@mui/material'
import { useSituationInterpreter } from 'hooks'
import { isEmpty } from 'lodash'
import { ACTION_TYPE_COLORS, ACTION_TYPE_DISPLAY_TEXT } from 'shared/constants'
import { TSituation } from 'shared/types'
import { AppPalette } from 'style/palette'
import { v4 } from 'uuid'

import { Control, Row, StyledSituation, Variable } from './Situation.styled'

type TSituationComponent = {
  situation: TSituation
  roll: (expression: string) => void
  save: (situation: TSituation) => void
}

export const Situation: React.FC<TSituationComponent> = ({
  situation,
  roll,
}) => {
  const { name, controls, variables } = situation
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
      <CardContent>
        {!!controls && controls.length > 0 && (
          <Accordion>
            <AccordionSummary>
              <Settings
                fontSize="small"
                htmlColor={AppPalette.brand.teal.main}
              />
              <label>Controles</label>
            </AccordionSummary>
            <AccordionDetails>
              {controls.map(({ name, active, value, actionType }) => (
                <Control key={v4()}>
                  <div>
                    <h3>
                      {name}
                      <Chip
                        color={ACTION_TYPE_COLORS[actionType]}
                        label={ACTION_TYPE_DISPLAY_TEXT[actionType]}
                        size="small"
                      />
                    </h3>
                    <Switch checked={active} />
                  </div>
                  <p>{value}</p>
                </Control>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
        {!!variables && !isEmpty(variables) && (
          <Accordion>
            <AccordionSummary>
              <DataArray
                fontSize="small"
                htmlColor={AppPalette.brand.teal.main}
              />
              <label>Variáveis</label>
            </AccordionSummary>
            <AccordionDetails>
              {Object.keys(variables).map(key => (
                <Variable key={key}>
                  <b>{key}</b> <p>{variables[key]}</p>
                </Variable>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </StyledSituation>
  )
}
