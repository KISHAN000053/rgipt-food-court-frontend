// Service worker — runs in the background independently of the app tab.
// This is what makes push notifications work when the app isn't active.

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'New Order', body: event.data.text() };
  }

  const options = {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    tag: data.tag || 'new-order',         // prevents duplicate banners for same order
    requireInteraction: true,             // stays on screen until dismissed
    vibrate: [200, 100, 200, 100, 200],   // noticeable pattern even on silent
    data: { orderId: data.orderId },
    actions: [
      { action: 'view', title: 'View Order' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'New Order', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const orderId = event.notification.data?.orderId;
  const targetUrl = orderId ? `/shop-owner` : '/shop-owner';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If the app is already open in a tab, focus it rather than opening a new one.
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
