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
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FacebookProvider } from 'react-facebook';
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <Provider store={store}>
        <FacebookProvider appId={import.meta.env.VITE_FACEBOOK_CLIENT_ID}>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AppContextProvider>
              <App />
            </AppContextProvider>
          </GoogleOAuthProvider>
        </FacebookProvider>
      </Provider>
    </ThemeProvider>
  </BrowserRouter>
)
