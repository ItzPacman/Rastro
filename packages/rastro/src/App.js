import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
// import Home from './HomePage/Home.js';
import Mainbar from "./components/Mainbar.js";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App  ">
      <Router>
      <ToastContainer />
        <Mainbar />
      </Router>
    </div>
  );
}

export default App;
