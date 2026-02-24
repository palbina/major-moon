import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

type PodPhase = 'pending' | 'containerCreating' | 'running' | 'terminating' | 'succeeded' | 'failed';

interface PodState {
  phase: PodPhase;
  time: number;
  containers: { name: string; status: 'waiting' | 'running' | 'terminated' }[];
}

const translations = {
  en: {
    title: 'Pod Lifecycle Simulator',
    create: 'Create Pod',
    delete: 'Delete Pod',
    restart: '↺',
    phase: 'Phase',
    containers: 'Containers',
    pending: 'Pending',
    containerCreating: 'Container Creating',
    running: 'Running',
    terminating: 'Terminating',
    succeeded: 'Succeeded',
    failed: 'Failed',
    events: 'Events',
  },
  es: {
    title: 'Simulador de Ciclo de Vida de Pod',
    create: 'Crear Pod',
    delete: 'Eliminar Pod',
    restart: '↺',
    phase: 'Fase',
    containers: 'Contenedores',
    pending: 'Pendiente',
    containerCreating: 'Creando Contenedor',
    running: 'Ejecutando',
    terminating: 'Terminando',
    succeeded: 'Exitoso',
    failed: 'Fallido',
    events: 'Eventos',
  },
};

const phaseOrder: PodPhase[] = ['pending', 'containerCreating', 'running', 'terminating', 'succeeded'];

export default function PodLifecycleSimulator() {
  const [pod, setPod] = useState<PodState | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const locale = useStore(currentLocale) as 'en' | 'es';
  const t = translations[locale] || translations.en;

  const addEvent = (msg: string) => {
    setEvents(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  const createPod = () => {
    if (isRunning) return;
    setIsRunning(true);
    setPod({
      phase: 'pending',
      time: 0,
      containers: [{ name: 'app', status: 'waiting' }]
    });
    addEvent(locale === 'en' ? 'Pod scheduled to node' : 'Pod programado al nodo');

    setTimeout(() => {
      setPod(p => p ? { ...p, phase: 'containerCreating' } : p);
      addEvent(locale === 'en' ? 'Pulling container image' : 'Descargando imagen del contenedor');
    }, 1000);

    setTimeout(() => {
      setPod(p => p ? { ...p, phase: 'running', containers: [{ name: 'app', status: 'running' }] } : p);
      addEvent(locale === 'en' ? 'Container started successfully' : 'Contenedor iniciado correctamente');
    }, 2500);
  };

  const deletePod = () => {
    if (!pod || pod.phase === 'terminating' || pod.phase === 'succeeded') return;

    setPod(p => p ? { ...p, phase: 'terminating' } : p);
    addEvent(locale === 'en' ? 'Grace period started (30s)' : 'Período de gracia iniciado (30s)');

    setTimeout(() => {
      setPod(p => p ? { ...p, phase: 'succeeded', containers: [{ name: 'app', status: 'terminated' }] } : p);
      addEvent(locale === 'en' ? 'Container terminated' : 'Contenedor terminado');
      setIsRunning(false);
    }, 2000);
  };

  const reset = () => {
    setPod(null);
    setEvents([]);
    setIsRunning(false);
  };

  const getPhaseColor = (phase: PodPhase) => {
    switch (phase) {
      case 'pending': return '#f59e0b';
      case 'containerCreating': return '#3b82f6';
      case 'running': return '#10b981';
      case 'terminating': return '#ef4444';
      case 'succeeded': return '#22c55e';
      case 'failed': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const phaseProgress = pod ? (phaseOrder.indexOf(pod.phase) / (phaseOrder.length - 1)) * 100 : 0;

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
      <div style={{ color: '#58a6ff', fontWeight: 'bold', marginBottom: '1rem' }}>{t.title}</div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: '#9ca3af', fontSize: '0.7rem' }}>{t.phase}</span>
          <span style={{ color: getPhaseColor(pod?.phase || 'pending'), fontWeight: 'bold' }}>
            {pod ? t[pod.phase] : '-'}
          </span>
        </div>
        <div style={{ height: '8px', background: '#21262d', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${phaseProgress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #3b82f6, #10b981)',
            transition: 'width 0.5s ease'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.55rem', color: '#6b7280' }}>
          <span>Pending</span>
          <span>Running</span>
          <span>Succeeded</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1rem',
        padding: '1.5rem',
        background: '#0d1117',
        borderRadius: '0.5rem'
      }}>
        {pod ? (
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '8px',
            background: getPhaseColor(pod.phase),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: pod.phase === 'running' ? `0 0 20px ${getPhaseColor(pod.phase)}` : 'none',
            animation: pod.phase === 'containerCreating' ? 'spin 2s linear infinite' :
              pod.phase === 'terminating' ? 'pulse 1s infinite' : 'none'
          }}>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.7rem' }}>POD</span>
            <span style={{ color: '#fff', fontSize: '0.5rem', opacity: 0.8 }}>{pod.phase}</span>
          </div>
        ) : (
          <div style={{ color: '#4b5563', alignSelf: 'center' }}>
            {locale === 'en' ? 'No pod running' : 'Sin pod ejecutándose'}
          </div>
        )}
      </div>

      {pod && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#1f2937', borderRadius: '0.5rem' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.65rem', marginBottom: '0.5rem' }}>{t.containers}</div>
          {pod.containers.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: c.status === 'running' ? '#10b981' : c.status === 'terminated' ? '#6b7280' : '#f59e0b'
              }} />
              <span style={{ color: '#e5e7eb' }}>{c.name}</span>
              <span style={{ color: '#6b7280' }}>({c.status})</span>
            </div>
          ))}
        </div>
      )}

      {events.length > 0 && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#0d1117', borderRadius: '0.5rem' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.65rem', marginBottom: '0.5rem' }}>{t.events}</div>
          {events.map((e, i) => (
            <div key={i} style={{ color: '#9ca3af', fontSize: '0.6rem', marginBottom: '0.25rem' }}>{e}</div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={createPod}
          disabled={isRunning && pod?.phase !== 'succeeded'}
          style={{
            flex: 1,
            padding: '0.5rem',
            background: isRunning && pod?.phase !== 'succeeded' ? '#374151' : '#238636',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: isRunning && pod?.phase !== 'succeeded' ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          ▶ {t.create}
        </button>
        <button
          onClick={deletePod}
          disabled={!pod || pod.phase === 'terminating' || pod.phase === 'succeeded'}
          style={{
            flex: 1,
            padding: '0.5rem',
            background: !pod || pod.phase === 'terminating' || pod.phase === 'succeeded' ? '#374151' : '#dc2626',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: !pod || pod.phase === 'terminating' || pod.phase === 'succeeded' ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          ■ {t.delete}
        </button>
        <button
          onClick={reset}
          style={{
            padding: '0.5rem',
            background: '#21262d',
            color: '#c9d1d9',
            border: '1px solid #30363d',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.75rem'
          }}
        >
          {t.restart}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
