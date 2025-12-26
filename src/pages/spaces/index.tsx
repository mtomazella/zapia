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
import { useNavigate } from 'react-router-dom'
import { SPACE_PAGE_ROUTE } from 'shared/constants'

import { ButtonTextField } from 'components/ButtonTextField'

import { ImportModal, StyledEditSpacesPage } from './EditSpaces.styled'
import { TSpace } from 'shared/types'
import { SituationValidationError, validateSituation } from 'utils/clipboard'
import { v4 } from 'uuid'

export const EditSpacesPage: React.FC = () => {
  const [exportModal, setExportModal] = useState<{
    open: boolean
    spaceName: string
    space: TSpace | null
    situationsSelected: string[]
    exportGlobalVariables: boolean
    exportCustomizations: boolean
  }>({
    open: false,
    spaceName: '',
    space: null,
    situationsSelected: [],
    exportGlobalVariables: false,
    exportCustomizations: false,
  })

  const [importModal, setImportModal] = useState<{
    open: boolean
    spaceName: string
    space: TSpace | null
    importingContent: TSpace | null
    contentLoaded: boolean
    situationsSelected: string[]
    error: string | null
    importGlobalVariables: boolean
    importCustomizations: boolean
  }>({
    open: false,
    spaceName: '',
    space: null,
    importingContent: null,
    contentLoaded: false,
    situationsSelected: [],
    error: null,
    importGlobalVariables: false,
    importCustomizations: false,
  })

  const push = useNavigate()
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
      exportGlobalVariables: boolean
      exportCustomizations: boolean
    }
  ) => {
    const space = spacesObject[exportModal.spaceName]
    const situations = space.situations.filter(situation =>
      exportModal.situationsSelected.includes(situation.id)
    )
    return JSON.stringify(
      {
        [exportModal.spaceName]: {
          ...space,
          situations,
          variables: exportModal.exportGlobalVariables
            ? space.variables
            : undefined,
          customization: exportModal.exportCustomizations
            ? space.customization
            : undefined,
        },
      },
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

  const loadImportContent = useCallback(
    (content: string) => {
      try {
        const json = JSON.parse(content)
        const space = Object.values(json)[0] as TSpace

        if (!space) throw new Error()
        if (!space.situations || !Array.isArray(space.situations))
          throw new Error('Situações não encontradas.')
        space.situations.forEach((situation: any) => {
          try {
            validateSituation(situation)
          } catch (e) {
            throw new Error('Situações inválidas.' + (e as Error).message)
          }
        })

        setImportModal({
          ...importModal,
          importingContent: space,
          contentLoaded: true,
          error: null,
        })
      } catch (e) {
        setImportModal({
          ...importModal,
          contentLoaded: false,
          error:
            'Conteúdo inválido' + (e instanceof SituationValidationError)
              ? (e as Error).message ?? ''
              : '',
        })
      }
    },
    [importModal, setImportModal]
  )

  const onImport = useCallback(() => {
    if (!importModal.importingContent) return

    const space = spacesObject[importModal.spaceName]
    const importingSituations = importModal.importingContent.situations
    const importingVariables = importModal.importingContent.variables
    const importingCustomizations = importModal.importingContent.customization

    updateOrInsert(importModal.spaceName, {
      ...space,
      situations: [
        ...space.situations,
        ...importingSituations.map(sit => {
          if (space.situations.some(s => s.name === sit.name)) {
            sit.name = sit.name + ' (importado)'
          }
          return {
            ...sit,
            id: v4(),
          }
        }),
      ],
      variables: importModal.importGlobalVariables
        ? [
            ...space.variables.filter(
              v => importingVariables.findIndex(iv => iv.key === v.key) === -1
            ),
            ...importingVariables,
          ]
        : space.variables,
      customization: { ...space.customization, ...importingCustomizations },
    })

    setImportModal({
      ...importModal,
      open: false,
      importingContent: null,
      contentLoaded: false,
      error: null,
    })
  }, [spacesObject, importModal])

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
                    exportGlobalVariables: false,
                    exportCustomizations: false,
                  })
                }
              />
              <BottomNavigationAction
                label="Importar"
                icon={<FontAwesomeIcon size="2x" icon={faArrowDown} />}
                onClick={() =>
                  setImportModal({
                    open: true,
                    spaceName: name,
                    space: spacesObject[name],
                    importingContent: null,
                    contentLoaded: false,
                    situationsSelected: [],
                    error: null,
                    importGlobalVariables: false,
                    importCustomizations: false,
                  })
                }
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
          <List>
            <ListItem>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={exportModal.exportGlobalVariables}
                  tabIndex={-1}
                  onClick={() => {
                    setExportModal({
                      ...exportModal,
                      exportGlobalVariables: !exportModal.exportGlobalVariables,
                    })
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Incluir variáveis globais" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={exportModal.exportCustomizations}
                  tabIndex={-1}
                  onClick={() => {
                    setExportModal({
                      ...exportModal,
                      exportCustomizations: !exportModal.exportCustomizations,
                    })
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Incluir customizações" />
            </ListItem>
          </List>

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

      <Dialog open={importModal.open}>
        <ImportModal>
          <DialogTitle>Importar para {importModal.spaceName}</DialogTitle>

          {!importModal.contentLoaded && (
            <DialogContent className="load">
              <Button variant="contained" component="label">
                Selecionar Arquivo
                <input
                  type="file"
                  hidden
                  onChange={async e => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    const text = await file.text()
                    loadImportContent(text)
                  }}
                />
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  navigator.clipboard.readText().then(loadImportContent)
                }}
              >
                Colar da área de transferência
              </Button>

              {importModal.error && (
                <p style={{ color: 'red' }}>{importModal.error}</p>
              )}
            </DialogContent>
          )}

          {importModal.contentLoaded && (
            <DialogContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={importModal.importGlobalVariables}
                      tabIndex={-1}
                      onClick={() => {
                        setImportModal({
                          ...importModal,
                          importGlobalVariables:
                            !importModal.importGlobalVariables,
                        })
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Incluir variáveis globais" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={importModal.importCustomizations}
                      tabIndex={-1}
                      onClick={() => {
                        setImportModal({
                          ...importModal,
                          importCustomizations:
                            !importModal.importCustomizations,
                        })
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Incluir customizações" />
                </ListItem>
              </List>

              <p>Selecione as situações que deseja importar:</p>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={
                        importModal.situationsSelected.length ===
                        importModal.importingContent?.situations.length
                      }
                      tabIndex={-1}
                      onClick={() => {
                        if (
                          importModal.situationsSelected.length ===
                          importModal.importingContent?.situations.length
                        )
                          setImportModal({
                            ...importModal,
                            situationsSelected: [],
                          })
                        else {
                          setImportModal({
                            ...importModal,
                            situationsSelected:
                              importModal.importingContent?.situations.map(
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

                {(importModal?.importingContent?.situations ?? []).map(
                  situation => (
                    <ListItem key={situation.id}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={importModal.situationsSelected.includes(
                            situation.id
                          )}
                          tabIndex={-1}
                          onClick={() => {
                            setImportModal({
                              ...importModal,
                              situationsSelected:
                                importModal.situationsSelected.includes(
                                  situation.id
                                )
                                  ? importModal.situationsSelected.filter(
                                      e => e !== situation.id
                                    )
                                  : [
                                      ...importModal.situationsSelected,
                                      situation.id,
                                    ],
                            })
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={situation.name} />
                    </ListItem>
                  )
                )}
              </List>
            </DialogContent>
          )}
          <DialogActions>
            <Button
              onClick={() => setImportModal({ ...importModal, open: false })}
            >
              Cancelar
            </Button>
            <Button onClick={onImport}>Importar</Button>
          </DialogActions>
        </ImportModal>
      </Dialog>
    </>
  )
}
