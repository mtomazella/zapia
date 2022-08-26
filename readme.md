# Definição de Situação
Uma situação é um grupo de informações composto de:
- Um nome
- Uma expressão base
- Um conjunto de variáveis
- Um conjunto de controles que afetam a expressão base

Você pode criar uma Situação para representar uma expressão e sua relações com outros pontos.  
Exemplo de Situação:  
- Nome: Dano machado
- Expressão base: 2d8 + [FOR]
- Variáveis:
  - FOR: 2
- Controles:
  - Habilidade golpe pesado:
    - Ativo: sim
    - Tipo: Adicionar
    - Valor: 1d8
  - Arma amaldiçoada:
    - Ativo: não
    - Tipo: Adicionar
    - Valor: 1d6  

# Features
- Rodar uma expressão qualquer uma vez

# Features Futuras
- Salvar uma Situação para ser usada varias vezes
- Persistir Situações
- Deletar Situações
- Editar Situações
- Adicionar variáveis a uma Situação
- Adicionar controles a uma Situação
  - Substituir
  - Adicionar
- Variáveis globais
- Copiar Situação
- Criar Situação a partir de texto
- Multiplos Espaços