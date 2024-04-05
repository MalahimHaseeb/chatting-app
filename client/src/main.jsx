import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import './index.css'
import { store } from './store/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <Toaster/>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
