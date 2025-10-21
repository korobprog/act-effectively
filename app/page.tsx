'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main style={{
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '100px 20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1>🌐 Добро пожаловать!</h1>
      <p>Этот сайт работает <strong>офлайн</strong> 🚀</p>
      <p>Вы можете добавить его на главный экран и использовать без интернета.</p>
      
      <div style={{
        marginTop: '40px',
        padding: '30px',
        backgroundColor: '#f8f9fa',
        borderRadius: '15px',
        border: '2px solid #e9ecef'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#495057' }}>
          📱 Попробуйте офлайн режим
        </h2>
        <p style={{ margin: '0 0 25px 0', color: '#6c757d' }}>
          Перейдите на специальную страницу для работы без интернета
        </p>
        
        <Link 
          href="/offline"
          style={{
            display: 'inline-block',
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0,123,255,0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,123,255,0.4)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,123,255,0.3)'
          }}
        >
          🚀 Перейти в офлайн режим
        </Link>
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e8f5e8',
        borderRadius: '10px',
        border: '1px solid #c3e6c3'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>
          💡 Как использовать:
        </h3>
        <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: 0, color: '#2e7d32' }}>
          <li>Нажмите кнопку выше для перехода в офлайн режим</li>
          <li>Отключите интернет и попробуйте добавить данные</li>
          <li>Данные сохранятся локально в браузере</li>
          <li>При восстановлении интернета данные останутся</li>
        </ul>
      </div>
    </main>
  )
}
