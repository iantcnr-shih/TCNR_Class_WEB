import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom"
import { HashRouter } from "react-router-dom";
import "@/styles/global.css"
import App from '@/App.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <App />
  </HashRouter>
);