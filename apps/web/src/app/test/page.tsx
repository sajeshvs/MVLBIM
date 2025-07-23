export default function TestPage() {
  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        color: '#1e40af', 
        marginBottom: '1rem' 
      }}>
        🧪 Test Page - Simple Browser Compatibility
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        marginBottom: '1rem'
      }}>
        <h2 style={{ color: '#374151', marginBottom: '0.5rem' }}>
          ✅ Basic HTML Rendering
        </h2>
        <p style={{ color: '#6b7280' }}>
          If you can see this text with proper styling, HTML and inline CSS are working correctly.
        </p>
      </div>

      <div style={{ 
        backgroundColor: '#fef3c7', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid #f59e0b',
        marginBottom: '1rem'
      }}>
        <h2 style={{ color: '#92400e', marginBottom: '0.5rem' }}>
          🎨 CSS Styling Test
        </h2>
        <p style={{ color: '#78350f' }}>
          Colors, padding, borders, and border-radius are all working.
        </p>
      </div>

      <div style={{ 
        backgroundColor: '#ecfdf5', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid #10b981',
        marginBottom: '1rem'
      }}>
        <h2 style={{ color: '#065f46', marginBottom: '0.5rem' }}>
          📱 Layout Test
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '4px' 
          }}>
            Box 1
          </div>
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '4px' 
          }}>
            Box 2
          </div>
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '4px' 
          }}>
            Box 3
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#fef2f2', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid #ef4444' 
      }}>
        <h2 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>
          🔗 Links Test
        </h2>
        <p style={{ marginBottom: '1rem', color: '#7f1d1d' }}>
          Testing navigation links:
        </p>
        <div>
          <a 
            href="http://localhost:3002" 
            style={{ 
              color: '#2563eb', 
              textDecoration: 'underline',
              marginRight: '1rem'
            }}
          >
            ← Back to Home
          </a>
          <a 
            href="http://localhost:3001/api" 
            style={{ 
              color: '#2563eb', 
              textDecoration: 'underline',
              marginRight: '1rem'
            }}
          >
            API
          </a>
          <a 
            href="http://localhost:3001/docs" 
            style={{ 
              color: '#2563eb', 
              textDecoration: 'underline'
            }}
          >
            Docs
          </a>
        </div>
      </div>

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#1f2937',
        color: 'white',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0 }}>
          🚀 <strong>Construction Cost Platform</strong> - All systems operational!
        </p>
      </div>
    </div>
  );
}
