import { useState } from 'react';
import {
  FileJson,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCheck
} from 'lucide-react';
import { JsonVisualizer } from './features/json-visualizer/components/JsonVisualizer';
import './features/json-visualizer/styles/json-visualizer.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleToggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="jv-shell-layout">
      {/* Sidebar Container */}
      <aside className={`jv-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="jv-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#0b0f19'
            }}>
              J
            </div>
            {!sidebarCollapsed && (
              <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.025em' }}>
                JSON Visualizer
              </span>
            )}
          </div>
        </div>

        <nav className="jv-sidebar-nav">
          <div
            className="jv-nav-item active"
            title="JSON Tree Visualizer"
          >
            <FileJson size={20} style={{ flexShrink: 0 }} />
            {!sidebarCollapsed && <span>JSON Tree Visualizer</span>}
          </div>
        </nav>

        {/* User profile section at the bottom of the sidebar */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--jv-border-glass)',
          display: 'flex',
          flexDirection: sidebarCollapsed ? 'column' : 'row',
          alignItems: 'center',
          gap: '12px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--jv-border-active)',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            A
          </div>
          {!sidebarCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--jv-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Administrador
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--jv-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                admin@jsonformatter.com
              </div>
            </div>
          )}
          {!sidebarCollapsed && (
            <LogOut size={16} style={{ color: 'var(--jv-text-muted)', cursor: 'pointer' }} />
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="jv-content-area">
        {/* Top Header */}
        <header className="jv-top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Mobile Menu Button */}
            <button
              className="jv-btn jv-btn-secondary jv-menu-mobile-btn"
              style={{ padding: '6px', minWidth: 'auto', border: 'none' }}
              onClick={handleToggleMobile}
            >
              <Menu size={20} />
            </button>

            {/* Desktop Sidebar Toggle Button */}
            <button
              className="jv-btn jv-btn-secondary"
              style={{ display: 'flex', padding: '6px', minWidth: 'auto', border: 'none' }}
              onClick={handleToggleSidebar}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            <span style={{ fontSize: '0.95rem', fontWeight: 550, color: 'var(--jv-text-muted)' }}>
              Painel Administrativo
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--jv-text-muted)' }}>
              <UserCheck size={16} style={{ color: 'var(--jv-border-active)' }} />
              <span>Sessão Segura</span>
            </div>
          </div>
        </header>

        {/* Active Page Route Rendering */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <JsonVisualizer />
        </div>
      </div>
    </div>
  );
}

export default App;
