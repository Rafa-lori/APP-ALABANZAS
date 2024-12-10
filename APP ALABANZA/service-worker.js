const CACHE_NAME = 'alabanzas-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/logo-parroquia.png', // Asegúrate de que el logo esté en la ruta correcta
  '/Contacto.html',
  '/Canciones.html',
  '/Fechas.html'
];

// Instalar el Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Archivos cacheados');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('Error al cachear archivos:', err);
      })
  );
});

// Activar el Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch: responder a las solicitudes con la caché si está disponible
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Devuelve la respuesta de la caché si está disponible
        if (cachedResponse) {
          return cachedResponse;
        }
        // Si no está en la caché, realiza la solicitud de red
        return fetch(event.request).catch((err) => {
          console.error('Error en la solicitud de red:', err);
        });
      })
  );
});

