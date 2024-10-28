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
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { useSpace } from 'hooks'
import { useRouter } from 'next/router'
import { SPACE_PAGE_ROUTE } from 'shared/constants'

import { ButtonTextField } from 'components/ButtonTextField'

import { StyledEditSpacesPage } from './EditSpaces.styled'
import { TSpace } from 'shared/types'

export const EditSpacesPage: React.FC = () => {
  const [exportModal, setExportModal] = useState<{
    open: boolean
    spaceName: string
    space: TSpace | null
    situationsSelected: string[]
  }>({
    open: false,
    spaceName: '',
    space: null,
    situationsSelected: [],
  })

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

  const getExportText = (
    spacesObject: Record<string, TSpace>,
    exportModal: {
      space: TSpace | null
      spaceName: string
      situationsSelected: string[]
    }
  ) => {
    const space = spacesObject[exportModal.spaceName]
    const situations = space.situations.filter(situation =>
      exportModal.situationsSelected.includes(situation.id)
    )
    return JSON.stringify(
      { [exportModal.spaceName]: { ...space, situations } },
      null,
      2
    )
  }

  const onExportClipboard = useCallback(() => {
    const text = getExportText(spacesObject, exportModal)
    navigator.clipboard.writeText(text)
    setExportModal({ ...exportModal, open: false })
  }, [spacesObject, exportModal])

  const onExportFile = useCallback(() => {
    const text = getExportText(spacesObject, exportModal)
    const blob = new Blob([text], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${exportModal.spaceName}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportModal({ ...exportModal, open: false })
  }, [spacesObject, exportModal])

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
                onClick={() =>
                  setExportModal({
                    open: true,
                    spaceName: name,
                    space: spacesObject[name],
                    situationsSelected: [],
                  })
                }
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
    <>
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

      <Dialog open={exportModal.open}>
        <DialogTitle>Exportar {exportModal.spaceName}</DialogTitle>
        <DialogContent>
          <p>Selecione as situações que deseja exportar:</p>
          <List>
            <ListItem>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={
                    exportModal.situationsSelected.length ===
                    exportModal.space?.situations.length
                  }
                  tabIndex={-1}
                  onClick={() => {
                    if (
                      exportModal.situationsSelected.length ===
                      exportModal.space?.situations.length
                    )
                      setExportModal({
                        ...exportModal,
                        situationsSelected: [],
                      })
                    else {
                      setExportModal({
                        ...exportModal,
                        situationsSelected:
                          exportModal.space?.situations.map(
                            situation => situation.id
                          ) ?? [],
                      })
                    }
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Selecionar Todas" />
            </ListItem>

            <Divider />

            {(exportModal?.space?.situations ?? []).map(situation => (
              <ListItem key={situation.id}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={exportModal.situationsSelected.includes(
                      situation.id
                    )}
                    tabIndex={-1}
                    onClick={() => {
                      setExportModal({
                        ...exportModal,
                        situationsSelected:
                          exportModal.situationsSelected.includes(situation.id)
                            ? exportModal.situationsSelected.filter(
                                e => e !== situation.id
                              )
                            : [...exportModal.situationsSelected, situation.id],
                      })
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={situation.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setExportModal({ ...exportModal, open: false })}
          >
            Cancelar
          </Button>
          <Button onClick={onExportFile}>Exportar Arquivo</Button>
          <Button onClick={onExportClipboard}>
            Exportar para Área de Transferência
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
