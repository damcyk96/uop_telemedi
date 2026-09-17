import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { createQueryClient } from '@/core/queries'
import { I18nProvider } from '@/i18n'
import './index.css'

const queryClient = createQueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nProvider locale="pl">
        <BrowserRouter><App /></BrowserRouter>
      </I18nProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
