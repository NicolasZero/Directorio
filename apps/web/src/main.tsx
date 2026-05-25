import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import AppRouter from '@/router/AppRouter'
import { ThemeProvider } from "@/context/theme-provider";

const element = document.getElementById('root');
if (!element) throw new Error("Failed to find the root element");

createRoot(element).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="directory-ui-theme">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
