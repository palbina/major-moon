import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

type DeployStrategy = 'canary' | 'blue-green' | 'rolling';

type Pod = {
  id: number;
  version: 'v1' | 'v2';
  status: 'active' | 'draining' | 'ready';
};

const translations = {
  en: {
    title: 'Argo Rollouts Simulator',
    deploy: 'Deploy v2',
    deploying: 'Deploying...',
    reset: '↺',
    canary: 'Canary',
    blueGreen: 'Blue-Green',
    rolling: 'Rolling',
    canaryDesc: 'Gradually shifts traffic to new version',
    blueGreenDesc: 'Switch all traffic at once after testing',
    rollingDesc: 'Incremental replacement of pods',
    traffic: 'Traffic',
    running: 'Running',
    complete: 'Complete',
    ready: 'Ready',
  },
  es: {
    title: 'Simulador Argo Rollouts',
    deploy: 'Desplegar v2',
    deploying: 'Desplegando...',
    reset: '↺',
    canary: 'Canary',
    blueGreen: 'Blue-Green',
    rolling: 'Rolling',
    canaryDesc: 'Traslada gradualmente el tráfico a la nueva versión',
    blueGreenDesc: 'Cambia todo el tráfico de una vez después de probar',
    rollingDesc: 'Reemplazo incremental de pods',
    traffic: 'Tráfico',
    running: 'Ejecutando',
    complete: 'Completo',
    ready: 'Listo',
  },
};

