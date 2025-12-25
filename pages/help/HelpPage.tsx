import React from 'react'

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { SPACE_PAGE_ROUTE } from 'shared/constants'

import singleUseRoll from './assets/single.png'
import situationImage from './assets/situation.png'
import { StyledHelpPage } from './HelpPage.styled'

export const HelpPage: React.FC = () => {
  const { push } = useRouter()

  return (
    <StyledHelpPage>
      <IconButton onClick={() => push(`/${SPACE_PAGE_ROUTE}`)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </IconButton>

      <h1>Ajuda</h1>

      {/* . */}
      <h2>Expressões</h2>
      <p>
        Expressões são a forma escrita de uma rolagem. Elas podem conter um ou
        mais tipos de dados, operações matemáticas, constantes, variáveis e
        modificadores.
      </p>
      <b>2d20k1 + [VAR] + 2 + 1d6</b>
      <p>
        Na expressões de exemplo acima podemos ver um exemplo para cada um dos
        pontos citados. Abaixo, veja o significado de cada parte da expressão.
      </p>
      <ul>
        <li>
          <b>2d20</b> é equivalente a jogar dois dados de vinte lados.
        </li>
        <li>
          <b>k1</b> é um de vários modificador: símbolo que modifica como as
          rolagens são interpretadas. Por padrão, quando múltiplos dados são
          jogados o resultado é a soma dos valores, porém "k1" ou "keep 1"
          define que o apenas o maior dado será considerado. O "d" ou "drop"
          também é suportado.
        </li>
        <li>
          <b>[VAR]</b> é uma variável: um valor definido pelo usuário para
          conveniência. É apenas uma forma de dar nome a uma constante.
          Variáveis dever ser colocadas entre colchetes para serem
          interpretadas.
        </li>
      </ul>

      <h3>Mais informações sobre a notação</h3>
      <p>
        Para mais informações sobre como escrever expressões complexas, veja{' '}
        <a
          href="https://dice-roller.github.io/documentation/guide/notation/"
          target="_blank"
        >
          essa documentação
        </a>
        .
      </p>

      <h3>Cheatsheet de Modificadores</h3>
      <p>
        <b>Apenas alguns dos modificadores estão descritos aqui!</b>
        <br />
        <b>
          Para mais informações visite{' '}
          <a
            href="https://dice-roller.github.io/documentation/guide/notation/modifiers.html"
            target="_blank"
          >
            a documentação.
          </a>
        </b>
      </p>

      <ul>
        <li>
          <b>
            <a
              href="https://dice-roller.github.io/documentation/guide/notation/modifiers.html#min"
              target="_blank"
            >
              Mínimo (min)
            </a>
          </b>
          : trata valores abaixo de um limite como o próprio limite.
          <p>
            <b>Exemplo:</b> 4d6min3: [(1d)3^, 4, 3, (2d)3^] = 13
          </p>
        </li>
        <li>
          <b>
            <a
              href="https://dice-roller.github.io/documentation/guide/notation/modifiers.html#max"
              target="_blank"
            >
              Máximo (max)
            </a>
          </b>
          : trata valores acima de um limite como o próprio limite.
          <p>
            <b>Exemplo:</b> 4d6max3: [(5d)3v, (6d)3v, 3, 2] = 11
          </p>
        </li>
        <li>
          <b>
            <a
              href="https://dice-roller.github.io/documentation/guide/notation/modifiers.html#exploding"
              target="_blank"
            >
              Explode (!)
            </a>
          </b>
          : adiciona um novo dado ao resultado toda vez que um valor definido é
          atingido (padrão valor máximo do dado)
          <p>
            <b>Exemplo:</b> 2d6!: [4, 6!, 6!, 2] = 18
          </p>
        </li>
        <li>
          <b>
            <a
              href="https://dice-roller.github.io/documentation/guide/notation/modifiers.html#re-roll"
              target="_blank"
            >
              Re-rolar (r)
            </a>
          </b>
          : rola novamente os dados que atingirem um valor definido (padrão 1)
          <p>
            <b>Exemplo:</b> 4d6r: [4, 5, 2, 1d, 4] = 15
          </p>
        </li>
        <li>
          <b>
            <a
              href="https://dice-roller.github.io/documentation/guide/notation/modifiers.html#keep"
              target="_blank"
            >
              Keep (k)
            </a>
          </b>
          : mantém apenas os valores que atendem a um critério (padrão maior
          valor).
          <p>
            <b>Exemplo maiores valores: 3d20k2: [12d, 20, 17] = 37</b>
          </p>
          <p>
            <b>Exemplo menor valor: 3d20kl: [12, 20d, 17d] = 12</b>
          </p>
        </li>
        <li>
          <b>
            <a
              href="https://dice-roller.github.io/documentation/guide/notation/modifiers.html#drop"
              target="_blank"
            >
              Drop (d)
            </a>
          </b>
          : ignora valores que atendem a um critério (padrão menor valor).
          Oposto do Keep.
          <p>
            <b>Exemplo: 3d20d: [12d, 20, 17] = 37</b>
          </p>
        </li>
      </ul>

      {/* . */}
      <h2>Rolagem Única</h2>
      <p>Para testes ou rolagens únicas, use o primeiro campo.</p>
      <Image alt="" src={singleUseRoll} />

      {/* . */}
      <h2>Situações</h2>
      <p>
        Uma situação é uma expressão comum, salva para ser realizada com
        praticidade. Além disso, também é possível adicionar variáveis e
        controles a situações.
      </p>
      <Image alt="" src={situationImage} />
      <p>
        Para criar uma situação, aperte o botão com um simbolo "+" no campo para
        rolagens únicas. Se alguma expressão estiver escrita no campo, ela será
        automaticamente transferida para a tela de criação de situações.
      </p>
      <p>
        Para rolar uma situação, apenas aperte o botão com ícone de dado
        relacionado a ela.
      </p>

      {/* . */}
      <h3>Controles</h3>
      <p>Controles são uma forma de modificar a expressão da situação.</p>
      <p>
        Suponha que seu personagem tem um machado que normalmente tem um dano de
        2d6. Suponha também que um aliado possa encantar esse machado,
        adicionando 1d10 de dano a ele. Em vez de escrever duas situações,
        apenas crie um controle em modo <b>Adicionar</b> com valor de 1d10.
        Também é possível utilizar valores negativos.
      </p>
      <p>
        De maneira similar, suponha que seu personagem tenha uma habilidade
        "Fúria" que aumenta o tier do dado de dano em 1. Em vez de criar uma
        nova situação, adicione um controle no modo <b>Substituir</b> com valor
        2d8 que substitui sua expressão original pela nova expressão.
      </p>

      {/* . */}
      <h3>Variáveis</h3>
      <p>
        Variáveis são valores definidos para serem usados em vários lugares da
        situação.
      </p>
      <p>
        Suponha que seu personagem adicione seu modificador de força ao dano de
        seu machado e também que a quantidade de dados rolados para o teste é o
        valor desse modificador. Em vez de colocar o valor diretamente, crie uma
        variável chamada FOR com o valor, permitindo que o valor seja alterado
        apenas em um lugar.
      </p>
      <p>
        Para utilizar uma variável, basta colocar o nome dela entre colchetes.
        <br />
        <b>Exemplo:</b> 1d20 + [FOR]
      </p>
    </StyledHelpPage>
  )
}
