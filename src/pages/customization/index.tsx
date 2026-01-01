import { useSpace, useUrlParameters } from 'hooks'
import { useNavigate } from 'react-router-dom'
import { StyledCustomization } from './CustomizationPage.styled'
import { Button, IconButton, TextField } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import {
  DEFAULT_DIE_COLOR,
  DIE_COLORS,
  DieColor,
  SPACE_PAGE_ROUTE,
} from 'shared/constants'
import { Die } from 'components'
import { useCallback, useEffect, useState } from 'react'

export const CustomizationPage = ({}) => {
  const push = useNavigate()
  const { space: spaceName } = useUrlParameters()
  const { space, updateOrInsert } = useSpace({ spaceName })
  const [customization, setCustomization] = useState(space?.customization)

  useEffect(() => {
    setCustomization(space?.customization)
  }, [space?.customization])

  const [rolling, setRolling] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setRolling(prev => !prev)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {}, [customization])

  const back = useCallback(() => {
    push(`/${SPACE_PAGE_ROUTE}?space=${spaceName}`)
  }, [push, spaceName])

  const save = useCallback(() => {
    updateOrInsert(spaceName, {
      customization,
    })
    back()
  }, [customization, spaceName, updateOrInsert])

  if (!spaceName) {
    return null
  }
  return (
    <StyledCustomization>
      <h1>
        <IconButton
          onClick={() => push(`/${SPACE_PAGE_ROUTE}?space=${spaceName}`)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </IconButton>
        <span>Customização</span>
      </h1>

      <div className="dice-box">
        <Die isRolling={rolling} color={customization?.dieColor} result={20} />
      </div>

      <section className="color">
        <h2>Cor do Dado</h2>

        <div>
          {(Object.keys(DIE_COLORS) as DieColor[]).map((colorKey: DieColor) => (
            <button
              key={colorKey}
              className={
                (customization?.dieColor ?? DEFAULT_DIE_COLOR) === colorKey
                  ? 'selected'
                  : ''
              }
              style={{ backgroundColor: DIE_COLORS[colorKey].color }}
              onClick={() => {
                setCustomization(prev => ({
                  ...prev,
                  dieColor: colorKey,
                }))
              }}
            ></button>
          ))}
        </div>
      </section>

      <section className="form-buttons">
        <Button size="large" variant="outlined" onClick={back}>
          Cancelar
        </Button>
        <Button size="large" variant="contained" onClick={save}>
          Salvar
        </Button>
      </section>
    </StyledCustomization>
  )
}