export default function ArgoRolloutsSimulator() {
  const [strategy, setStrategy] = useState<DeployStrategy>('canary');
  const [v1Pods, setV1Pods] = useState<Pod[]>([
    { id: 1, version: 'v1', status: 'active' },
    { id: 2, version: 'v1', status: 'active' },
    { id: 3, version: 'v1', status: 'active' },
  ]);
  const [v2Pods, setV2Pods] = useState<Pod[]>([]);
  const [traffic, setTraffic] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const locale = useStore(currentLocale) as 'en' | 'es';
  const t = translations[locale] || translations.en;

  const startDeployment = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setCurrentStep(0);
    
    const steps = strategy === 'canary' 
      ? [10, 25, 50, 75, 100]
      : strategy === 'blue-green'
      ? [0, 0, 50, 100, 100]
      : [25, 50, 75, 100, 100];

    let stepIndex = 0;
    
    const interval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(interval);
        setIsDeploying(false);
        return;
      }

      const percent = steps[stepIndex];
      setTraffic(percent);
      setCurrentStep(stepIndex + 1);

      if (strategy === 'canary') {
        const v2Count = Math.ceil((percent / 100) * 5);
        setV2Pods(Array.from({ length: v2Count }, (_, i) => ({
          id: i + 1,
          version: 'v2' as const,
          status: 'ready' as const
        })));
        
        if (percent === 100) {
          setV1Pods([]);
        }
      } else if (strategy === 'blue-green') {
        if (percent === 0 || percent === 50) {
          setV2Pods([]);
        } else if (percent === 100) {
          setV1Pods([]);
          setV2Pods([
            { id: 1, version: 'v2', status: 'active' },
            { id: 2, version: 'v2', status: 'active' },
            { id: 3, version: 'v2', status: 'active' },
          ]);
        }
      } else {
        const totalPods = 3;
        const v2Count = Math.ceil((percent / 100) * totalPods);
        setV2Pods(Array.from({ length: v2Count }, (_, i) => ({
          id: i + 1,
          version: 'v2' as const,
          status: 'ready' as const
        })));
        
        const v1Count = totalPods - v2Count;
        setV1Pods(Array.from({ length: v1Count }, (_, i) => ({
          id: i + 1,
          version: 'v1' as const,
          status: percent === 100 ? 'draining' as const : 'active' as const
        })));
        
        if (percent === 100) {
          setTimeout(() => setV1Pods([]), 1500);
        }
      }

      stepIndex++;
    }, 1200);
  };

  const reset = () => {
    setV1Pods([
      { id: 1, version: 'v1', status: 'active' },
      { id: 2, version: 'v1', status: 'active' },
      { id: 3, version: 'v1', status: 'active' },
    ]);
    setV2Pods([]);
    setTraffic(0);
    setIsDeploying(false);
    setCurrentStep(0);
  };

  const allPods = [...v1Pods.map(p => ({ ...p, color: '#3b82f6' })), ...v2Pods.map(p => ({ ...p, color: '#10b981' }))];

  const strategyInfo = {
    canary: { title: t.canary, desc: t.canaryDesc, steps: ['10%', '25%', '50%', '75%', '100%'] },
    'blue-green': { title: t.blueGreen, desc: t.blueGreenDesc, steps: ['Deploy', 'Test', 'Preview', 'Switch', 'Cleanup'] },
    rolling: { title: t.rolling, desc: t.rollingDesc, steps: ['25%', '50%', '75%', '100%', 'Done'] }
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
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ color: '#58a6ff', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.title}</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['canary', 'blue-green', 'rolling'] as DeployStrategy[]).map(s => (
            <button
              key={s}
              onClick={() => { setStrategy(s); reset(); }}
              disabled={isDeploying}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: strategy === s ? '#1f2937' : 'transparent',
                color: strategy === s ? '#fff' : '#6b7280',
                border: `1px solid ${strategy === s ? '#3b82f6' : '#374151'}`,
                borderRadius: '0.375rem',
                cursor: isDeploying ? 'not-allowed' : 'pointer',
                fontSize: '0.7rem',
                textTransform: 'capitalize',
                opacity: isDeploying ? 0.6 : 1
              }}
            >
              {strategyInfo[s].title}
            </button>
          ))}
        </div>
        <div style={{ color: '#9ca3af', marginTop: '0.5rem', fontSize: '0.65rem' }}>
          {strategyInfo[strategy].desc}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.7rem', color: '#6b7280' }}>
          <span>{t.traffic}: v1</span>
          <span style={{ color: '#3b82f6' }}>{100 - traffic}%</span>
        </div>
        <div style={{ height: '8px', background: '#21262d', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${100 - traffic}%`, background: '#3b82f6', transition: 'width 0.5s ease' }} />
          <div style={{ width: `${traffic}%`, background: '#10b981', transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#6b7280', marginTop: '0.25rem' }}>
          <span style={{ color: '#10b981' }}>v2: {traffic}%</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {strategyInfo[strategy].steps.map((step, i) => (
          <div
            key={i}
            style={{
              padding: '0.25rem 0.5rem',
              background: i < currentStep ? '#065f46' : i === currentStep ? '#1d4ed8' : '#21262d',
              color: i < currentStep ? '#34d399' : i === currentStep ? '#60a5fa' : '#4b5563',
              borderRadius: '0.25rem',
              fontSize: '0.6rem',
              fontWeight: 600
            }}
          >
            {step}
          </div>
        ))}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        justifyContent: 'center', 
        minHeight: '60px',
        padding: '0.75rem',
        background: '#0d1117',
        borderRadius: '0.5rem',
        marginBottom: '1rem'
      }}>
        {allPods.length === 0 ? (
          <div style={{ color: '#4b5563', alignSelf: 'center' }}>No pods running</div>
        ) : (
          allPods.map(pod => (
            <div
              key={pod.id}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: pod.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 'bold',
                color: '#fff',
                boxShadow: pod.status === 'draining' ? '0 0 8px #f59e0b' : 'none',
                animation: pod.status === 'draining' ? 'pulse 1s infinite' : 'none'
              }}
            >
              {pod.version}
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={startDeployment}
          disabled={isDeploying}
          style={{
            flex: 1,
            padding: '0.5rem',
            background: isDeploying ? '#374151' : '#238636',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: isDeploying ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          {isDeploying ? t.deploying : `▶ ${t.deploy}`}
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
