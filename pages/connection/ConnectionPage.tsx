import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { TConnectionInfo } from 'shared/types'

import { Die } from 'components'

import { StyledConnectionPage } from './ConnectionPage.styled'
import { SmartToy } from '@mui/icons-material'
import { BOT_URL } from 'shared/constants'
import { useConnectionInfo } from 'hooks/use-connection'

type Form = TConnectionInfo

export const ConnectionPage: React.FC = () => {
  const { back } = useRouter()
  const { connectionInfo, updateOrInsert } = useConnectionInfo()

  const { register, reset, handleSubmit } = useForm<Form>()

  useEffect(() => {
    reset(connectionInfo)
  }, [connectionInfo])

  const getBot = () => {
    window.open(BOT_URL, '_blank')
  }

  const onSubmit = (data: Form) => {
    updateOrInsert(data)
    back()
  }

  return (
    <StyledConnectionPage onSubmit={handleSubmit(onSubmit)}>
      <section>
        <Die isRolling rollForever animationDuration={10000} />

        <div className="info">
          <p>
            Para enviar seus resultados para um canal do Discord, use o botão
            abaixo para adicionar o bot.
          </p>
          <Button variant="outlined" color="info" onClick={getBot}>
            <SmartToy /> Adicionar Bot
          </Button>
          <p>
            Após adicioná-lo, vá ao canal desejado e utilize o comando /key para
            conseguir a chave, então preencha o campo abaixo e salve as
            configurações.
          </p>
          <p>
            Seus resultados serão automaticamente enviados para aquele canal.
          </p>
        </div>

        <TextField
          label="Chave do Canal"
          InputLabelProps={{ shrink: true }}
          {...register('destinationKey')}
        />
        <TextField
          label="Nome do Jogador (opcional)"
          InputLabelProps={{ shrink: true }}
          {...register('player')}
        />
      </section>

      <section className="form-buttons">
        <Button size="large" variant="outlined" onClick={back}>
          Cancelar
        </Button>
        <Button size="large" variant="contained" type="submit">
          Salvar
        </Button>
      </section>
    </StyledConnectionPage>
  )
}
