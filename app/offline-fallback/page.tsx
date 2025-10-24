'use client'

export default function OfflineFallback() {
  return (
    <main style={{
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '50px 20px',
      maxWidth: '500px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      borderRadius: '15px',
      marginTop: '50px'
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '20px'
      }}>
        📡
      </div>
      
      <h1 style={{
        color: '#dc3545',
        marginBottom: '20px',
        fontSize: '28px'
      }}>
        Нет подключения к интернету
      </h1>
      
      <p style={{
        color: '#6c757d',
        fontSize: '16px',
        lineHeight: '1.5',
        marginBottom: '30px'
      }}>
        К сожалению, эта страница недоступна в офлайн режиме.
        Проверьте подключение к интернету и попробуйте снова.
      </p>
      
      <div style={{
        padding: '20px',
        backgroundColor: '#e9ecef',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: '0 0 10px 0',
          color: '#495057'
        }}>
          💡 Что можно сделать:
        </h3>
        <ul style={{
          textAlign: 'left',
          paddingLeft: '20px',
          margin: 0,
          color: '#6c757d'
        }}>
          <li>Проверьте подключение к Wi-Fi или мобильной сети</li>
          <li>Попробуйте обновить страницу</li>
          <li>Вернитесь на главную страницу</li>
        </ul>
      </div>
      
      <button 
        type="button"
        onClick={() => {
          window.location.href = '/'
        }}
        style={{
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        🏠 На главную страницу
      </button>
    </main>
  )
}