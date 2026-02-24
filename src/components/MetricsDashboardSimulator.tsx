import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

interface MetricPoint {
  time: number;
  value: number;
}

const translations = {
  en: {
    title: 'Observability Dashboard',
    cpu: 'CPU Usage',
    memory: 'Memory',
    requests: 'Requests/sec',
    alerts: 'Alerts',
    normal: 'Normal',
    warning: 'Warning',
    critical: 'Critical',
    startSim: 'Start Simulation',
    stopSim: 'Stop',
    clear: 'Clear',
  },
  es: {
    title: 'Panel de Observabilidad',
    cpu: 'Uso de CPU',
    memory: 'Memoria',
    requests: 'Solicitudes/s',
    alerts: 'Alertas',
    normal: 'Normal',
    warning: 'Advertencia',
    critical: 'Crítico',
    startSim: 'Iniciar Simulación',
    stopSim: 'Detener',
    clear: 'Limpiar',
  },
};

export default function MetricsDashboardSimulator() {
  const [cpuData, setCpuData] = useState<MetricPoint[]>([]);
  const [memoryData, setMemoryData] = useState<MetricPoint[]>([]);
  const [requestsData, setRequestsData] = useState<MetricPoint[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [alertLevel, setAlertLevel] = useState<'normal' | 'warning' | 'critical'>('normal');
  const locale = useStore(currentLocale) as 'en' | 'es';
  const t = translations[locale] || translations.en;

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const now = Date.now();
      
      const baseCpu = 40 + Math.sin(now / 10000) * 20;
      const spikeCpu = Math.random() > 0.85 ? 40 : 0;
      const newCpu = Math.min(95, Math.max(10, baseCpu + spikeCpu + Math.random() * 15));
      
      const newMem = 60 + Math.sin(now / 15000) * 10 + Math.random() * 10;
      
      const baseReq = 500 + Math.sin(now / 8000) * 200;
      const spikeReq = Math.random() > 0.9 ? 800 : 0;
      const newReq = Math.max(100, baseReq + spikeReq + Math.random() * 200);

      setCpuData(prev => [...prev.slice(-29), { time: now, value: newCpu }]);
      setMemoryData(prev => [...prev.slice(-29), { time: now, value: newMem }]);
      setRequestsData(prev => [...prev.slice(-29), { time: now, value: newReq }]);

      if (newCpu > 80 || newCpu > 90) {
        setAlertLevel('critical');
      } else if (newCpu > 65) {
        setAlertLevel('warning');
      } else {
        setAlertLevel('normal');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const reset = () => {
    setCpuData([]);
    setMemoryData([]);
    setRequestsData([]);
    setAlertLevel('normal');
    setIsSimulating(false);
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const renderChart = (data: MetricPoint[], color: string, max: number = 100) => {
    if (data.length < 2) return null;
    
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.value / max) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg style={{ width: '100%', height: '50px' }}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        />
        <polygon
          fill={`url(#grad-${color})`}
          points={`0,100 ${points} 100,100`}
        />
      </svg>
    );
  };

  const currentCpu = cpuData.length > 0 ? cpuData[cpuData.length - 1].value : 0;
  const currentMem = memoryData.length > 0 ? memoryData[memoryData.length - 1].value : 0;
  const currentReq = requestsData.length > 0 ? requestsData[requestsData.length - 1].value : 0;

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)', 
      borderRadius: '1rem', 
      padding: '1.5rem',
      border: '1px solid #30363d',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.75rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ color: '#58a6ff', fontWeight: 'bold' }}>{t.title}</div>
        <div style={{ 
          padding: '0.25rem 0.5rem', 
          borderRadius: '0.25rem', 
          background: getAlertColor(alertLevel),
          color: '#fff',
          fontSize: '0.6rem',
          fontWeight: 'bold'
        }}>
          {t[alertLevel].toUpperCase()}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.5rem', background: '#1f2937', borderRadius: '0.375rem' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.55rem', marginBottom: '0.25rem' }}>{t.cpu}</div>
          <div style={{ color: '#10b981', fontSize: '1rem', fontWeight: 'bold' }}>
            {currentCpu.toFixed(1)}%
          </div>
          {renderChart(cpuData, '#10b981')}
        </div>
        <div style={{ padding: '0.5rem', background: '#1f2937', borderRadius: '0.375rem' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.55rem', marginBottom: '0.25rem' }}>{t.memory}</div>
          <div style={{ color: '#3b82f6', fontSize: '1rem', fontWeight: 'bold' }}>
            {currentMem.toFixed(1)}%
          </div>
          {renderChart(memoryData, '#3b82f6')}
        </div>
        <div style={{ padding: '0.5rem', background: '#1f2937', borderRadius: '0.375rem' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.55rem', marginBottom: '0.25rem' }}>{t.requests}</div>
          <div style={{ color: '#f59e0b', fontSize: '1rem', fontWeight: 'bold' }}>
            {currentReq.toFixed(0)}
          </div>
          {renderChart(requestsData, '#f59e0b', 1500)}
        </div>
      </div>

      {alertLevel !== 'normal' && (
        <div style={{ 
          padding: '0.5rem', 
          marginBottom: '1rem',
          background: alertLevel === 'critical' ? '#7f1d1d' : '#78350f', 
          borderRadius: '0.375rem',
          border: `1px solid ${getAlertColor(alertLevel)}`
        }}>
          <div style={{ color: '#fca5a5', fontSize: '0.65rem' }}>
            {alertLevel === 'critical' 
              ? (locale === 'en' ? '⚠ CPU usage critical! Scaling triggered.' : '⚠ ¡Uso de CPU crítico! Escalado activado.')
              : (locale === 'en' ? '⚠ High CPU usage detected.' : '⚠ Alto uso de CPU detectado.')
            }
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          style={{
            flex: 1,
            padding: '0.5rem',
            background: isSimulating ? '#dc2626' : '#238636',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          {isSimulating ? `■ ${t.stopSim}` : `▶ ${t.startSim}`}
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
          {t.clear}
        </button>
      </div>
    </div>
  );
}
