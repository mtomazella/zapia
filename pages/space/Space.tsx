import React, { useCallback, useMemo, useState } from 'react'

import { faDiceD20, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AddCircle, MoreVert } from '@mui/icons-material'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Select,
} from '@mui/material'
import { useDieRoll, useSituations, useSpace, useUrlParameters } from 'hooks'
import { useRouter } from 'next/router'
import { TSituation } from 'shared/types'
import { generateSearchParams } from 'utils/navigation'

import { Die } from 'components'
import { ButtonTextField } from 'components/ButtonTextField'
import { Situation } from 'components/Situation'

import { Column, StyledSpace } from './Space.styled'

export const Space: React.FC = () => {
  const { push } = useRouter()
  const { space: selectedSpace } = useUrlParameters()
  const { spaces } = useSpace({ spaceName: selectedSpace })
  const spaceNames = Object.keys(spaces)
  const {
    situations: unfilteredSituations,
    updateOrInsert: updateById,
    deleteSituation,
  } = useSituations({
    spaceName: selectedSpace,
  })

  const [expressionText, setExpressionText] = useState('')
  const [search, setSearch] = useState('')
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(menuAnchor)

  const {
    result: dieResult,
    completeTotal: completeDieResult,
    isRolling: isDieRolling,
    roll,
  } = useDieRoll()

  const addToExpression = (value: string) =>
    setExpressionText(
      prev =>
        `${prev}${
          prev.endsWith('+') || prev.endsWith('-') || prev === '' ? '1' : ''
        }${value}`,
    )

  const save = useCallback(
    (situation: TSituation) => updateById(situation),
    [updateById],
  )

  const rollHandler = useCallback(
    (expression?: string) => {
      if (!expression) expression = expressionText
      roll(expression)
      scrollTo({ top: 0 })
    },
    [expressionText],
  )

  const rollNoSituation = useCallback(
    () => rollHandler(expressionText),
    [expressionText, rollHandler],
  )

  const situations = useMemo(
    () =>
      unfilteredSituations.filter(
        s =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.expression
            .toLowerCase()
            .replaceAll(' ', '')
            .includes(search.toLowerCase().replaceAll(' ', '')),
      ),
    [unfilteredSituations, search],
  )

  const goToEditPage = (id: string) =>
    push(`/situation?id=${id}${selectedSpace ? `&space=${selectedSpace}` : ''}`)

  const addNewSituation = () =>
    push(
      `/situation?${generateSearchParams({
        initialExpression: expressionText,
        space: selectedSpace,
      })}`,
    )

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget)
  }
  const closeMenu = () => {
    setMenuAnchor(null)
  }

  return (
    <StyledSpace>
      <Column>
        <div className="space-options">
          <IconButton onClick={openMenu}>
            <MoreVert />
          </IconButton>
          <Menu open={isMenuOpen} anchorEl={menuAnchor} onClose={closeMenu}>
            <MenuItem onClick={() => push(`/help`)}>Ajuda</MenuItem>
          </Menu>

          <Select size="small" value={selectedSpace ?? 'Padrão'}>
            {spaceNames.map(spaceName => (
              <MenuItem
                key={spaceName}
                value={spaceName}
                onClick={() => push(`/?space=${spaceName}`)}
              >
                {spaceName}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className="dice-box">
          <Die isRolling={isDieRolling} result={dieResult} />
        </div>
        <span>{completeDieResult}</span>
        <Card className="expression-builder">
          <CardContent>
            <ButtonTextField
              label="Rodar Dado"
              actionFn={rollNoSituation}
              value={expressionText}
              onChange={setExpressionText}
              icon={<FontAwesomeIcon icon={faDiceD20} />}
            />
          </CardContent>
          <CardActions>
            <Box>
              <IconButton onClick={() => addToExpression('d3')}>
                <Chip label="D3" />
              </IconButton>
              <IconButton onClick={() => addToExpression('d4')}>
                <Chip color="warning" label="D4" />
              </IconButton>
              <IconButton onClick={() => addToExpression('d6')}>
                <Chip color="error" label="D6" />
              </IconButton>
              <IconButton onClick={() => addToExpression('d8')}>
                <Chip color="info" label="D8" />
              </IconButton>
              <IconButton onClick={() => addToExpression('d10')}>
                <Chip color="primary" label="D10" />
              </IconButton>
              <IconButton onClick={() => addToExpression('d12')}>
                <Chip color="secondary" label="D12" />
              </IconButton>
              <IconButton onClick={() => addToExpression('d20')}>
                <Chip color="success" label="D20" />
              </IconButton>
            </Box>
            <div>
              <IconButton aria-label="add" onClick={addNewSituation}>
                <AddCircle />
              </IconButton>
            </div>
          </CardActions>
        </Card>
      </Column>
      <Column>
        <Card className="search-bar">
          <ButtonTextField
            onChange={setSearch}
            icon={<FontAwesomeIcon icon={faSearch} />}
          />
        </Card>
        {situations.map(situation => (
          <Situation
            key={situation.id}
            situation={situation}
            save={save}
            roll={rollHandler}
            edit={goToEditPage}
            deleteFn={deleteSituation}
          />
        ))}
      </Column>
    </StyledSpace>
  )
}
