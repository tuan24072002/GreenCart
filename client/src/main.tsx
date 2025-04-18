import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <Provider store={store}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Provider>
    </ThemeProvider>
  </BrowserRouter>
)
