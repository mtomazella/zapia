import React, { useCallback, useMemo, useState } from 'react'

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
  Button,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
} from '@mui/material'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import { Expression, useSituationInterpreter } from 'hooks'
import { isEmpty } from 'lodash'
import { ACTION_TYPE_COLORS, ACTION_TYPE_DISPLAY_TEXT } from 'shared/constants'
import { TSituation, TSpaceVariable } from 'shared/types'
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
  roll: (expression: Expression[]) => void
  save: (situation: TSituation) => void
  edit: (id: string) => void
  deleteFn: (id: string) => void
  duplicateFn: (id: string) => void
  getSituationJson: (id: string) => string
  globalVariables?: TSpaceVariable[]
  variablesColapse?: boolean
  toggleVariablesColapse?: () => void
  controlsColapse?: boolean
  toggleControlsColapse?: () => void
}

export const Situation: React.FC<TSituationComponent> = ({
  situation,
  roll,
  save,
  edit,
  deleteFn,
  duplicateFn,
  getSituationJson,
  globalVariables,
  variablesColapse,
  toggleVariablesColapse,
  controlsColapse,
  toggleControlsColapse,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { id, name, controls, variables } = useMemo(
    () => situation,
    [situation]
  )
  const { expression, displayExpression, error, computedVariables } =
    useSituationInterpreter({
      situation,
      globalVariables,
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
  const onDuplicate = () => duplicateFn(id)
  const onCopyToClipboard = () => {
    const jsonString = getSituationJson(id)
    navigator.clipboard.writeText(jsonString)
  }

  return (
    <StyledSituation>
      <CardContent>
        <Row>
          <div>
            <h3>{name}</h3>
            {displayExpression.map((de, index) => (
              <h4 key={index}>
                {de.expression}
                {de.group ? ` (${de.group})` : ''}
              </h4>
            ))}
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
          <Accordion
            expanded={controlsColapse}
            onChange={toggleControlsColapse}
          >
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
          <Accordion
            expanded={variablesColapse}
            onChange={toggleVariablesColapse}
          >
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
          <IconButton onClick={() => setDeleteModalOpen(true)}>
            <Delete htmlColor={AppPalette.ui.error.main} fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Copiar definição">
          <PopupState variant="popover" popupId="copy-menu">
            {popupState => (
              <React.Fragment>
                <IconButton {...bindTrigger(popupState)}>
                  <CopyAll color="secondary" fontSize="small" />
                </IconButton>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem
                    onClick={() => {
                      onDuplicate()
                      popupState.close()
                    }}
                  >
                    Duplicar
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      onCopyToClipboard()
                      popupState.close()
                    }}
                  >
                    Copiar para a área de transferência
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton onClick={onEdit}>
            <Edit htmlColor={AppPalette.brand.yellow.dark} fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>

      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle id="alert-dialog-title">
          Tem certeza que deseja deletar essa Situação?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} autoFocus>
            Não deletar
          </Button>
          <Button onClick={onDelete}>Deletar</Button>
        </DialogActions>
      </Dialog>
    </StyledSituation>
  )
}
