import React, { useCallback, useMemo, useState } from 'react'

import { faDiceD20, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AddCircle, CheckBox, MoreVert, RssFeed } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Select,
} from '@mui/material'
import { useDieRoll, useSituations, useSpace, useUrlParameters } from 'hooks'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import {
  CONNECTION_CONFIG_ROUTE,
  DEFAULT_SPACE,
  EDIT_SITUATION_PAGE_ROUTE,
  EDIT_SPACES_PAGE_ROUTE,
  HELP_PAGE_ROUTE,
  SPACE_PAGE_ROUTE,
} from 'shared/constants'
import { TSituation } from 'shared/types'
import { generateSearchParams } from 'utils/navigation'

import { Die } from 'components'
import { ButtonTextField } from 'components/ButtonTextField'
import { Situation } from 'components/Situation'

import { Column, EditSpaceMenuItem, StyledSpace } from './Space.styled'
import { useBot } from 'hooks/use-bot'
import { useConnectionInfo } from 'hooks/use-connection'

export const Space: React.FC = () => {
  const { push } = useRouter()
  const { space: selectedSpace } = useUrlParameters()
  const { spaces } = useSpace({ spaceName: selectedSpace })
  const spaceNames = Object.keys(spaces)
  const {
    situations: unfilteredSituations,
    updateOrInsert: updateById,
    deleteSituation,
    duplicateSituation,
    getSituationJson,
  } = useSituations({
    spaceName: selectedSpace,
  })
  const { connectionInfo, updateOrInsert: updateConnectionInfo } =
    useConnectionInfo()

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

  const { sendRoll } = useBot({
    destinationKey: connectionInfo.destinationKey ?? '',
  })

  const addToExpression = (value: string) =>
    setExpressionText(
      prev =>
        `${prev}${
          prev.endsWith('+') || prev.endsWith('-') || prev === '' ? '1' : ''
        }${value}`
    )

  const save = useCallback(
    (situation: TSituation) => updateById(situation),
    [updateById]
  )

  const rollHandler = useCallback(
    async (expression?: string, meta?: { situation?: TSituation | null }) => {
      if (!expression) expression = expressionText
      scrollTo({ top: 0 })

      const rollResult = await roll(expression)
      const rollToSend = {
        result: rollResult?.result?.total?.toString() ?? '',
        detailedResult: rollResult?.result?.toString() ?? '',
        space: selectedSpace,
        player: connectionInfo.player,
        situation: meta?.situation?.name,
        controls: meta?.situation?.controls?.filter(control => control.active),
      }

      if (connectionInfo.sendRolls) sendRoll(rollToSend)
    },
    [expressionText, sendRoll, connectionInfo, roll]
  )

  const rollNoSituation = useCallback(
    () => rollHandler(expressionText, { situation: null }),
    [expressionText, rollHandler]
  )

  const situations = useMemo(
    () =>
      unfilteredSituations.filter(
        s =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.expression
            .toLowerCase()
            .replaceAll(' ', '')
            .includes(search.toLowerCase().replaceAll(' ', ''))
      ),
    [unfilteredSituations, search]
  )

  const goToEditPage = (id: string) =>
    push(
      `/${EDIT_SITUATION_PAGE_ROUTE}?id=${id}${
        selectedSpace ? `&space=${selectedSpace}` : ''
      }`
    )

  const goToConnectionPage = () => push(`/${CONNECTION_CONFIG_ROUTE}`)

  const goToHelpPage = () => push(`/${HELP_PAGE_ROUTE}`)

  const addNewSituation = () =>
    push(
      `/${EDIT_SITUATION_PAGE_ROUTE}?${generateSearchParams({
        initialExpression: expressionText,
        space: selectedSpace,
      })}`
    )

  const onSendRollsChange = useCallback(
    (_: unknown, checked: boolean) => {
      updateConnectionInfo({ sendRolls: checked })
    },
    [updateConnectionInfo]
  )

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget)
  }
  const closeMenu = () => {
    setMenuAnchor(null)
  }

  return (
    <StyledSpace>
      <Column className="situations">
        {situations.map(situation => (
          <Situation
            key={situation.id}
            situation={situation}
            save={save}
            roll={roll => rollHandler(roll, { situation })}
            edit={goToEditPage}
            deleteFn={deleteSituation}
            duplicateFn={duplicateSituation}
            getSituationJson={getSituationJson}
          />
        ))}
      </Column>
      <Column>
        <div className="space-options">
          <IconButton onClick={openMenu}>
            <MoreVert />
          </IconButton>
          <Menu open={isMenuOpen} anchorEl={menuAnchor} onClose={closeMenu}>
            <MenuItem onClick={goToHelpPage}>Ajuda</MenuItem>
          </Menu>

          <Select size="small" value={selectedSpace ?? DEFAULT_SPACE}>
            {spaceNames.map(spaceName => (
              <MenuItem
                key={spaceName}
                value={spaceName}
                onClick={() => push(`/${SPACE_PAGE_ROUTE}?space=${spaceName}`)}
              >
                {spaceName}
              </MenuItem>
            ))}
            <NextLink legacyBehavior href={`/${EDIT_SPACES_PAGE_ROUTE}`}>
              <EditSpaceMenuItem key="_edit">
                <span>Editar</span>
              </EditSpaceMenuItem>
            </NextLink>
          </Select>

          <Button variant="outlined" color="info" onClick={goToConnectionPage}>
            <RssFeed />
            Conexão
          </Button>
          <Checkbox
            checked={connectionInfo.sendRolls ?? false}
            color="info"
            onChange={onSendRollsChange}
          />
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
              <IconButton onClick={goToHelpPage}>
                <Chip color="info" label="Ajuda" variant="outlined" />
              </IconButton>
            </Box>
            <div>
              <IconButton aria-label="add" onClick={addNewSituation}>
                <AddCircle />
              </IconButton>
            </div>
          </CardActions>
        </Card>
        <Card className="search-bar">
          <ButtonTextField
            onChange={setSearch}
            icon={<FontAwesomeIcon icon={faSearch} />}
            size="small"
          />
        </Card>
      </Column>
    </StyledSpace>
  )
}
