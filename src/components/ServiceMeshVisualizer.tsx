import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

interface Node {
  id: string;
  label: string;
  name: string;
  type: 'gateway' | 'proxy' | 'ztunnel' | 'pod' | 'waypoint';
  x: number;
  y: number;
}

interface Flow {
  from: string;
  to: string;
  mtls?: boolean;
}

const translations = {
  en: {
    title: 'Istio Ambient vs Sidecar Mesh',
    desc: 'Compare traditional sidecar architecture with the new Ambient mode.',
    sidecar: 'Sidecar',
    ambient: 'Ambient',
    send: 'Simulate Traffic',
    reset: 'Reset',
    latency: 'Latency',
    steps: 'Steps',
    gateway: 'Gateway',
    proxy: 'Envoy Sidecar',
    ztunnel: 'ztunnel (L4)',
    waypoint: 'Waypoint (L7)',
    pod: 'App Pod',
    mtls: 'mTLS Enabled'
  },
  es: {
    title: 'Istio Ambient vs Sidecar',
    desc: 'Compara la arquitectura tradicional sidecar con el nuevo modo Ambient.',
    sidecar: 'Sidecar',
    ambient: 'Ambient',
    send: 'Simular Tráfico',
    reset: 'Reiniciar',
    latency: 'Latencia',
    steps: 'Pasos',
    gateway: 'Gateway',
    proxy: 'Envoy Sidecar',
    ztunnel: 'ztunnel (L4)',
    waypoint: 'Waypoint (L7)',
    pod: 'Pod App',
    mtls: 'mTLS Activo'
  },
};

const sidecarNodes: Node[] = [
  { id: 'gw', label: 'GW', name: 'gateway', type: 'gateway', x: 15, y: 50 },
  { id: 'fesc', label: 'SC', name: 'proxy', type: 'proxy', x: 45, y: 70 },
  { id: 'fe', label: 'FE', name: 'pod', type: 'pod', x: 45, y: 25 },
  { id: 'besc', label: 'SC', name: 'proxy', type: 'proxy', x: 80, y: 70 },
  { id: 'be', label: 'BE', name: 'pod', type: 'pod', x: 80, y: 25 },
];

const ambientNodes: Node[] = [
  { id: 'gw', label: 'GW', name: 'gateway', type: 'gateway', x: 10, y: 50 },
  { id: 'zt1', label: 'ZT', name: 'ztunnel', type: 'ztunnel', x: 30, y: 75 },
  { id: 'fe', label: 'FE', name: 'pod', type: 'pod', x: 30, y: 25 },
  { id: 'wp', label: 'WP', name: 'waypoint', type: 'waypoint', x: 55, y: 50 },
  { id: 'zt2', label: 'ZT', name: 'ztunnel', type: 'ztunnel', x: 80, y: 75 },
  { id: 'be', label: 'BE', name: 'pod', type: 'pod', x: 80, y: 25 },
];

const sidecarFlows: Flow[] = [
  { from: 'gw', to: 'fesc' },
  { from: 'fesc', to: 'fe' },
  { from: 'fe', to: 'fesc' },
  { from: 'fesc', to: 'besc', mtls: true },
  { from: 'besc', to: 'be' }
];

const ambientFlows: Flow[] = [
  { from: 'gw', to: 'zt1' },
  { from: 'zt1', to: 'fe' },
  { from: 'fe', to: 'zt1' },
  { from: 'zt1', to: 'wp', mtls: true },
  { from: 'wp', to: 'zt2', mtls: true },
  { from: 'zt2', to: 'be' }
];

