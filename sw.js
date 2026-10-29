// AMCA Claims offline cache. Network first so staff always get the latest version when online.
const CACHE = "amca-claims-2026.10.29-2";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  const r = e.request; if (r.method !== "GET") return;
  e.respondWith(fetch(r).then((res) => { if (res.ok && (new URL(r.url).origin === location.origin || r.url.includes("fonts.g"))) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r).then((m) => m || caches.match("index.html"))));
});
