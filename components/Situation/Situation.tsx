import React, { useCallback, useMemo } from 'react'

import { faDiceD20 } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  CopyAll,
  DataArray,
  Delete,
  Edit,
  ErrorOutlineOutlined,
  Settings,
} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Switch,
  Tooltip,
} from '@mui/material'
import { useSituationInterpreter } from 'hooks'
import { isEmpty } from 'lodash'
import { ACTION_TYPE_COLORS, ACTION_TYPE_DISPLAY_TEXT } from 'shared/constants'
import { TSituation } from 'shared/types'
import { AppPalette } from 'style/palette'
import { v4 } from 'uuid'

import {
  Control,
  Row,
  StyledSituation,
  VariableTable,
} from './Situation.styled'

type TSituationComponent = {
  situation: TSituation
  roll: (expression: string) => void
  save: (situation: TSituation) => void
  edit: (id: string) => void
  deleteFn: (id: string) => void
}

export const Situation: React.FC<TSituationComponent> = ({
  situation,
  roll,
  save,
  edit,
  deleteFn,
}) => {
  const { id, name, controls, variables } = useMemo(
    () => situation,
    [situation]
  )
  const { expression, displayExpression, error, computedVariables } =
    useSituationInterpreter({
      situation,
    })

  const rollCurrentExpression = useCallback(
    () => !error && roll(expression),
    [roll, expression]
  )

  const toggleControl = (name: string) => {
    if (!situation.controls) return
    const index = situation.controls.findIndex(e => e.name === name)
    situation.controls[index].active = !situation.controls[index].active
    save(situation)
  }

  const onEdit = () => edit(id)
  const onDelete = () => deleteFn(id)

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
                    <Switch
                      checked={active}
                      onClick={() => toggleControl(name)}
                    />
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
              <VariableTable>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Valor Incial</th>
                    <th>Valor Atual</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(computedVariables).map(
                    ({ key, value, computedValue }) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                        <td>{computedValue}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </VariableTable>
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
      <CardActions>
        <Tooltip title="Deletar">
          <IconButton onClick={onDelete}>
            <Delete htmlColor={AppPalette.ui.error.main} fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Copiar definição">
          <IconButton disabled>
            <CopyAll color="secondary" fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton onClick={onEdit}>
            <Edit htmlColor={AppPalette.brand.yellow.dark} fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </StyledSituation>
  )
}
