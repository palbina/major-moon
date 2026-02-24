import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

interface Service {
  id: string;
  name: string;
  type: 'gateway' | 'sidecar' | 'ztunnel';
  x: number;
  y: number;
}

interface TrafficFlow {
  from: string;
  to: string;
  amount: number;
  latency: number;
}

const translations = {
  en: {
    title: 'Istio Ambient Mesh',
    traffic: 'Traffic Flow',
    latency: 'Latency',
    requests: 'Req/s',
    gateway: 'Gateway',
    sidecar: 'Sidecar',
    ztunnel: 'ztunnel',
    sendRequest: 'Send Request',
    reset: 'Reset',
    flow: 'Flow',
  },
  es: {
    title: 'Istio Ambient Mesh',
    traffic: 'Flujo de Tráfico',
    latency: 'Latencia',
    requests: 'Req/s',
    gateway: 'Gateway',
    sidecar: 'Sidecar',
    ztunnel: 'ztunnel',
    sendRequest: 'Enviar Solicitud',
    reset: 'Reiniciar',
    flow: 'Flujo',
  },
};

export default function ServiceMeshVisualizer() {
  const [activeFlows, setActiveFlows] = useState<TrafficFlow[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const locale = useStore(currentLocale) as 'en' | 'es';
  const t = translations[locale] || translations.en;

  const services: Service[] = [
    { id: 'gateway', name: 'Ingress Gateway', type: 'gateway', x: 50, y: 15 },
    { id: 'waypoint', name: 'Waypoint Proxy', type: 'ztunnel', x: 50, y: 40 },
    { id: 'frontend', name: 'frontend-svc', type: 'sidecar', x: 25, y: 65 },
    { id: 'backend', name: 'backend-svc', type: 'sidecar', x: 75, y: 65 },
  ];

  const simulateTraffic = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    
    const flows: TrafficFlow[] = [
      { from: 'gateway', to: 'waypoint', amount: 100, latency: 5 },
      { from: 'waypoint', to: 'frontend', amount: 80, latency: 15 },
      { from: 'waypoint', to: 'backend', amount: 60, latency: 25 },
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= 3) {
        clearInterval(interval);
        setIsSimulating(false);
      }
      setActiveFlows(flows.slice(0, step));
    }, 800);
  };

  const reset = () => {
    setActiveFlows([]);
    setIsSimulating(false);
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'gateway': return '#f59e0b';
      case 'ztunnel': return '#8b5cf6';
      case 'sidecar': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  const getFlowIndex = (from: string, to: string) => {
    const flow = activeFlows.find(f => f.from === from && f.to === to);
    return flow ? activeFlows.indexOf(flow) : -1;
  };

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)', 
      borderRadius: '1rem', 
      padding: '1.5rem',
      border: '1px solid #30363d',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.75rem'
    }}>
      <div style={{ color: '#58a6ff', fontWeight: 'bold', marginBottom: '1rem' }}>{t.title}</div>

      <div style={{ 
        position: 'relative', 
        height: '200px', 
        background: '#0d1117', 
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        overflow: 'hidden'
      }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {activeFlows.map((flow, i) => {
            const from = services.find(s => s.id === flow.from);
            const to = services.find(s => s.id === flow.to);
            if (!from || !to) return null;
            return (
              <line
                key={`${flow.from}-${flow.to}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="#10b981"
                strokeWidth={3 - i}
                strokeDasharray="5,5"
                style={{
                  animation: 'dash 1s linear infinite',
                  opacity: 1 - (i * 0.2)
                }}
              />
            );
          })}
        </svg>

        {services.map(service => (
          <div
            key={service.id}
            style={{
              position: 'absolute',
              left: `${service.x}%`,
              top: `${service.y}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: getServiceColor(service.type),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.55rem',
              fontWeight: 'bold',
              color: '#fff',
              boxShadow: `0 0 15px ${getServiceColor(service.type)}40`
            }}>
              {service.type === 'gateway' ? 'GW' : service.type === 'ztunnel' ? 'ZT' : 'SC'}
            </div>
            <div style={{ 
              color: '#e5e7eb', 
              fontSize: '0.6rem', 
              marginTop: '0.25rem',
              textAlign: 'center',
              maxWidth: '80px'
            }}>
              {service.name}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, padding: '0.5rem', background: '#1f2937', borderRadius: '0.375rem', textAlign: 'center' }}>
          <div style={{ color: '#6b7280', fontSize: '0.55rem' }}>{t.requests}</div>
          <div style={{ color: '#10b981', fontWeight: 'bold' }}>
            {activeFlows.reduce((sum, f) => sum + f.amount, 0)}
          </div>
        </div>
        <div style={{ flex: 1, padding: '0.5rem', background: '#1f2937', borderRadius: '0.375rem', textAlign: 'center' }}>
          <div style={{ color: '#6b7280', fontSize: '0.55rem' }}>{t.latency}</div>
          <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>
            {activeFlows.length > 0 ? `${(activeFlows.reduce((sum, f) => sum + f.latency, 0) / activeFlows.length).toFixed(0)}ms` : '-'}
          </div>
        </div>
        <div style={{ flex: 1, padding: '0.5rem', background: '#1f2937', borderRadius: '0.375rem', textAlign: 'center' }}>
          <div style={{ color: '#6b7280', fontSize: '0.55rem' }}>{t.flow}</div>
          <div style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{activeFlows.length}/3</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={simulateTraffic}
          disabled={isSimulating}
          style={{
            flex: 1,
            padding: '0.5rem',
            background: isSimulating ? '#374151' : '#238636',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: isSimulating ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          {isSimulating ? (locale === 'en' ? 'Simulating...' : 'Simulando...') : `▶ ${t.sendRequest}`}
        </button>
        <button
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            background: '#21262d',
            color: '#c9d1d9',
            border: '1px solid #30363d',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.75rem'
          }}
        >
          {t.reset}
        </button>
      </div>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>
    </div>
  );
}
