import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@mui/material'
import { Clear, Add } from '@mui/icons-material'
import { StyledVariables, VariableTable } from './GlobalVariables.styled'
import { TSpaceVariable } from 'shared/types'
import { useCallback, useState } from 'react'

export type GlobalVariablesProps = {
  className?: string
  variables?: TSpaceVariable[]
  onChange?: (variables: TSpaceVariable[]) => void
  colapse?: boolean
  toggleColapse?: () => void
}

export const GlobalVariables = ({
  className,
  onChange,
  variables,
  colapse,
  toggleColapse,
}: GlobalVariablesProps) => {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const addNew = useCallback(() => {
    const key = newKey.trim()
    const value = newValue.trim()
    if (key && value) {
      onChange?.([...(variables || []), { key, value }])
      setNewKey('')
      setNewValue('')
    }
  }, [variables, newKey, newValue, setNewKey, setNewValue, onChange])

  return (
    <StyledVariables className={className}>
      <Accordion expanded={colapse} onChange={toggleColapse}>
        <AccordionSummary>
          <h3>Variáveis Gerais</h3>
        </AccordionSummary>
        <AccordionDetails className="variable-list">
          <VariableTable>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Valor</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {(variables ?? [])
                .sort((a, b) => {
                  if (a.key < b.key) {
                    return -1
                  }
                  if (a.key > b.key) {
                    return 1
                  }
                  return 0
                })
                .map(({ key, value }) => (
                  <tr key={key}>
                    <td className="key">{key}</td>
                    <td>
                      <input
                        type="text"
                        value={value}
                        onChange={event => {
                          const newValue = event.target.value
                          onChange?.(
                            variables?.map(variable => {
                              if (variable.key === key) {
                                return { ...variable, value: newValue }
                              }
                              return variable
                            }) || []
                          )
                        }}
                      />
                    </td>
                    <td>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => {
                          onChange?.(
                            variables?.filter(
                              variable => variable.key !== key
                            ) || []
                          )
                        }}
                      >
                        <Clear fontSize="small" />
                      </Button>
                    </td>
                  </tr>
                ))}
              <tr>
                <td className="key">
                  <input
                    type="text"
                    value={newKey}
                    onChange={event => {
                      setNewKey(event.target.value)
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        addNew()
                      }
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={newValue}
                    onChange={event => {
                      setNewValue(event.target.value)
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        addNew()
                      }
                    }}
                  />
                </td>
                <td>
                  <Button
                    variant="outlined"
                    size="small"
                    color="success"
                    onClick={addNew}
                  >
                    <Add fontSize="small" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </VariableTable>
        </AccordionDetails>
      </Accordion>
    </StyledVariables>
  )
}
