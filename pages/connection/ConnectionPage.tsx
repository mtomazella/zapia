import React, { useCallback, useEffect, useState } from 'react'

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useRouter } from 'next/router'
import { TAllConnectionInfo } from 'shared/types'

import { Die } from 'components'

import { StyledConnectionPage } from './ConnectionPage.styled'
import { SmartToy } from '@mui/icons-material'
import { BOT_URL } from 'shared/constants'
import { useConnectionInfo } from 'hooks/use-connection'
import Image from 'next/image'

import channelImage from './assets/channel.png'
import { useSpace, useUrlParameters } from 'hooks'

export const ConnectionPage: React.FC = () => {
  const { back } = useRouter()
  const { space } = useUrlParameters()
  const { getConnections, updateOrInsert } = useConnectionInfo()
  const { spaces } = useSpace()

  const [selectedSpace, setSelectedSpace] = useState<string>(
    space ? space : Object.keys(spaces)[0]
  )
  const [updatedConnections, setUpdatedConnections] =
    useState<TAllConnectionInfo>(getConnections())

  const getBot = () => {
    window.open(BOT_URL, '_blank')
  }

  const save = useCallback(() => {
    const newConnections: TAllConnectionInfo = {
      ...updatedConnections,
      [selectedSpace]: {
        ...updatedConnections[selectedSpace],
        sendRolls: true,
      },
    }
    updateOrInsert(newConnections)
    back()
  }, [updatedConnections, selectedSpace, updateOrInsert, back])

  return (
    <StyledConnectionPage>
      <section>
        <Die isRolling rollForever animationDuration={10000} />

        <FormControl fullWidth className="select-space">
          <InputLabel id="select-space-label">Selecione o Espaço</InputLabel>
          <Select
            labelId="select-space-label"
            label="Selecione o Espaço"
            value={selectedSpace}
            onChange={e => setSelectedSpace(e.target.value)}
          >
            {Object.keys(spaces).map(space => (
              <MenuItem key={space} value={space}>
                {space}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Chave do Canal"
          InputLabelProps={{ shrink: true }}
          value={updatedConnections[selectedSpace]?.destinationKey ?? ''}
          onChange={e =>
            setUpdatedConnections({
              ...updatedConnections,
              [selectedSpace]: {
                ...updatedConnections[selectedSpace],
                destinationKey: e.target.value,
              },
            })
          }
        />
        <TextField
          label="Nome do Jogador (opcional)"
          InputLabelProps={{ shrink: true }}
          value={updatedConnections[selectedSpace]?.player ?? ''}
          onChange={e =>
            setUpdatedConnections({
              ...updatedConnections,
              [selectedSpace]: {
                ...updatedConnections[selectedSpace],
                player: e.target.value,
              },
            })
          }
        />

        <div className="info">
          <h2>Conectando ao Discord</h2>
          <p>
            Para enviar seus resultados para um canal do Discord, use o botão
            abaixo para adicionar o bot.
          </p>
          <Button variant="outlined" color="info" onClick={getBot}>
            <SmartToy /> Adicionar Bot
          </Button>
          <p>
            Após adicioná-lo, clique com o botão direito no canal que deseja
            enviar os resultados e copie o ID. Então, preencha o campo "Chave do
            Canal" e salve as configurações. Seus resultados serão
            automaticamente enviados para aquele canal.
          </p>
          <Image alt='' src={channelImage} />
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
    </StyledConnectionPage>
  )
}
