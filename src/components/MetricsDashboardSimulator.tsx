import { useState, useEffect, useRef } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

interface MetricPoint {
  time: number;
  value: number;
}

interface LogEntry {
  id: number;
  time: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  service: string;
}

interface TraceSpan {
  id: string;
  service: string;
  operation: string;
  duration: number; // ms
  offset: number; // %
  width: number; // %
  error: boolean;
}

const translations = {
  en: {
    title: 'Grafana LGTM Cloud Simulation',
    mimir: 'Mimir (Metrics)',
    loki: 'Loki (Logs)',
    tempo: 'Tempo (Traces)',
    cpu: 'CPU Usage',
    memory: 'Memory',
    requests: 'Requests/sec',
    alerts: 'System Status',
    normal: 'Normal',
    warning: 'Warning',
    critical: 'Critical',
    startSim: 'Simulate Traffic Spike',
    stopSim: 'Stop',
    clear: 'Reset',
    logsEmpty: 'Awaiting logs...',
    tracesEmpty: 'Awaiting traces...',
  },
  es: {
    title: 'Simulación Grafana LGTM Cloud',
    mimir: 'Mimir (Métricas)',
    loki: 'Loki (Logs)',
    tempo: 'Tempo (Trazas)',
    cpu: 'Uso de CPU',
    memory: 'Memoria',
    requests: 'Solicitudes/s',
    alerts: 'Estado del Sistema',
    normal: 'Normal',
    warning: 'Advertencia',
    critical: 'Crítico',
    startSim: 'Simular Pico de Tráfico',
    stopSim: 'Detener',
    clear: 'Reiniciar',
    logsEmpty: 'Esperando logs...',
    tracesEmpty: 'Esperando trazas...',
  },
};

const SERVICES = ['frontend', 'auth-api', 'payment', 'database'];

