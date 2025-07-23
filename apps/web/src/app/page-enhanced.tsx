export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Navigation Header */}
      <nav style={{
        backgroundColor: '#1f2937',
        padding: '1rem 2rem',
        borderBottom: '2px solid #374151',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🏗️</span>
            <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>MVLBIM CCP</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="/" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: '500' }}>Home</a>
            <a href="/projects" style={{ color: '#9ca3af', textDecoration: 'none', fontWeight: '500' }}>Projects</a>
            <a href="/costs" style={{ color: '#9ca3af', textDecoration: 'none', fontWeight: '500' }}>Costs</a>
            <a href="/reports" style={{ color: '#9ca3af', textDecoration: 'none', fontWeight: '500' }}>Reports</a>
            <a href="/settings" style={{ color: '#9ca3af', textDecoration: 'none', fontWeight: '500' }}>Settings</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar */}
        <aside style={{
          width: '280px',
          backgroundColor: '#f9fafb',
          borderRight: '1px solid #e5e7eb',
          padding: '2rem 1rem'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#374151', marginBottom: '1rem', fontSize: '1.1rem' }}>📊 Dashboard</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/dashboard" style={{ 
                  color: '#6b7280', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  display: 'block',
                  borderRadius: '4px'
                }}>Overview</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/analytics" style={{ 
                  color: '#6b7280', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  display: 'block',
                  borderRadius: '4px'
                }}>Analytics</a>
              </li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#374151', marginBottom: '1rem', fontSize: '1.1rem' }}>🏗️ Projects</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/projects/new" style={{ 
                  color: '#6b7280', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  display: 'block',
                  borderRadius: '4px'
                }}>New Project</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/projects/active" style={{ 
                  color: '#6b7280', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  display: 'block',
                  borderRadius: '4px'
                }}>Active Projects</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/projects/completed" style={{ 
                  color: '#6b7280', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  display: 'block',
                  borderRadius: '4px'
                }}>Completed</a>
              </li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#374151', marginBottom: '1rem', fontSize: '1.1rem' }}>💰 Cost Management</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/costs/estimates" style={{ 
                  color: '#6b7280', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  display: 'block',
                  borderRadius: '4px'
                }}>Estimates</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/costs/budgets" style={{ 
                  color: '#6b7280', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  display: 'block',
                  borderRadius: '4px'
                }}>Budgets</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/costs/tracking" style={{ 
                  color: '#6b7280', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  display: 'block',
                  borderRadius: '4px'
                }}>Cost Tracking</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: '#374151', marginBottom: '1rem', fontSize: '1.1rem' }}>🔧 Tools</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="http://localhost:3001/api" style={{ 
                  color: '#3b82f6', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  display: 'block',
                  borderRadius: '4px'
                }}>🚀 API</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="http://localhost:3001/docs" style={{ 
                  color: '#10b981', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  display: 'block',
                  borderRadius: '4px'
                }}>📚 Documentation</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/test" style={{ 
                  color: '#8b5cf6', 
                  textDecoration: 'none', 
                  padding: '0.5rem',
                  display: 'block',
                  borderRadius: '4px'
                }}>🧪 Test Page</a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ 
          flex: 1, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 style={{ 
                fontSize: '3rem', 
                color: 'white', 
                marginBottom: '1rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                Construction Cost Platform
              </h1>
              <p style={{ 
                fontSize: '1.2rem', 
                color: '#e2e8f0',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Modern construction cost management and project control platform
              </p>
            </div>

            {/* Quick Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem', 
              marginBottom: '3rem' 
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '2rem', color: '#fbbf24', marginBottom: '0.5rem' }}>24</div>
                <div style={{ color: 'white', fontSize: '0.9rem' }}>Active Projects</div>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '2rem', color: '#34d399', marginBottom: '0.5rem' }}>$2.4M</div>
                <div style={{ color: 'white', fontSize: '0.9rem' }}>Total Budget</div>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '2rem', color: '#60a5fa', marginBottom: '0.5rem' }}>89%</div>
                <div style={{ color: 'white', fontSize: '0.9rem' }}>On Schedule</div>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '2rem', color: '#f87171', marginBottom: '0.5rem' }}>3</div>
                <div style={{ color: 'white', fontSize: '0.9rem' }}>Issues</div>
              </div>
            </div>

            {/* Feature Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '2rem', 
              marginBottom: '2rem' 
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Multi-tenant</h3>
                <p style={{ color: '#cbd5e0' }}>Secure project management across organizations</p>
              </div>
              
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Real-time</h3>
                <p style={{ color: '#cbd5e0' }}>Live cost tracking and updates</p>
              </div>
              
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>API-first</h3>
                <p style={{ color: '#cbd5e0' }}>Modern architecture with open APIs</p>
              </div>
            </div>

            {/* Status */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              color: '#10b981',
              textAlign: 'center'
            }}>
              ✅ <strong>Status:</strong> All systems operational. Frontend & Backend running successfully.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
