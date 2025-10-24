'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [cachedData, setCachedData] = useState<string[]>([])

  useEffect(() => {
    // Проверяем статус подключения
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Устанавливаем обработчики событий
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Инициализируем статус
    updateOnlineStatus()

    // Загружаем кэшированные данные
    const loadCachedData = () => {
      const cached = localStorage.getItem('offlineData')
      if (cached) {
        setCachedData(JSON.parse(cached))
      }
    }
    loadCachedData()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const addToCache = () => {
    const newItem = `Запись ${Date.now()}`
    const updatedData = [...cachedData, newItem]
    setCachedData(updatedData)
    localStorage.setItem('offlineData', JSON.stringify(updatedData))
  }

  const clearCache = () => {
    setCachedData([])
    localStorage.removeItem('offlineData')
  }

  return (
    <main style={{
      fontFamily: 'sans-serif',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', margin: 0 }}>📱 Офлайн режим</h1>
        <Link href="/" style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 2px 4px rgba(0,112,243,0.3)',
          transition: 'all 0.2s ease'
        }}>
          ← На главную
        </Link>
      </div>

      <div style={{
        padding: '20px',
        backgroundColor: isOnline ? '#e8f5e8' : '#ffe8e8',
        borderRadius: '10px',
        marginBottom: '30px',
        border: `2px solid ${isOnline ? '#4caf50' : '#f44336'}`
      }}>
        <h2 style={{ margin: '0 0 10px 0', color: isOnline ? '#2e7d32' : '#c62828' }}>
          {isOnline ? '🟢 Подключено к интернету' : '🔴 Работа в офлайн режиме'}
        </h2>
        <p style={{ margin: 0, fontSize: '14px' }}>
          {isOnline 
            ? 'Вы подключены к интернету. Все функции доступны.' 
            : 'Интернет недоступен. Работаем с локальными данными.'
          }
        </p>
      </div>

      <div style={{
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>💾 Локальное хранилище</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={addToCache}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px',
              fontSize: '14px'
            }}
          >
            ➕ Добавить запись
          </button>
          
          <button 
            type="button"
            onClick={clearCache}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗑️ Очистить кэш
          </button>
        </div>

        <div>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>
            Кэшированные данные ({cachedData.length}):
          </h3>
          {cachedData.length === 0 ? (
            <p style={{ color: '#555', fontStyle: 'italic' }}>
              Нет сохранённых данных. Добавьте первую запись!
            </p>
          ) : (
            <ul style={{ paddingLeft: '20px' }}>
              {cachedData.map((item) => (
                <li key={item} style={{ marginBottom: '5px', color: '#333' }}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '10px',
        border: '1px solid #2196f3'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>
          🚀 Возможности офлайн режима
        </h2>
        <ul style={{ paddingLeft: '20px', margin: 0, color: '#1976d2' }}>
          <li style={{ marginBottom: '5px' }}>Работа с локальными данными</li>
          <li style={{ marginBottom: '5px' }}>Сохранение информации в браузере</li>
          <li style={{ marginBottom: '5px' }}>Автоматическое определение статуса сети</li>
          <li style={{ marginBottom: '5px' }}>Синхронизация при восстановлении соединения</li>
          <li style={{ marginBottom: '5px' }}>Установка как PWA приложение</li>
        </ul>
      </div>
    </main>
  )
}
