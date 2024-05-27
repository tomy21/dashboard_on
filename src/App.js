import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transaction from "./pages/Transaction";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const closeConsoleWarning = () => {
      console.log("%cSTOP!", "color: red; font-size: 40px; font-weight: bold;");
      console.log(
        "%cThis is a browser feature intended for developers.",
        "font-size: 18px;"
      );
      console.log(
        "%cIf someone told you to copy-paste something here, it is a scam.",
        "font-size: 18px;"
      );
    };

    window.addEventListener("contextmenu", closeConsoleWarning);
    window.addEventListener("keydown", (e) => {
      if (e.key === "F12") {
        closeConsoleWarning();
        e.preventDefault();
      }
    });

    return () => {
      window.removeEventListener("contextmenu", closeConsoleWarning);
      window.removeEventListener("keydown", closeConsoleWarning);
    };
  }, []);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transaction" element={<Transaction />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
