import { Button, Card, ToggleButton } from '@mui/material'
import {
  StyledOwlbearHistoryClosed,
  StyledOwlbearHistoryOpen,
} from './OwlbearHistory.styled'
import { useOwlbearIntegration } from 'hooks/use-owlbear-integration'
import { Die } from 'components'
import zapiaIcon from './assets/zapia-icon.png'

export const OwlbearHistory: React.FC = () => {
  const { history, isHistoryOpen, toggleHistory } = useOwlbearIntegration()

  if (!isHistoryOpen)
    return (
      <StyledOwlbearHistoryClosed>
        <Button variant="outlined" onClick={toggleHistory}>
          <img src={zapiaIcon} /> Histórico
        </Button>
      </StyledOwlbearHistoryClosed>
    )

  return (
    <StyledOwlbearHistoryOpen>
      <section>
        {history.map(roll => {
          return (
            <Card className="roll">
              <div className="player">
                <h3
                  className="player"
                  style={{ color: roll.owlbearPlayer.color }}
                >
                  {roll.player ?? roll.owlbearPlayer.name}
                </h3>
                {roll.space && roll.space !== '' && roll.space !== 'Padrão' && (
                  <h3 className="space">- {roll.space ?? ''}</h3>
                )}
              </div>
              <h2>{roll.situation}</h2>
              <h3 className="details">{roll.detailedResult}</h3>
              <Die
                isRolling={false}
                result={roll.result}
                color={roll.dieColor}
              />
            </Card>
          )
        })}

        <Button variant="outlined" onClick={toggleHistory}>
          <img src={zapiaIcon} />
          Minimizar
        </Button>
      </section>
    </StyledOwlbearHistoryOpen>
  )
}