export default function MetricsDashboardSimulator() {
  const [activeTab, setActiveTab] = useState<'mimir' | 'loki' | 'tempo'>('mimir');

  // Metrics state
  const [cpuData, setCpuData] = useState<MetricPoint[]>([]);
  const [memoryData, setMemoryData] = useState<MetricPoint[]>([]);
  const [requestsData, setRequestsData] = useState<MetricPoint[]>([]);

  // Logs state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Traces state
  const [traces, setTraces] = useState<TraceSpan[]>([]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [alertLevel, setAlertLevel] = useState<'normal' | 'warning' | 'critical'>('normal');
  const [logCounter, setLogCounter] = useState(0);

  const locale = useStore(currentLocale) as 'en' | 'es';
  const t = translations[locale] || translations.en;

  // Auto-scroll logs
  useEffect(() => {
    if (activeTab === 'loki' && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeStr = new Date(now).toISOString().split('T')[1].slice(0, 12);

      // 1. Generate Metrics
      const baseCpu = 30 + Math.sin(now / 10000) * 10;
      const spikeCpu = Math.random() > 0.8 ? 50 : 0;
      const newCpu = Math.min(99, Math.max(5, baseCpu + spikeCpu + Math.random() * 10));

      const newMem = 55 + Math.sin(now / 15000) * 5 + Math.random() * 5;

      const baseReq = 300 + Math.sin(now / 8000) * 100;
      const spikeReq = Math.random() > 0.85 ? 900 : 0;
      const newReq = Math.max(50, baseReq + spikeReq + Math.random() * 150);

      setCpuData(prev => [...prev.slice(-29), { time: now, value: newCpu }]);
      setMemoryData(prev => [...prev.slice(-29), { time: now, value: newMem }]);
      setRequestsData(prev => [...prev.slice(-29), { time: now, value: newReq }]);

      // Determine system status
      let currentStatus: 'normal' | 'warning' | 'critical' = 'normal';
      if (newCpu > 85) currentStatus = 'critical';
      else if (newCpu > 65) currentStatus = 'warning';
      setAlertLevel(currentStatus);

      // 2. Generate Logs (Loki)
      const numLogs = currentStatus === 'critical' ? 3 : (currentStatus === 'warning' ? 2 : 1);
      const newLogs: LogEntry[] = [];

      for (let i = 0; i < numLogs; i++) {
        let level: 'info' | 'warn' | 'error' = 'info';
        let message = 'Request processed successfully';

        if (currentStatus === 'critical' && Math.random() > 0.3) {
          level = 'error';
          message = 'Context deadline exceeded / timeout';
        } else if (currentStatus === 'warning' || Math.random() > 0.8) {
          level = 'warn';
          message = 'High latency detected in downstream call';
        }

        newLogs.push({
          id: Date.now() + i,
          time: timeStr,
          level,
          message,
          service: SERVICES[Math.floor(Math.random() * SERVICES.length)]
        });
      }

      setLogs(prev => [...prev.slice(-49), ...newLogs]);

      // 3. Generate Traces (Tempo) if critical
      if (currentStatus === 'critical' && traces.length === 0) {
        setTraces([
          { id: '1', service: 'frontend', operation: 'GET /api/checkout', duration: 2500, offset: 0, width: 100, error: true },
          { id: '2', service: 'auth-api', operation: 'VerifyToken', duration: 150, offset: 5, width: 10, error: false },
          { id: '3', service: 'payment', operation: 'ProcessCard', duration: 2200, offset: 15, width: 85, error: true },
          { id: '4', service: 'database', operation: 'INSERT transaction', duration: 2000, offset: 20, width: 80, error: true },
        ]);
      } else if (currentStatus === 'normal' && traces.length > 0 && Math.random() > 0.7) {
        // clear trace when recovering or show a normal fast trace
        setTraces([
          { id: '1', service: 'frontend', operation: 'GET /api/products', duration: 120, offset: 0, width: 100, error: false },
          { id: '2', service: 'database', operation: 'SELECT *', duration: 45, offset: 20, width: 40, error: false },
        ]);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, traces.length]);

  const reset = () => {
    setCpuData([]);
    setMemoryData([]);
    setRequestsData([]);
    setLogs([]);
    setTraces([]);
    setAlertLevel('normal');
    setIsSimulating(false);
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return '#ef4444'; // red
      case 'warning': return '#f59e0b'; // amber
      default: return '#10b981'; // emerald
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return '#ef4444';
      case 'warn': return '#f59e0b';
      default: return '#60a5fa';
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'frontend': return '#3b82f6';
      case 'auth-api': return '#8b5cf6';
      case 'payment': return '#ec4899';
      case 'database': return '#10b981';
      default: return '#9ca3af';
    }
  };

  const renderChart = (data: MetricPoint[], color: string, max: number = 100) => {
    if (data.length < 2) return null;

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = Math.max(0, 100 - (d.value / max) * 100);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg style={{ width: '100%', height: '60px', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          style={{ transition: 'all 0.3s ease', filter: `drop-shadow(0 0 4px ${color}80)` }}
        />
        <polygon
          fill={`url(#grad-${color})`}
          points={`0,100 ${points} 100,100`}
          style={{ transition: 'all 0.3s ease' }}
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
      border: '1px solid #30363d',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.75rem',
      minWidth: '450px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #30363d',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0d1117'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Faux Grafana Logo */}
          <div style={{ width: '24px', height: '24px', background: 'conic-gradient(from 180deg at 50% 50%, #F47A20 0deg, #F47A20 120deg, #F8B229 120deg, #F8B229 240deg, #F8B229 360deg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '12px', height: '12px', background: '#0d1117', borderRadius: '50%' }} />
          </div>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>{t.title}</div>
        </div>
        <div style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          background: `${getAlertColor(alertLevel)}20`,
          border: `1px solid ${getAlertColor(alertLevel)}50`,
          color: getAlertColor(alertLevel),
          fontSize: '0.65rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getAlertColor(alertLevel), boxShadow: `0 0 8px ${getAlertColor(alertLevel)}` }} />
          {t[alertLevel].toUpperCase()}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', background: '#161b22', borderBottom: '1px solid #30363d' }}>
        {(['mimir', 'loki', 'tempo'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: activeTab === tab ? '#1f2937' : 'transparent',
              color: activeTab === tab ? '#fff' : '#8b949e',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #58a6ff' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            {t[tab]}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '1.5rem', height: '260px', overflowY: 'auto' }}>

        {/* MIMIR TAB - Metrics */}
        {activeTab === 'mimir' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>

              <div style={{ padding: '1rem', background: '#1f2937', borderRadius: '0.5rem', border: '1px solid #30363d' }}>
                <div style={{ color: '#8b949e', fontSize: '0.65rem', marginBottom: '0.5rem' }}>{t.cpu}</div>
                <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold' }}>{currentCpu.toFixed(1)}%</div>
                <div style={{ marginTop: '1rem' }}>{renderChart(cpuData, '#10b981')}</div>
              </div>

              <div style={{ padding: '1rem', background: '#1f2937', borderRadius: '0.5rem', border: '1px solid #30363d' }}>
                <div style={{ color: '#8b949e', fontSize: '0.65rem', marginBottom: '0.5rem' }}>{t.memory}</div>
                <div style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: 'bold' }}>{currentMem.toFixed(1)}%</div>
                <div style={{ marginTop: '1rem' }}>{renderChart(memoryData, '#3b82f6')}</div>
              </div>

              <div style={{ padding: '1rem', background: '#1f2937', borderRadius: '0.5rem', border: '1px solid #30363d' }}>
                <div style={{ color: '#f59e0b', fontSize: '0.65rem', marginBottom: '0.5rem' }}>{t.requests}</div>
                <div style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>{currentReq.toFixed(0)}</div>
                <div style={{ marginTop: '1rem' }}>{renderChart(requestsData, '#f59e0b', 1200)}</div>
              </div>

            </div>
          </div>
        )}

        {/* LOKI TAB - Logs */}
        {activeTab === 'loki' && (
          <div style={{
            height: '100%',
            background: '#0a0d12',
            borderRadius: '0.5rem',
            border: '1px solid #30363d',
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            {logs.length === 0 ? (
              <div style={{ color: '#4b5563', margin: 'auto' }}>{t.logsEmpty}</div>
            ) : (
              logs.map(log => (
                <div key={log.id} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.65rem', borderBottom: '1px solid #1f2937', paddingBottom: '0.25rem' }}>
                  <span style={{ color: '#8b949e', minWidth: '85px' }}>{log.time}</span>
                  <span style={{
                    color: getLogLevelColor(log.level),
                    fontWeight: 'bold',
                    minWidth: '40px',
                    textTransform: 'uppercase'
                  }}>{log.level}</span>
                  <span style={{
                    color: getServiceColor(log.service),
                    minWidth: '80px',
                    background: `${getServiceColor(log.service)}15`,
                    padding: '0 4px',
                    borderRadius: '2px'
                  }}>{log.service}</span>
                  <span style={{ color: '#c9d1d9' }}>{log.message}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        )}

        {/* TEMPO TAB - Traces */}
        {activeTab === 'tempo' && (
          <div style={{ height: '100%', background: '#0a0d12', borderRadius: '0.5rem', border: '1px solid #30363d', padding: '1rem', overflowY: 'auto' }}>
            {traces.length === 0 ? (
              <div style={{ color: '#4b5563', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.tracesEmpty}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b949e', fontSize: '0.6rem', borderBottom: '1px solid #30363d', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ width: '25%' }}>Service & Operation</span>
                  <span style={{ width: '15%' }}>Duration</span>
                  <span style={{ width: '60%' }}>Timeline</span>
                </div>
                {traces.map(trace => (
                  <div key={trace.id} style={{ display: 'flex', alignItems: 'center', fontSize: '0.65rem' }}>
                    <div style={{ width: '25%', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getServiceColor(trace.service) }} />
                      <span style={{ color: '#c9d1d9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {trace.service} <span style={{ color: '#8b949e' }}>{trace.operation}</span>
                      </span>
                    </div>
                    <div style={{ width: '15%', color: trace.error ? '#ef4444' : '#8b949e', fontWeight: trace.error ? 'bold' : 'normal' }}>
                      {trace.duration}ms
                    </div>
                    <div style={{ width: '60%', position: 'relative', height: '16px', background: '#161b22', borderRadius: '2px' }}>
                      <div style={{
                        position: 'absolute',
                        left: `${trace.offset}%`,
                        width: `${trace.width}%`,
                        height: '100%',
                        background: trace.error ? '#ef4444' : getServiceColor(trace.service),
                        borderRadius: '2px',
                        minWidth: '2px'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer Controls */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid #30363d',
        background: '#161b22',
        display: 'flex',
        gap: '0.75rem'
      }}>
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          style={{
            flex: 1,
            padding: '0.65rem',
            background: isSimulating ? '#dc2626' : '#2ea043',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'background 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {isSimulating ? `■ ${t.stopSim}` : `▶ ${t.startSim}`}
        </button>
        <button
          onClick={reset}
          style={{
            padding: '0.65rem 1.5rem',
            background: '#21262d',
            color: '#c9d1d9',
            border: '1px solid #30363d',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'background 0.2s ease'
          }}
        >
          {t.clear}
        </button>
      </div>
    </div>
  );
}
