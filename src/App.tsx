import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './App.css'
import HeaderComponents from './Components/HeaderComponents/HeaderComponents'
import QuickBarComponent from './Components/QuickBarComponents/QuickBarComponent'
import { IssPage } from './Pages/IssPage/IssPage'
import { LaunchPage } from './Pages/LaunchPage/LaunchPage'
import { NasaPage } from './Pages/NasaPage/NasaPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
})

const queryClient = new QueryClient()

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="root">
                <div className="header">
                    <HeaderComponents />
                </div>
                <div className="main-content">
                    <QueryClientProvider client={queryClient}>
                        <BrowserRouter>
                            <Routes>
                                <Route
                                    path="/launch"
                                    element={<LaunchPage />}
                                />
                                <Route path="/iss" element={<IssPage />} />
                                <Route path="/nasa" element={<NasaPage />} />
                                <Route path="*" element={<div>404</div>} />
                            </Routes>
                        </BrowserRouter>
                    </QueryClientProvider>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default App