export default function ServiceMeshVisualizer() {
  const [mode, setMode] = useState<'sidecar' | 'ambient'>('ambient');
  const [activeStep, setActiveStep] = useState(-1);
  const [isSimulating, setIsSimulating] = useState(false);
  const locale = useStore(currentLocale) as 'en' | 'es';
  const t = translations[locale] || translations.en;

  const nodes = mode === 'sidecar' ? sidecarNodes : ambientNodes;
  const flows = mode === 'sidecar' ? sidecarFlows : ambientFlows;

  const simulateTraffic = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(-1);

    let step = -1;
    const interval = setInterval(() => {
      step++;
      if (step >= flows.length) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setActiveStep(step);
      }
    }, 800);
  };

  const reset = () => {
    setActiveStep(-1);
    setIsSimulating(false);
  };

  useEffect(() => {
    reset();
  }, [mode]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'gateway': return '#f59e0b'; // amber
      case 'ztunnel': return '#8b5cf6'; // purple
      case 'proxy': return '#ec4899'; // pink
      case 'waypoint': return '#0ea5e9'; // sky
      case 'pod': return '#10b981'; // emerald
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid #30363d',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.75rem',
      minWidth: '450px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <div style={{ color: '#58a6ff', fontWeight: 'bold', fontSize: '1rem' }}>{t.title}</div>
          <div style={{ color: '#9ca3af', fontSize: '0.65rem', marginTop: '0.25rem' }}>{t.desc}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setMode('sidecar')}
          disabled={isSimulating}
          style={{
            flex: 1,
            padding: '0.5rem',
            background: mode === 'sidecar' ? '#1f2937' : 'transparent',
            color: mode === 'sidecar' ? '#fff' : '#6b7280',
            border: `1px solid ${mode === 'sidecar' ? '#ec4899' : '#374151'}`,
            borderRadius: '0.375rem',
            cursor: isSimulating ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600,
            opacity: isSimulating ? 0.5 : 1
          }}
        >
          {t.sidecar}
        </button>
        <button
          onClick={() => setMode('ambient')}
          disabled={isSimulating}
          style={{
            flex: 1,
            padding: '0.5rem',
            background: mode === 'ambient' ? '#1f2937' : 'transparent',
            color: mode === 'ambient' ? '#fff' : '#6b7280',
            border: `1px solid ${mode === 'ambient' ? '#8b5cf6' : '#374151'}`,
            borderRadius: '0.375rem',
            cursor: isSimulating ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600,
            opacity: isSimulating ? 0.5 : 1
          }}
        >
          {t.ambient}
        </button>
      </div>

      <div style={{
        position: 'relative',
        height: '240px',
        background: '#0a0d12',
        borderRadius: '0.75rem',
        border: '1px solid #1f2937',
        marginBottom: '1.5rem',
        overflow: 'hidden'
      }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
          <defs>
            <marker id="arrow-normal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#4b5563" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#10b981" />
            </marker>
            <marker id="arrow-mtls" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#8b5cf6" />
            </marker>
          </defs>

          {/* Base lines */}
          {flows.map((flow, i) => {
            const from = nodes.find(s => s.id === flow.from);
            const to = nodes.find(s => s.id === flow.to);
            if (!from || !to) return null;
            return (
              <line
                key={`base-${i}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="#374151"
                strokeWidth="2"
                strokeDasharray={flow.mtls ? "4,4" : "0"}
                markerEnd="url(#arrow-normal)"
              />
            );
          })}

          {/* Active lines */}
          {flows.map((flow, i) => {
            if (i > activeStep) return null;
            const from = nodes.find(s => s.id === flow.from);
            const to = nodes.find(s => s.id === flow.to);
            if (!from || !to) return null;

            const isCurrent = i === activeStep;
            const flowColor = flow.mtls ? '#8b5cf6' : '#10b981';

            return (
              <line
                key={`active-${i}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke={flowColor}
                strokeWidth={isCurrent ? "3" : "2"}
                strokeDasharray={flow.mtls ? "6,4" : "0"}
                markerEnd={`url(${flow.mtls ? '#arrow-mtls' : '#arrow-active'})`}
                style={{
                  animation: isCurrent && flow.mtls ? 'dash-mtls 0.5s linear infinite' : 'none',
                  opacity: isCurrent ? 1 : 0.4
                }}
              />
            );
          })}
        </svg>

        {nodes.map(node => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2,
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: node.type === 'pod' ? '8px' : '50%',
              background: '#0d1117',
              border: `2px solid ${getNodeColor(node.type)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 'bold',
              color: '#fff',
              boxShadow: activeStep >= 0 && flows[activeStep]?.to === node.id
                ? `0 0 20px ${getNodeColor(node.type)}80`
                : 'none',
              transition: 'box-shadow 0.3s ease'
            }}>
              {node.label}
            </div>
            <div style={{
              color: '#9ca3af',
              fontSize: '0.55rem',
              marginTop: '0.4rem',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              background: '#0d1117ee',
              padding: '2px 4px',
              borderRadius: '4px'
            }}>
              {(t as any)[node.name] || node.name}
            </div>
          </div>
        ))}

        {mode === 'ambient' && (
          <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', color: '#8b5cf6', fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', background: '#8b5cf620', borderRadius: '1rem', border: '1px solid #8b5cf640', zIndex: 10 }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderTop: '2px dashed #8b5cf6' }}></span> {t.mtls}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, padding: '0.75rem', background: '#1f2937', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: '#6b7280', fontSize: '0.6rem', marginBottom: '0.25rem' }}>{t.steps}</div>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>
            {activeStep + 1} <span style={{ color: '#4b5563', fontSize: '0.75rem' }}>/ {flows.length}</span>
          </div>
        </div>
        <div style={{ flex: 1, padding: '0.75rem', background: '#1f2937', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: '#6b7280', fontSize: '0.6rem', marginBottom: '0.25rem' }}>{t.latency}</div>
          <div style={{ color: mode === 'ambient' ? '#10b981' : '#f59e0b', fontWeight: 'bold', fontSize: '1rem' }}>
            {activeStep === flows.length - 1 ? (mode === 'ambient' ? '3ms' : '8ms') : '-'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={simulateTraffic}
          disabled={isSimulating}
          style={{
            flex: 1,
            padding: '0.6rem',
            background: isSimulating ? '#374151' : '#2ea043',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: isSimulating ? 'not-allowed' : 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'background 0.2s ease'
          }}
        >
          {isSimulating ? '...' : `▶ ${t.send}`}
        </button>
        <button
          onClick={reset}
          style={{
            padding: '0.6rem 1.25rem',
            background: '#21262d',
            color: '#c9d1d9',
            border: '1px solid #30363d',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'background 0.2s ease'
          }}
        >
          {t.reset}
        </button>
      </div>

      <style>{`
        @keyframes dash-mtls {
          to { stroke-dashoffset: -10; }
        }
      `}</style>
    </div>
  );
}
