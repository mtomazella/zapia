import { Routes, Route } from 'react-router-dom'
import { Space } from './pages/space'
import { EditSpacesPage } from './pages/spaces'
import { HelpPage } from './pages/help'
import { ConnectionPage } from './pages/connection'
import { CustomizationPage } from './pages/customization'
import { SituationPage } from './pages/situation'
import { OwlbearHistory } from './pages/owlbear-history'
import { OwlbearBackgroundScript } from './pages/owlbear-background-script'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Space />} />
      <Route path="/space" element={<Space />} />
      <Route path="/spaces" element={<EditSpacesPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/connection" element={<ConnectionPage />} />
      <Route path="/customization" element={<CustomizationPage />} />
      <Route path="/situation" element={<SituationPage />} />
      <Route path="/owlbear-history" element={<OwlbearHistory />} />
      <Route
        path="/owlbear-background-script"
        element={<OwlbearBackgroundScript />}
      />

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}
