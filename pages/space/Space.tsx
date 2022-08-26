import { AddCircle } from '@mui/icons-material'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material'
import { Die } from 'components'
import { ButtonTextField } from 'components/ButtonTextField'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Column, StyledSpace } from './Space.styled'
import { faDiceD20 } from '@fortawesome/free-solid-svg-icons'
import { Situation } from 'components/Situation'
import { v4 } from 'uuid'

export const Space: React.FC = () => {
  const [diceExpression, setDiceExpression] = useState('')
  const [isDieRolling, setIsDieRolling] = useState(false)
  const [expressionText, setExpressionText] = useState('')

  const addToExpression = (value: string) =>
    setExpressionText(prev => prev + value + ' ')

  const roll = (expression?: string) => {
    if (!expression) expression = expressionText
    setDiceExpression(expression)
    setIsDieRolling(true)
  }

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
          <CardActions
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingRight: '1.9rem',
            }}
          >
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

            <IconButton aria-label="add">
              <AddCircle />
            </IconButton>
          </CardActions>
        </Card>

        <Situation
          situation={{ id: v4(), name: 'Situação teste 1', expression: '3d8+2' }}
          roll={roll}
        />
      </Column>
    </StyledSpace>
  )
}
