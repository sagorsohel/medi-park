import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import './index.css'
import router from './routes/router'
import { ThemeProvider } from './components/providers/theme-provider'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          reverseOrder={true}
        />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
