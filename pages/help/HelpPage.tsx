import React from 'react'

import Image from 'next/image'

import singleUseRoll from './assets/single.png'
import situationImage from './assets/situation.png'
import { StyledHelpPage } from './HelpPage.styled'

export const HelpPage: React.FC = () => (
  <StyledHelpPage>
    <h1>Ajuda</h1>
    {/* . */}
    <h2>Expressões</h2>
    <p>
      Expressões são a forma escrita de uma rolagem. Elas podem conter um ou
      mais tipos de dados, operações matemáticas, constantes, variáveis e
      modificadores.
    </p>
    <b>2d20b1 + [VAR] + 2 + 1d6</b>
    <p>
      Na expressões de exemplo acima podemos ver um exemplo para cada um dos
      pontos citados. Abaixo, veja o significado de cada parte da expressão.
    </p>
    <ul>
      <li>
        <b>2d20</b> é equivalente a jogar dois dados de vinte lados.
      </li>
      <li>
        <b>b1</b> é um de vários modificador: símbolo que modifica como as
        rolagens são interpretadas. Por padrão, quando múltiplos dados são
        jogados o resultado é a soma dos valores, porém "b1" ou "best 1" define
        que o apenas o maior dado será considerado. O "w" ou "worst" também é
        suportado.
      </li>
      <li>
        <b>[VAR]</b> é uma variável: um valor definido pelo usuário para
        conveniência. É apenas uma forma de dar nome a uma constante. Variáveis
        dever ser colocadas entre colchetes para serem interpretadas.
      </li>
    </ul>
    {/* . */}
    <h2>Rolagem Única</h2>
    <p>Para testes ou rolagens únicas, use o primeiro campo.</p>
    <Image src={singleUseRoll} />
    {/* . */}
    <h2>Situações</h2>
    <p>
      Uma situação é uma expressão comum, salva para ser realizada com
      praticidade. Além disso, também é possível adicionar variáveis e controles
      a situações.
    </p>
    <Image src={situationImage} />
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
      2d6. Suponha também que um aliado possa encantar esse machado, adicionando
      1d10 de dano a ele. Em vez de escrever duas situações, apenas crie um
      controle em modo <b>Adicionar</b> com valor de 1d10. Também é possível
      utilizar valores negativos.
    </p>
    <p>
      De maneira similar, suponha que seu personagem tenha uma habilidade
      "Fúria" que aumenta o tier do dado de dano em 1. Em vez de criar uma nova
      situação, adicione um controle no modo <b>Substituir</b> com valor 2d8 que
      substitui sua expressão original pela nova expressão.
    </p>
  </StyledHelpPage>
)
