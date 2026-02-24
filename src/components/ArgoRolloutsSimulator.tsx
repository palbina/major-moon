import { useState, useEffect, useRef } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

type DeployStrategy = 'canary' | 'blue-green' | 'rolling';

type Pod = {
  id: string;
  version: 'v1' | 'v2';
  status: 'active' | 'draining' | 'pending' | 'ready';
};

const translations = {
  en: {
    title: 'Argo Rollouts Simulator',
    deploy: 'Deploy v2',
    deploying: 'Deploying...',
    reset: '↺ Reset State',
    canary: 'Canary',
    blueGreen: 'Blue-Green',
    rolling: 'Rolling',
    canaryDesc: 'Gradually shifts traffic to new version using weighted routing.',
    blueGreenDesc: 'Switch all traffic at once after previewing the new stack.',
    rollingDesc: 'Incremental replacement of pods (Standard Kubernetes).',
    traffic: 'Live Traffic Routing',
    running: 'Running',
    complete: 'Complete',
    ready: 'Ready',
    liveLogs: 'Rollout Logs (kubectl argo rollouts get)',
  },
  es: {
    title: 'Simulador Argo Rollouts',
    deploy: 'Desplegar v2',
    deploying: 'Desplegando...',
    reset: '↺ Reiniciar Estado',
    canary: 'Canary',
    blueGreen: 'Blue-Green',
    rolling: 'Rolling',
    canaryDesc: 'Traslada gradualmente el tráfico usando pesos de enrutamiento.',
    blueGreenDesc: 'Cambia todo el tráfico de una vez tras verificar el nuevo stack.',
    rollingDesc: 'Reemplazo incremental de pods (Kubernetes estándar).',
    traffic: 'Enrutamiento de Tráfico en Vivo',
    running: 'Ejecutando',
    complete: 'Completo',
    ready: 'Listo',
    liveLogs: 'Logs del Rollout (kubectl argo rollouts get)',
  },
};

