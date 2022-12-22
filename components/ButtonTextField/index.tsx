import React, { ChangeEvent, KeyboardEventHandler, ReactNode } from 'react'

import { IconButton, InputAdornment, TextField } from '@mui/material'
import { noop } from 'lodash'

export const ButtonTextField: React.FC<{
  label?: string
  icon: ReactNode
  actionFn?: () => void
  onChange: (value: string) => void
  value?: string
}> = ({ label, icon, actionFn = noop, onChange, value }) => {
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
      label={label}
      onSubmit={actionFn}
      value={value}
      onChange={changeHandler}
      onKeyDown={keyDownHandler}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" onClick={actionFn}>
            <IconButton>{icon}</IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}
