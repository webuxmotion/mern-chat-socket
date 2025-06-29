import { StrictMode, Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './App'

const RootWrapper = process.env.NODE_ENV === 'development' ? Fragment : StrictMode

const container = document.getElementById('root')!
createRoot(container).render(
  <RootWrapper>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RootWrapper>
)
