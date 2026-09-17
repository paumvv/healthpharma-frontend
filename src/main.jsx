import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Registro del Service Worker (PWA): cuando hay una versión nueva publicada,
// se activa y recarga sola en vez de dejar a la pestaña abierta "atorada" en
// assets viejos (esa era la causa de que los cambios "no se reflejaran").
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({
      immediate: true,
      onNeedRefresh() {
        window.location.reload()
      },
    })
  })
}