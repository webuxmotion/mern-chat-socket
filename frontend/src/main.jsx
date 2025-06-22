import { StrictMode, Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './App.jsx'


const RootWrapper = process.env.NODE_ENV === 'development' ? Fragment : StrictMode

createRoot(document.getElementById('root')).render(
  <RootWrapper>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RootWrapper>
)
