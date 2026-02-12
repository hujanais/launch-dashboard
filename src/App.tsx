import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import HeaderComponents from "./Components/HeaderComponents/HeaderComponents";
import QuickBarComponent from "./Components/QuickBarComponents/QuickBarComponent";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="root">
        <div className="header"><HeaderComponents /></div>
        <div className="quick-bar"><QuickBarComponent /></div>
        <div className="main-content">Main Content</div>
      </div>
    </ThemeProvider>
  );
}

export default App;