export default function ArgoRolloutsSimulator() {
  const [strategy, setStrategy] = useState<DeployStrategy>('canary');
  const [v1Pods, setV1Pods] = useState<Pod[]>([
    { id: 'v1-1', version: 'v1', status: 'active' },
    { id: 'v1-2', version: 'v1', status: 'active' },
    { id: 'v1-3', version: 'v1', status: 'active' },
    { id: 'v1-4', version: 'v1', status: 'active' },
  ]);
  const [v2Pods, setV2Pods] = useState<Pod[]>([]);
  const [traffic, setTraffic] = useState(0); // percentage to v2
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>(['Waiting for deployment trigger...']);

  const locale = useStore(currentLocale) as 'en' | 'es';
  const t = translations[locale] || translations.en;
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev.slice(-15), `[${time}] ${msg}`]);
  };

  const startDeployment = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setCurrentStep(0);
    setLogs([]);
    addLog(`Starting ${strategy} deployment of v2...`);

    const steps = strategy === 'canary'
      ? [10, 33, 66, 100, 100]
      : strategy === 'blue-green'
        ? [0, 0, 0, 100, 100]
        : [25, 50, 75, 100, 100];

    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDeploying(false);
          addLog(`Deployment completed successfully. All traffic is now on v2.`);
          if (strategy !== 'blue-green') {
            setV1Pods([]); // Cleanup v1
          } else {
            // In blue-green we keep v1 draining for a bit then kill it
            setTimeout(() => setV1Pods([]), 2000);
          }
        }, 1000);
        return;
      }

      const percent = steps[stepIndex];
      setCurrentStep(stepIndex + 1);

      if (strategy === 'canary') {
        const v2Count = Math.max(1, Math.ceil((percent / 100) * 4));
        if (percent === 10) addLog(`Setting Canay Weight to ${percent}%`);
        else if (percent < 100) addLog(`Advancing Rollout. Setting weight to ${percent}%`);
        else if (percent === 100 && stepIndex === steps.length - 2) addLog(`Promoting Rollout to 100%`);

        setTraffic(percent);
        setV2Pods(Array.from({ length: v2Count }, (_, i) => ({
          id: `v2-${i + 1}`, version: 'v2', status: 'active'
        })));

        if (percent === 100) {
          setV1Pods(prev => prev.map(p => ({ ...p, status: 'draining' })));
        }

      } else if (strategy === 'blue-green') {
        if (stepIndex === 0) {
          addLog(`Creating Preview Stack (v2)`);
          setV2Pods(Array.from({ length: 4 }, (_, i) => ({ id: `v2-${i + 1}`, version: 'v2', status: 'pending' })));
        } else if (stepIndex === 1) {
          addLog(`Testing Preview Stack...`);
          setV2Pods(prev => prev.map(p => ({ ...p, status: 'ready' })));
        } else if (stepIndex === 2) {
          addLog(`Preview Tests Passed.`);
        } else if (percent === 100 && traffic !== 100) {
          addLog(`Promoting Rollout. Active Service switched to v2 (100% traffic).`);
          setTraffic(100);
          setV1Pods(prev => prev.map(p => ({ ...p, status: 'draining' })));
          setV2Pods(prev => prev.map(p => ({ ...p, status: 'active' })));
        }
      } else { // rolling
        const totalPods = 4;
        const v2Count = Math.ceil((percent / 100) * totalPods);
        const v1Count = totalPods - v2Count;

        addLog(`Scaling down v1 replica set (${v1Count}/${totalPods})`);
        addLog(`Scaling up v2 replica set (${v2Count}/${totalPods})`);

        setV2Pods(Array.from({ length: v2Count }, (_, i) => ({ id: `v2-${i + 1}`, version: 'v2', status: 'active' })));
        setV1Pods(Array.from({ length: v1Count }, (_, i) => ({ id: `v1-${i + 1}`, version: 'v1', status: 'active' })));
        setTraffic(percent);
      }

      stepIndex++;
    }, 2000);
  };

  const reset = () => {
    setV1Pods([
      { id: 'v1-1', version: 'v1', status: 'active' },
      { id: 'v1-2', version: 'v1', status: 'active' },
      { id: 'v1-3', version: 'v1', status: 'active' },
      { id: 'v1-4', version: 'v1', status: 'active' },
    ]);
    setV2Pods([]);
    setTraffic(0);
    setIsDeploying(false);
    setCurrentStep(0);
    setLogs(['State reset. Waiting for trigger...']);
  };

  const strategyInfo = {
    canary: { title: t.canary, desc: t.canaryDesc, steps: ['10%', '33%', '66%', '100%', 'Promoted'] },
    'blue-green': { title: t.blueGreen, desc: t.blueGreenDesc, steps: ['Deploy', 'Test', 'Approve', 'Switch', 'ScaleDown'] },
    rolling: { title: t.rolling, desc: t.rollingDesc, steps: ['25%', '50%', '75%', '100%', 'Done'] }
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid #30363d',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.75rem',
      minWidth: '450px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#58a6ff', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🐙</span> {t.title}
          </div>
          <button
            onClick={reset}
            style={{
              padding: '0.4rem 0.8rem',
              background: 'rgba(33, 38, 45, 0.5)',
              color: '#c9d1d9',
              border: '1px solid #30363d',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.7rem',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#30363d'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(33, 38, 45, 0.5)'}
          >
            {t.reset}
          </button>
        </div>

        <div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['canary', 'blue-green', 'rolling'] as DeployStrategy[]).map(s => (
              <button
                key={s}
                onClick={() => { setStrategy(s); reset(); }}
                disabled={isDeploying}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: strategy === s ? 'rgba(59, 130, 246, 0.15)' : 'rgba(13, 17, 23, 0.5)',
                  color: strategy === s ? '#58a6ff' : '#8b949e',
                  border: `1px solid ${strategy === s ? '#3b82f6' : '#30363d'}`,
                  borderRadius: '0.5rem',
                  cursor: isDeploying ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: strategy === s ? 'bold' : 'normal',
                  textTransform: 'capitalize',
                  opacity: isDeploying && strategy !== s ? 0.4 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: strategy === s ? '0 0 10px rgba(59, 130, 246, 0.1)' : 'none'
                }}
              >
                {strategyInfo[s].title}
              </button>
            ))}
          </div>
          <div style={{ color: '#8b949e', marginTop: '0.5rem', fontSize: '0.65rem' }}>
            {strategyInfo[strategy].desc}
          </div>
        </div>
      </div>

      {/* Traffic Visualization */}
      <div style={{ background: '#0a0d12', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #21262d' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
          <span style={{ color: '#3b82f6' }}>v1 (Stable) - {100 - traffic}%</span>
          <span style={{ color: '#10b981' }}>{traffic}% - v2 (Canary)</span>
        </div>
        <div style={{ height: '12px', background: '#21262d', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${100 - traffic}%`, background: '#3b82f6', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          <div style={{ width: `${traffic}%`, background: '#10b981', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </div>
      </div>

      {/* Pipeline Steps Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.2rem', flexWrap: 'wrap' }}>
        {strategyInfo[strategy].steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                padding: '0.3rem 0.6rem',
                background: i < currentStep ? 'rgba(16, 185, 129, 0.2)' : i === currentStep ? 'rgba(59, 130, 246, 0.2)' : 'rgba(33, 38, 45, 0.5)',
                color: i < currentStep ? '#34d399' : i === currentStep ? '#60a5fa' : '#8b949e',
                border: `1px solid ${i < currentStep ? '#059669' : i === currentStep ? '#3b82f6' : '#30363d'}`,
                borderRadius: '0.25rem',
                fontSize: '0.65rem',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
            >
              {step}
            </div>
            {i < strategyInfo[strategy].steps.length - 1 && (
              <div style={{ width: '20px', height: '2px', background: i < currentStep - 1 ? '#059669' : '#30363d', transition: 'background 0.3s ease' }} />
            )}
          </div>
        ))}
      </div>

      {/* Pod Visuals */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1rem',
        background: '#0d1117',
        borderRadius: '0.5rem',
        border: '1px solid #21262d',
      }}>
        {/* V1 Pods */}
        <div style={{ display: 'flex', gap: '0.5rem', minHeight: '40px', alignItems: 'center' }}>
          <span style={{ color: '#3b82f6', width: '30px', fontWeight: 'bold' }}>v1</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {v1Pods.length === 0 && <span style={{ color: '#4b5563', fontSize: '0.65rem', fontStyle: 'italic' }}>Scaled down</span>}
            {v1Pods.map(pod => (
              <div key={pod.id} style={{
                padding: '0.4rem 0.8rem',
                background: pod.status === 'draining' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                border: `1px solid ${pod.status === 'draining' ? '#f59e0b' : '#3b82f6'}`,
                borderRadius: '0.25rem',
                color: pod.status === 'draining' ? '#fcd34d' : '#93c5fd',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                animation: pod.status === 'draining' ? 'pulse 1s infinite' : 'none'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: pod.status === 'draining' ? '#f59e0b' : '#3b82f6' }} />
                {pod.status === 'draining' ? 'Terminating' : 'Running'}
              </div>
            ))}
          </div>
        </div>

        {/* V2 Pods */}
        <div style={{ display: 'flex', gap: '0.5rem', minHeight: '40px', alignItems: 'center' }}>
          <span style={{ color: '#10b981', width: '30px', fontWeight: 'bold' }}>v2</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {v2Pods.length === 0 && <span style={{ color: '#4b5563', fontSize: '0.65rem', fontStyle: 'italic' }}>Pending scale up</span>}
            {v2Pods.map(pod => {
              const bColor = pod.status === 'pending' ? '#6b7280' : pod.status === 'ready' ? '#34d399' : '#10b981';
              const bgColor = pod.status === 'pending' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(16, 185, 129, 0.2)';
              return (
                <div key={pod.id} style={{
                  padding: '0.4rem 0.8rem',
                  background: bgColor,
                  border: `1px solid ${bColor}`,
                  borderRadius: '0.25rem',
                  color: bColor,
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  animation: pod.status === 'pending' ? 'pulse 1s infinite' : 'none'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: bColor }} />
                  {pod.status === 'pending' ? 'ContainerCreating' : pod.status === 'ready' ? 'Ready (Preview)' : 'Running'}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Terminal Details */}
      <div style={{ background: '#0a0d12', borderRadius: '0.5rem', border: '1px solid #30363d', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0.4rem 0.8rem', background: '#161b22', borderBottom: '1px solid #30363d', fontSize: '0.65rem', color: '#8b949e', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>>_ {t.liveLogs}</span>
        </div>
        <div ref={logsRef} style={{ padding: '0.8rem', height: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.65rem', color: '#34d399' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ opacity: i === logs.length - 1 ? 1 : 0.7 }}>{log}</div>
          ))}
          {isDeploying && <div style={{ opacity: 0.5, animation: 'pulse 1s infinite' }}>_</div>}
        </div>
      </div>

      {/* Main Action Action */}
      <button
        onClick={startDeployment}
        disabled={isDeploying}
        style={{
          width: '100%',
          padding: '0.8rem',
          background: isDeploying ? '#374151' : 'linear-gradient(90deg, #238636 0%, #2ea043 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: isDeploying ? 'not-allowed' : 'pointer',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          transition: 'all 0.2s',
          boxShadow: isDeploying ? 'none' : '0 0 15px rgba(46, 160, 67, 0.4)'
        }}
      >
        {isDeploying ? `${t.deploying} [${traffic}%]` : `▶ ${t.deploy}`}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
