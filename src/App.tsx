import { BrowserRouter as Router } from 'react-router-dom';
import "./i18n";
import AppRoutes from "./routes";
import { Toaster } from 'react-hot-toast';

export default function App() {

  return (
    <Router>
    <Toaster position="top-right" />
    <AppRoutes />
  </Router>
  );
}
