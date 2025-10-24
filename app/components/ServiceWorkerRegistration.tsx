'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        // next-pwa автоматически регистрирует SW, но мы можем добавить дополнительную логику
        navigator.serviceWorker.ready.then((registration) => {
          console.log('PWA Service Worker готов:', registration)
          
          // Проверяем обновления
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Новое обновление доступно
                  console.log('Доступно новое обновление PWA')
                }
              })
            }
          })
        })
      })
    }
  }, [])

  return null
}
