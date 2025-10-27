'use client'

import { useEffect } from 'react'
import { subscribeToPushNotifications } from '@/lib/push-notifications'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          // Register service worker
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })

          console.log('PWA Service Worker зарегистрирован:', registration)

          // Wait for service worker to be ready
          await navigator.serviceWorker.ready
          console.log('PWA Service Worker готов')

          // Subscribe to push notifications if user is authenticated
          const token = localStorage.getItem('token')
          if (token) {
            try {
              await subscribeToPushNotifications()
              console.log('Подписка на push уведомления выполнена')
            } catch (error) {
              console.error('Ошибка подписки на push уведомления:', error)
            }
          }

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('Доступно новое обновление PWA')
                }
              })
            }
          })
        } catch (error) {
          console.error('Ошибка регистрации Service Worker:', error)
        }
      })
    }
  }, [])

  return null
}