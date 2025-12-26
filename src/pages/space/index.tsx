import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { faDiceD20, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AddCircle, MoreVert, RssFeed } from '@mui/icons-material'
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
import {
  Expression,
  useDieRoll,
  useSituationInterpreter,
  useSituations,
  useSpace,
  useUrlParameters,
} from 'hooks'
import { Link, useNavigate } from 'react-router-dom'
import {
  CONNECTION_CONFIG_ROUTE,
  CUSTOMIZATION_PAGE_ROUTE,
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
import { GlobalVariables } from 'components/GlobalVariables'
import { useColapses } from 'hooks/use-colapses'
import { useOwlbearIntegration } from 'hooks/use-owlbear-integration'

export const Space: React.FC = () => {
  const push = useNavigate()
  const { space: selectedSpace } = useUrlParameters()
  const { spaces, space, updateOrInsert } = useSpace({
    spaceName: selectedSpace,
  })
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
  const { spaceConnection, updateOrInsert: updateConnectionInfo } =
    useConnectionInfo({ spaceName: selectedSpace })
  const { colapses, toggle } = useColapses()

  const [expressionText, setExpressionText] = useState('')
  const [search, setSearch] = useState('')
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(menuAnchor)

  const { expression: oneShotExpression } = useSituationInterpreter({
    situation: {
      id: 'one-shot',
      name: '',
      expression: expressionText,
    },
    globalVariables: space?.variables,
  })

  const {
    result: dieResult,
    isRolling: isDieRolling,
    roll,
    error: rollError,
  } = useDieRoll()

  const { sendRoll: sendRollBot } = useBot({
    destinationKey: spaceConnection?.destinationKey ?? '',
  })
  const { sendRoll: sendRollOwlbear } = useOwlbearIntegration()

  const retryMessage = (event: any) => {
    window.removeEventListener('message', retryMessage)
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        console.log('Attempting to resend the message')
        window.dispatchEvent(event)
      }, 500 + i * 1000)
    }
  }

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
    async (
      expression?: Expression[] | string,
      meta?: { situation?: TSituation | null }
    ) => {
      if (!expression || expression.length === 0)
        expression = [{ expression: '1d20cs' }]
      else if (typeof expression === 'string') expression = [{ expression }]

      scrollTo({ top: 0 })

      const rollResult = await roll(expression)
      const rollToSend = {
        result: (rollResult?.total ?? '').toString(),
        detailedResult: rollResult?.stringResults.join('\n> '),
        space: selectedSpace,
        player: spaceConnection?.player,
        situation: meta?.situation?.name,
        controls: meta?.situation?.controls?.filter(control => control.active),
      }

      if (spaceConnection?.sendRolls) {
        sendRollBot(rollToSend)
        await sendRollOwlbear(rollToSend)
      }
    },
    [expressionText, sendRollBot, spaceConnection, roll]
  )

  const rollOneShot = useCallback(() => {
    if (!oneShotExpression || oneShotExpression.length === 0) {
      return rollHandler([{ expression: '1d20cs' }], { situation: null })
    }

    if (oneShotExpression.length === 1) {
      const expr = oneShotExpression[0].expression

      if (!isNaN(Number(expr))) {
        return rollHandler(`1d20cs + ${expr.trim()}`, {
          situation: null,
        })
      }

      if (
        (() => {
          const parts = expr.split(',').map(s => s.trim())
          return parts.length === 2 && parts.every(part => !isNaN(Number(part)))
        })()
      ) {
        const parts = expr
          .trim()
          .split(',')
          .map(s => s.trim())
        return rollHandler(`${parts[0]}d20k1cs + ${parts[1]}`, {
          situation: null,
        })
      }
    }

    return rollHandler(oneShotExpression, { situation: null })
  }, [rollHandler, oneShotExpression])

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

  const goToEditPage = useCallback(
    (id: string) =>
      push(
        `/${EDIT_SITUATION_PAGE_ROUTE}?id=${id}${
          selectedSpace ? `&space=${selectedSpace}` : ''
        }`
      ),
    [push, selectedSpace]
  )

  const goToConnectionPage = useCallback(
    () =>
      push(
        `/${CONNECTION_CONFIG_ROUTE}?space=${selectedSpace ?? DEFAULT_SPACE}`
      ),
    [push, selectedSpace]
  )

  const goToHelpPage = useCallback(() => push(`/${HELP_PAGE_ROUTE}`), [push])

  const goToCustomization = useCallback(() => {
    push(`/${CUSTOMIZATION_PAGE_ROUTE}?space=${selectedSpace ?? DEFAULT_SPACE}`)
  }, [push, selectedSpace])

  const addNewSituation = () =>
    push(
      `/${EDIT_SITUATION_PAGE_ROUTE}?${generateSearchParams({
        initialExpression: expressionText,
        space: selectedSpace,
      })}`
    )

  const onSendRollsChange = useCallback(
    (_: unknown, checked: boolean) => {
      updateConnectionInfo({
        [selectedSpace ?? 'default']: { sendRolls: checked },
      })
    },
    [updateConnectionInfo]
  )

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget)
  }
  const closeMenu = () => {
    setMenuAnchor(null)
  }

  const situationElements = useMemo(
    () =>
      situations.map(situation => (
        <Situation
          key={situation.id}
          situation={situation}
          save={save}
          roll={roll => rollHandler(roll, { situation })}
          edit={goToEditPage}
          deleteFn={deleteSituation}
          duplicateFn={duplicateSituation}
          getSituationJson={getSituationJson}
          globalVariables={space?.variables}
          controlsColapse={colapses[`${situation.id}-controls`] ?? false}
          toggleControlsColapse={() => toggle(`${situation.id}-controls`)}
          variablesColapse={colapses[`${situation.id}-variables`] ?? false}
          toggleVariablesColapse={() => toggle(`${situation.id}-variables`)}
        />
      )),
    [
      situations,
      save,
      rollHandler,
      goToEditPage,
      deleteSituation,
      duplicateSituation,
      getSituationJson,
      space?.variables,
      colapses,
      toggle,
    ]
  )

  return (
    <StyledSpace>
      <Column className="situations">{situationElements}</Column>
      <Column className="options">
        <div className="space-options">
          <IconButton onClick={openMenu}>
            <MoreVert />
          </IconButton>
          <Menu open={isMenuOpen} anchorEl={menuAnchor} onClose={closeMenu}>
            <MenuItem onClick={goToCustomization}>Customizar Espaço</MenuItem>
            <MenuItem onClick={goToHelpPage}>Ajuda</MenuItem>
            <MenuItem
              onClick={() => {
                window.open(
                  `https://zapia.vercel.app?space=${
                    selectedSpace ?? DEFAULT_SPACE
                  }`,
                  '_blank'
                )
              }}
            >
              Detach
            </MenuItem>
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
            <Link to={`/${EDIT_SPACES_PAGE_ROUTE}`}>
              <EditSpaceMenuItem key="_edit">
                <span>Editar</span>
              </EditSpaceMenuItem>
            </Link>
          </Select>

          <Button variant="outlined" color="info" onClick={goToConnectionPage}>
            <RssFeed />
            Conexão
          </Button>
          <Checkbox
            checked={spaceConnection?.sendRolls ?? false}
            color="info"
            onChange={onSendRollsChange}
          />
        </div>

        <div className="dice-box">
          <Die
            isRolling={isDieRolling}
            color={space?.customization?.dieColor}
            result={dieResult?.total}
          />
        </div>

        {rollError && <p className="error-text">{rollError}</p>}
        {dieResult &&
          dieResult.stringResults.map((res, index) => (
            <p key={index} className="roll-result-text">
              {res}
            </p>
          ))}

        <Card className="expression-builder">
          <CardContent>
            <ButtonTextField
              label="Rodar Dado"
              actionFn={rollOneShot}
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

        <GlobalVariables
          className="global-variables"
          variables={space?.variables}
          onChange={variables => {
            updateOrInsert(selectedSpace, { variables })
          }}
          colapse={colapses[`${selectedSpace}-variables`] ?? false}
          toggleColapse={() => toggle(`${selectedSpace}-variables`)}
        />
      </Column>
    </StyledSpace>
  )
}
