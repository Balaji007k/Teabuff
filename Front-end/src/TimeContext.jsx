// import React, { useState, useEffect, createContext } from "react";

// export const TimeContext = createContext();

// export const TimeProvider = ({ children }) => {
//   const [now, setNow] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => setNow(new Date()), 60000); // update every minute
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <TimeContext.Provider value={now}>
//       {children}
//     </TimeContext.Provider>
//   );
// };


import React, { useState, useEffect, createContext } from "react";

export const TimeContext = createContext();

// Short time formatter (social-style)
export const formatShortTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} m ago`;
  const years = Math.floor(days / 365);
  return `${years} years ago`;
};

export const TimeProvider = ({ children }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // ⏳ refresh every 30s so "just now" changes quickly
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TimeContext.Provider value={now}>
      {children}
    </TimeContext.Provider>
  );
};
