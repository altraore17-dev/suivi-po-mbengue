import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard     from './pages/Dashboard';
import Alertes       from './pages/Alertes';
import Cultures      from './pages/Cultures';
import CultureDetail from './pages/CultureDetail';
import Intrants      from './pages/Intrants';
import Pluviometrie  from './pages/Pluviometrie';
import Recoltes      from './pages/Recoltes';
import Manoeuvres    from './pages/Manoeuvres';
import Phytosanitaire from './pages/Phytosanitaire';
import Journal       from './pages/Journal';
import Plus          from './pages/Plus';

export default function App() {
  return (
    <BrowserRouter basename="/suivi-po-mbengue/">
      <Routes>
        <Route path="/"                   element={<Dashboard />} />
        <Route path="/alertes"            element={<Alertes />} />
        <Route path="/cultures"           element={<Cultures />} />
        <Route path="/cultures/:id"       element={<CultureDetail />} />
        <Route path="/intrants"           element={<Intrants />} />
        <Route path="/pluviometrie"       element={<Pluviometrie />} />
        <Route path="/recoltes"           element={<Recoltes />} />
        <Route path="/manoeuvres"         element={<Manoeuvres />} />
        <Route path="/phytosanitaire"     element={<Phytosanitaire />} />
        <Route path="/journal"            element={<Journal />} />
        <Route path="/plus"               element={<Plus />} />
      </Routes>
    </BrowserRouter>
  );
}
