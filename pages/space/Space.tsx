import React, { useCallback, useState } from 'react'

import { faDiceD20 } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AddCircle } from '@mui/icons-material'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material'
import { useSituations, useUrlParameters } from 'hooks'
import { useRouter } from 'next/router'
import { TSituation } from 'shared/types'

import { Die } from 'components'
import { ButtonTextField } from 'components/ButtonTextField'
import { Situation } from 'components/Situation'

import { Column, StyledSpace } from './Space.styled'

export const Space: React.FC = () => {
  const { push } = useRouter()
  const { space: spaceName } = useUrlParameters()
  const { situations, updateById } = useSituations({ spaceName })

  const [diceExpression, setDiceExpression] = useState('')
  const [isDieRolling, setIsDieRolling] = useState(false)
  const [expressionText, setExpressionText] = useState('')

  const addToExpression = (value: string) =>
    setExpressionText(prev => prev + value + ' ')

  const save = useCallback(
    (situation: TSituation) => updateById(situation),
    [updateById],
  )

  const roll = useCallback(
    (expression?: string) => {
      if (!expression) expression = expressionText
      setDiceExpression(expression)
      setIsDieRolling(true)
      scrollTo({ top: 0 })
    },
    [expressionText, setDiceExpression, setIsDieRolling],
  )

  const goToEditPage = (id: string) =>
    push(`/situation?id=${id}${spaceName ? `&space=${spaceName}` : ''}`)

  return (
    <StyledSpace>
      <Column>
        <div className="dice-box">
          <Die
            expression={diceExpression}
            isRolling={isDieRolling}
            setIsRolling={setIsDieRolling}
          />
        </div>
      </Column>
      <Column>
        <Card>
          <CardContent>
            <ButtonTextField
              label="Rodar Dado"
              actionFn={roll}
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
              <IconButton aria-label="add">
                <AddCircle />
              </IconButton>
            </div>
          </CardActions>
        </Card>

        {situations.map(situation => (
          <Situation
            key={situation.id}
            situation={situation}
            save={save}
            roll={roll}
            edit={goToEditPage}
          />
        ))}
      </Column>
    </StyledSpace>
  )
}
