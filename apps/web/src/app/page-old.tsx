export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '24px',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        width: '100%', 
        textAlign: 'center' 
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          color: '#1f2937'
        }}>
          🏗️ Construction Cost Platform
        </h1>
        
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          color: '#374151'
        }}>
          Welcome to CCP
        </h2>
        
        <p style={{ 
          fontSize: '1.1rem',
          color: '#6b7280', 
          marginBottom: '3rem',
          lineHeight: '1.6'
        }}>
          Modern construction cost management and project control platform
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              🏢 Multi-tenant
            </h3>
            <p style={{ color: '#6b7280' }}>
              Secure project management across organizations
            </p>
          </div>
          
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              ⚡ Real-time
            </h3>
            <p style={{ color: '#6b7280' }}>
              Live cost tracking and updates
            </p>
          </div>
          
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              🔗 API-first
            </h3>
            <p style={{ color: '#6b7280' }}>
              Modern architecture with open APIs
            </p>
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <a 
            href="http://localhost:3001/api" 
            style={{ 
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              marginRight: '1rem',
              marginBottom: '0.5rem'
            }}
          >
            🚀 View API
          </a>
          <a 
            href="http://localhost:3001/docs" 
            style={{ 
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              marginRight: '1rem',
              marginBottom: '0.5rem'
            }}
          >
            📚 API Documentation
          </a>
          <a 
            href="/test" 
            style={{ 
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}
          >
            🧪 Test Page
          </a>
        </div>

        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          <p style={{ margin: 0, color: '#065f46' }}>
            ✅ <strong>Status:</strong> All systems operational! Frontend & Backend running successfully.
          </p>
        </div>
      </div>
    </div>
  );
}
