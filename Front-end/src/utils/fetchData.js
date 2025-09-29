// // src/utils/fetchData.js
// export async function fetchData(url) {
//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     // Save response in localStorage for offline use
//     localStorage.setItem(url, JSON.stringify(data));

//     return data;
//   } catch (err) {
//     // Network failed, try to get cached response
//     const cached = localStorage.getItem(url);
//     if (cached) {
//       console.log("Serving from cache:", url);
//       return JSON.parse(cached);
//     } else {
//       console.log("Offline & no cache:", url);
//       return { offline: true, data: [] };
//     }
//   }
// }
