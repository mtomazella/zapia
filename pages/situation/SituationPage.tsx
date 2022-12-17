import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { faAdd, faRemove } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, IconButton, MenuItem, Select, TextField } from '@mui/material'
import { useSituations, useUrlParameters } from 'hooks'
import { useRouter } from 'next/router'
import { ACTION_TYPE_DISPLAY_TEXT } from 'shared/constants'
import { TActionType, TSituation } from 'shared/types'

import { Die } from 'components'

import { StyledSituationPage } from './SituationPage.styled'

type Form = TSituation

export const SituationPage: React.FC = () => {
  const { back } = useRouter()
  const {
    space: spaceName,
    id: situationId,
    initialExpression,
  } = useUrlParameters()

  const { situation, updateOrInsert: updateById } = useSituations({
    spaceName,
    situationId,
  })
  const { control, register, reset, handleSubmit } = useForm<Form>()
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
      expression: situation?.expression ?? initialExpression ?? '1d20',
      controls: situation?.controls ?? [],
      variables: situation?.variables ?? [],
    })
  }, [situation])

  const onSubmit = (data: Form) => {
    updateById({ ...(situation as TSituation), ...data })
    back()
  }

  const actionTypeSelectOptions = Object.keys(ACTION_TYPE_DISPLAY_TEXT).map(
    key => (
      <MenuItem key={key} value={key}>
        {ACTION_TYPE_DISPLAY_TEXT[key as TActionType]}
      </MenuItem>
    ),
  )

  return (
    <StyledSituationPage onSubmit={handleSubmit(onSubmit)}>
      <section>
        <Die isRolling rollForever animationDuration={10000} />
        <TextField
          label="Nome"
          InputLabelProps={{ shrink: true }}
          {...register('name')}
        />
        <TextField
          label="Expressão"
          InputLabelProps={{ shrink: true }}
          {...register('expression')}
        />

        <h3>Controles</h3>
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

        <h3>Variáveis</h3>
        {variableFields.map(({ id }, index) => {
          return (
            <div className="control-field" key={id}>
              <TextField
                placeholder="Nome"
                {...register(`variables.${index}.name`)}
              />
              <label>:</label>
              <TextField
                placeholder="Valor"
                {...register(`variables.${index}.value`)}
              />
              <IconButton onClick={() => removeVariable(index)}>
                <FontAwesomeIcon icon={faRemove} />
              </IconButton>
            </div>
          )
        })}
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
  )
}
