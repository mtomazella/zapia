import React, { useCallback, useMemo, useState } from 'react'

import {
  faAdd,
  faArrowDown,
  faArrowLeft,
  faArrowUp,
  faChevronDown,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
} from '@mui/material'
import { useSpace } from 'hooks'
import { useRouter } from 'next/router'
import { SPACE_PAGE_ROUTE } from 'shared/constants'

import { ButtonTextField } from 'components/ButtonTextField'

import { StyledEditSpacesPage } from './EditSpaces.styled'

export const EditSpacesPage: React.FC = () => {
  const { push } = useRouter()
  const { spaces: spacesObject, updateOrInsert, deleteSpace } = useSpace()
  const spaces = Object.keys(spacesObject).map(name => ({
    name,
    ...spacesObject[name],
  }))

  const [newSpaceName, setNewSpaceName] = useState('')

  const onAdd = useCallback(() => {
    const name = newSpaceName.trim()

    if (
      !name ||
      Object.keys(spacesObject)
        .map(e => e.toLowerCase().trim())
        .includes(name.toLowerCase())
    )
      return

    updateOrInsert(name, {})
    setNewSpaceName('')
  }, [updateOrInsert, newSpaceName, spaces])

  const spaceComponents = useMemo(
    () =>
      spaces.map(({ name }) => (
        <Accordion key={name}>
          <AccordionSummary
            expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
          >
            {name}
          </AccordionSummary>
          <AccordionDetails>
            <BottomNavigation showLabels>
              <BottomNavigationAction
                label="Excluir"
                icon={<FontAwesomeIcon size="2x" icon={faTrash} />}
                onClick={() => deleteSpace(name)}
              />
              <BottomNavigationAction
                label="Exportar"
                icon={<FontAwesomeIcon size="2x" icon={faArrowUp} />}
                disabled
              />
              <BottomNavigationAction
                label="Importar"
                icon={<FontAwesomeIcon size="2x" icon={faArrowDown} />}
                disabled
              />
            </BottomNavigation>
          </AccordionDetails>
        </Accordion>
      )),
    [spaces]
  )

  return (
    <StyledEditSpacesPage>
      <h1>
        <IconButton onClick={() => push(`/${SPACE_PAGE_ROUTE}`)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </IconButton>
        <span>Espaços</span>
      </h1>

      {spaceComponents}

      <ButtonTextField
        icon={<FontAwesomeIcon icon={faAdd} />}
        value={newSpaceName}
        onChange={setNewSpaceName}
        onClick={onAdd}
      />
    </StyledEditSpacesPage>
  )
}
