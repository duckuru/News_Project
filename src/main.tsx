import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserContextProvider } from './context/UserContext.tsx'
import { NewsContextProvider } from './context/NewsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserContextProvider>
      <NewsContextProvider>
        <App />
      </NewsContextProvider>
    </UserContextProvider>
  </StrictMode>,
)
