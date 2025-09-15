import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
          🎉 Dashboard MFE v2.0 🎉
        </h1>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2>✅ Microfrontend Integration Working!</h2>
          <ul style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
            <li>✅ Shell running on port <strong>3030</strong></li>
            <li>✅ Dashboard MFE on port <strong>3031</strong></li>
            <li>✅ API Server on port <strong>3034</strong></li>
            <li>✅ Module Federation active</li>
          </ul>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h3>🏦 Account Balance</h3>
            <p style={{ fontSize: '2rem', margin: '1rem 0' }}>R$ 2.500,75</p>
            <button style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Show/Hide
            </button>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h3>💰 New Transaction</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Amount"
                style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: 'none'
                }}
              />
              <select style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: 'none'
              }}>
                <option>Deposit</option>
                <option>Withdrawal</option>
              </select>
              <button
                type="submit"
                style={{
                  background: '#2196F3',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;