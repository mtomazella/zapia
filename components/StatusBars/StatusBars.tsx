import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  TextField,
} from '@mui/material'
import { Clear, Add, Check } from '@mui/icons-material'
import { StyledVariables, BarContainer, StyledBar } from './StatusBars.styled'
import { TSpace, TSpaceStatusBar } from 'shared/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppPalette } from 'style/palette'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { useDieRoll, useSituationInterpreter } from 'hooks'

export type StatusBarsProps = {
  className?: string
  space?: TSpace
  bars?: TSpaceStatusBar[]
  onChange?: (bars: TSpaceStatusBar[]) => void
  colapse?: boolean
  toggleColapse?: () => void
}

export const StatusBars = ({
  className,
  space,
  onChange,
  bars,
  colapse,
  toggleColapse,
}: StatusBarsProps) => {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  return (
    <StyledVariables className={className}>
      <Accordion expanded={colapse} onChange={toggleColapse}>
        <AccordionSummary>
          <h3>Barras de Status</h3>
        </AccordionSummary>
        <AccordionDetails className="status-bars">
          <BarContainer>
            {bars?.map((bar, index) => (
              <Bar
                key={index}
                name={bar.name}
                max={bar.max}
                value={bar.value}
                color={bar.color}
                space={space}
                onChange={newBar => {
                  const updatedBars = bars.map((b, i) =>
                    i === index ? newBar : b
                  )
                  onChange?.(updatedBars)
                }}
              />
            ))}
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => {
                if (onChange) {
                  onChange([
                    ...(bars || []),
                    { name: newKey, max: '100', value: 0 },
                  ])
                  setNewKey('')
                  setNewValue('')
                }
              }}
            >
              Adicionar Barra
            </Button>
          </BarContainer>
        </AccordionDetails>
      </Accordion>
    </StyledVariables>
  )
}

const Bar = ({
  name,
  max,
  value,
  color,
  onChange,
  space,
}: TSpaceStatusBar & {
  onChange?: (bar: TSpaceStatusBar) => void
  space?: TSpace
}) => {
  const [editMode, setEditMode] = useState(false)
  const { roll } = useDieRoll()
  const [computedMax, setComputedMax] = useState(0)
  const { expression: partialMax } = useSituationInterpreter({
    situation: {
      id: name,
      name,
      controls: [],
      variables: [],
      expression: max,
    },
    globalVariables: space?.variables ?? [],
  })

  useEffect(() => {
    new Promise<number>(async resolve => {
      resolve((await roll(partialMax))?.result?.total ?? 0)
    }).then(setComputedMax)
  }, [partialMax, roll])

  const handleChange = useCallback(
    (field: keyof TSpaceStatusBar, newValue: string | number) => {
      if (onChange) {
        onChange({ name, max, value, color, [field]: newValue })
      }
    },
    [name, max, value, color, onChange]
  )

  return (
    <StyledBar>
      <div className="view">
        <div className="name">
          <span>{name}</span>
          <Button
            style={{ minWidth: 'none' }}
            onClick={() => setEditMode(!editMode)}
          >
            <FontAwesomeIcon icon={faGear} color="white" />
          </Button>
        </div>
        {editMode ? (
          <div
            className="bar"
            style={{ backgroundColor: color ?? AppPalette.brand.teal.main }}
          >
            <div>
              <button onClick={() => handleChange('value', value - 5)}>
                {'<<'}
              </button>
              <button onClick={() => handleChange('value', value - 1)}>
                {'<'}
              </button>
            </div>

            <span>
              <input
                onChange={e => handleChange('value', Number(e.target.value))}
                type="number"
                value={value}
              />{' '}
              / <span>{computedMax}</span>
            </span>

            <div>
              <button onClick={() => handleChange('value', value + 1)}>
                {'>'}
              </button>
              <button onClick={() => handleChange('value', value + 5)}>
                {'>>'}
              </button>
            </div>
          </div>
        ) : (
          <div className="edit">
            <TextField
              value={max}
              onChange={e => handleChange('max', e.target.value)}
              style={{ width: '50%' }}
              placeholder="Valor Máximo"
            />
            <TextField
              value={color}
              onChange={e => handleChange('color', e.target.value)}
              style={{ width: '50%' }}
              placeholder="Cor"
            />
          </div>
        )}
      </div>
    </StyledBar>
  )
}
