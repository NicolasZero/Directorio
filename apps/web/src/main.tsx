import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { BrowserRouter } from 'react-router';
import AppRouter from './router/AppRouter.tsx'
import { ThemeProvider } from "./components/theme-provider";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="directory-ui-theme">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
