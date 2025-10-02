import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import { ThemeProvider } from './ThemeContext';
import { TimeProvider } from './TimeContext'; // ✅ create a separate file for TimeProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <TimeProvider>   {/* ✅ global clock for the entire app */}
      <HashRouter>
        <App />
      </HashRouter>
    </TimeProvider>
  </ThemeProvider>
);


// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/Teabuff/sw.js")
//       .then((reg) => console.log("✅ Service Worker registered:", reg))
//       .catch((err) => console.log("❌ SW registration failed:", err));
//   });
// }


