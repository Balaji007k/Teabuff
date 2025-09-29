// const CACHE_NAME = "teabuff-cache-v3";

// // App shell to cache
// const urlsToCache = [
//   "/Teabuff/",
//   "/Teabuff/index.html",
//   "/Teabuff/manifest.json",
//   "/Teabuff/assets/Shop1.jpg",
//   "/Teabuff/assets/Shop2.jpg",
//   "/Teabuff/assets/Shop3.jpg",
//   "/Teabuff/assets/Tea.jpeg",
//   "/Teabuff/assets/Tea-Image.webp",
//   "/Teabuff/assets/Tea_shop.jpeg",
//   "/Teabuff/assets/contact-tea.jpeg",
//   "/Teabuff/assets/leafs.jpeg",
//   "/Teabuff/assets/user.png",
//   "/Teabuff/assets/vecteezy_a-cup-of-tea-with-a-splash-of-liquid_53538770.png",
//   "/Teabuff/assets/favicon_io/android-chrome-192x192.png",
// ];

// // ✅ Install: precache static assets
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
//   );
// });

// // ✅ Activate: clean old caches
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((keys) =>
//       Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
//     )
//   );
// });

// // ✅ Fetch: handle API + images
// self.addEventListener("fetch", (event) => {
//   const { request } = event;

//   // Handle API calls (products, category, reviews)
//   if (
//     request.url.includes("/products") ||
//     request.url.includes("/category") ||
//     request.url.includes("/reviews") ||
//     request.url.includes("/allreviews")
//   ) {
//     event.respondWith(
//       caches.match(request).then((cached) => {
//         return (
//           cached ||
//           fetch(request)
//             .then((response) => {
//               return caches.open(CACHE_NAME).then((cache) => {
//                 cache.put(request, response.clone());
//                 return response;
//               });
//             })
//             .catch(() =>
//               cached ||
//               new Response(JSON.stringify({ offline: true, data: [] }), {
//                 headers: { "Content-Type": "application/json" },
//               })
//             )
//         );
//       })
//     );
//     return;
//   }

//   // Handle images (cache-first)
//   if (request.destination === "image") {
//     event.respondWith(
//       caches.match(request).then((cached) => {
//         return (
//           cached ||
//           fetch(request).then((response) => {
//             return caches.open(CACHE_NAME).then((cache) => {
//               cache.put(request, response.clone());
//               return response;
//             });
//           })
//         );
//       })
//     );
//     return;
//   }

//   // Default: try cache, else network
//   event.respondWith(
//     caches.match(request).then((cached) => cached || fetch(request))
//   );
// });
