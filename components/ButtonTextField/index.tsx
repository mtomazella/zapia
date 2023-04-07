import React, { ChangeEvent, KeyboardEventHandler, ReactNode } from 'react'

import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { noop } from 'lodash'

export const ButtonTextField: React.FC<
  {
    icon: ReactNode
    actionFn?: () => void
    onChange: (value: string) => void
  } & Omit<TextFieldProps, 'onChange'>
> = ({ icon, actionFn = noop, onChange, ...props }) => {
  const keyDownHandler: KeyboardEventHandler = event => {
    if (event.key === 'Enter') actionFn()
  }
  const changeHandler = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value ?? '1d20')

  return (
    <TextField
      style={{
        width: '100%',
      }}
      onSubmit={actionFn}
      onChange={changeHandler}
      onKeyDown={keyDownHandler}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" onClick={actionFn}>
            <IconButton>{icon}</IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  )
}
