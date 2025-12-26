import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { faAdd, faRemove } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  Expression,
  extractExpressionGroups,
  useSituations,
  useUrlParameters,
} from 'hooks'
import { ACTION_TYPE_DISPLAY_TEXT, SPACE_PAGE_ROUTE } from 'shared/constants'
import {
  TActionType,
  TSituationControl,
  TSituationVariable,
} from 'shared/types'

import { Die } from 'components'

import { StyledSituationPage } from './SituationPage.styled'
import { SituationValidationError, validateSituation } from 'utils/clipboard'

type Form = {
  id: string
  name: string
  expressions: Expression[]
  variables?: TSituationVariable[] | undefined
  controls?: TSituationControl[] | undefined
}

export const SituationPage: React.FC = () => {
  const push = useNavigate()
  const {
    space: spaceName,
    id: situationId,
    initialExpression,
  } = useUrlParameters()

  const [clipboardModal, setClipboardModal] = useState({
    open: false,
    error: '',
  })

  const { situation, updateOrInsert: updateById } = useSituations({
    spaceName,
    situationId,
  })
  const { control, register, reset, handleSubmit } = useForm<Form>()
  const {
    fields: expressionFields,
    append: appendExpression,
    remove: removeExpression,
  } = useFieldArray({
    name: 'expressions',
    control,
  })
  const {
    fields: controlFields,
    append: appendControl,
    remove: removeControl,
  } = useFieldArray({
    name: 'controls',
    control,
  })
  const {
    fields: variableFields,
    append: appendVariable,
    remove: removeVariable,
  } = useFieldArray({
    name: 'variables',
    control,
  })

  useEffect(() => {
    reset({
      name: situation?.name ?? '',
      expressions: extractExpressionGroups(
        situation?.expression ?? initialExpression ?? '1d20'
      ),
      controls: situation?.controls ?? [],
      variables: situation?.variables ?? [],
    })
  }, [situation])

  const back = () => {
    push(`/${SPACE_PAGE_ROUTE}?space=${spaceName}`)
  }

  const onSubmit = (data: Form) => {
    const updatedSituation = {
      ...situation,
    }

    updatedSituation.name = data.name

    updatedSituation.expression = data.expressions
      .filter(e => !!(e.expression ?? '').trim())
      .map(e => `{${e.expression.trim()};${e.group?.trim()}}`)
      .join('')

    updateById(updatedSituation)
    back()
  }

  const onPaste = async () => {
    try {
      const clipboard = await navigator.clipboard.readText()
      const json = JSON.parse(clipboard)

      json.id = situationId

      validateSituation(json)

      reset(json)
    } catch (error) {
      if (!(error instanceof SituationValidationError)) {
        setClipboardModal({
          open: true,
          error: 'Valor colado não é uma Situação. Copie a Situação novamente.',
        })
        return
      }

      setClipboardModal({ open: true, error: (error as Error).message })
    }
  }

  const actionTypeSelectOptions = Object.keys(ACTION_TYPE_DISPLAY_TEXT).map(
    key => (
      <MenuItem key={key} value={key}>
        {ACTION_TYPE_DISPLAY_TEXT[key as TActionType]}
      </MenuItem>
    )
  )

  return (
    <>
      <StyledSituationPage onSubmit={handleSubmit(onSubmit)}>
        <section>
          <Die isRolling rollForever animationDuration={10000} />
          <TextField
            label="Nome"
            InputLabelProps={{ shrink: true }}
            {...register('name')}
          />

          <div className="section-title">
            <h3>Expressão</h3>
            <IconButton
              onClick={() =>
                appendExpression({
                  expression: '',
                  group: '',
                })
              }
            >
              <FontAwesomeIcon icon={faAdd} />
            </IconButton>
          </div>
          {expressionFields.map(({ expression, group }, index) => {
            return (
              <div className="expression-field" key={index}>
                <TextField
                  placeholder="Expressão"
                  {...register(`expressions.${index}.expression`)}
                />
                <TextField
                  placeholder="Grupo/Tipo"
                  className="group"
                  {...register(`expressions.${index}.group`)}
                />
                <IconButton onClick={() => removeExpression(index)}>
                  <FontAwesomeIcon icon={faRemove} />
                </IconButton>
              </div>
            )
          })}

          <div className="section-title">
            <h3>Controles</h3>
            <IconButton
              onClick={() =>
                appendControl({
                  name: '',
                  actionType: 'add',
                  active: false,
                  controlType: 'boolean',
                  value: '',
                })
              }
            >
              <FontAwesomeIcon icon={faAdd} />
            </IconButton>
          </div>
          {controlFields.map(({ id, actionType }, index) => {
            return (
              <div className="control-field" key={id}>
                <TextField
                  placeholder="Nome"
                  {...register(`controls.${index}.name`)}
                />
                <label>:</label>
                <div>
                  <Select
                    defaultValue={actionType}
                    {...register(`controls.${index}.actionType`)}
                  >
                    {actionTypeSelectOptions}
                  </Select>
                  <TextField
                    placeholder="Expressão"
                    {...register(`controls.${index}.value`)}
                  />
                </div>
                <IconButton onClick={() => removeControl(index)}>
                  <FontAwesomeIcon icon={faRemove} />
                </IconButton>
              </div>
            )
          })}
          <div className="section-title">
            <h3>Variáveis</h3>
            <IconButton
              onClick={() =>
                appendVariable({
                  key: '',
                  value: '',
                })
              }
            >
              <FontAwesomeIcon icon={faAdd} />
            </IconButton>
          </div>
          {variableFields.map(({ id }, index) => {
            return (
              <div className="control-field" key={id}>
                <TextField
                  placeholder="Nome"
                  {...register(`variables.${index}.key`)}
                />
                <label>:</label>
                <TextField
                  placeholder="Valor"
                  {...register(`variables.${index}.value`, {
                    valueAsNumber: true,
                  })}
                />
                <IconButton onClick={() => removeVariable(index)}>
                  <FontAwesomeIcon icon={faRemove} />
                </IconButton>
              </div>
            )
          })}

          {!situationId && (
            <div className="paste-section">
              <Button size="small" variant="outlined" onClick={onPaste}>
                Colar da área de transferência
              </Button>
              {/* <Button size="small" variant="outlined">
            Ver versão em texto
          </Button> */}
            </div>
          )}
        </section>

        <section className="form-buttons">
          <Button size="large" variant="outlined" onClick={back}>
            Cancelar
          </Button>
          <Button size="large" variant="contained" type="submit">
            Salvar
          </Button>
        </section>
      </StyledSituationPage>

      <Dialog
        open={clipboardModal.open}
        onClose={() => setClipboardModal({ open: false, error: '' })}
      >
        <DialogTitle id="alert-dialog-title">Situação inválida</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {clipboardModal.error}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClipboardModal({ open: false, error: '' })}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
