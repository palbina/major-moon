import { useState, useEffect, useRef } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

type FlowStep = 'commit' | 'push' | 'ci' | 'build' | 'image' | 'gitops' | 'sync' | 'deploy' | 'verify';

const translations = {
  en: {
    title: 'GitOps CI/CD Pipeline Flow',
    desc: 'Simulate a modern continuous delivery pipeline utilizing GitHub actions, Docker, and ArgoCD.',
    runFlow: 'Trigger Pipeline',
    running: 'Pipeline Running...',
    reset: '↺ Reset State',
    runningLabel: 'In Progress',
    completeLabel: 'Successful',
    pendingLabel: 'Pending',
    logsHeader: 'Pipeline Output',
    stepDetails: {
      commit: { title: 'Code Commit', desc: 'Developer pushes code to local branch', code: '> git commit -m "feat: implement distributed tracing"\n> git checkout -b feat/tracing' },
      push: { title: 'Code Push', desc: 'Code pushed to Main/Master upstream', code: '> git push origin feat/tracing\n[new branch] feat/tracing -> feat/tracing' },
      ci: { title: 'CI Pipeline', desc: 'Actions runs linters & unit tests', code: 'Running Jest suite...\nTest Suites: 82 passed, 82 total\nSonarQube: Quality Gate Passed (A)' },
      build: { title: 'Docker Build', desc: 'Build container securely', code: '> docker build -t app:v2.1.0-rc1 .\nBuilding context... 45.1MB\n[10/10] EXPORTING IMAGE ✓' },
      image: { title: 'Image Registry', desc: 'Push image & trigger webhook', code: '> docker push ghcr.io/user/app:v2.1.0-rc1\nsha256:8a13ef... pushed successfully' },
      gitops: { title: 'GitOps Commit', desc: 'CI updates Kubernetes manifests repo', code: 'Bot: Update values.yaml\n- imageTag: v2.0.9\n+ imageTag: v2.1.0-rc1\n> git push origin main' },
      sync: { title: 'ArgoCD Sync', desc: 'ArgoCD reconciles drift', code: 'ArgoCD: OutOfSync state detected.\nInitiating Sync: Prune=false, Apply=true' },
      deploy: { title: 'K8s Rollout', desc: 'Cluster applies new ReplicaSet', code: 'Deployment/app updated.\nWaiting for rollout to finish: 1 of 3 updated replicas are available...' },
      verify: { title: 'Verification', desc: 'Post-deploy checks (Metrics/SLIs)', code: 'Running Datadog/Prometheus checks...\n✓ Error Rate: 0.01% (PASS)\n✓ Latency p95: 120ms (PASS)' },
    }
  },
  es: {
    title: 'Flujo de Pipeline CI/CD GitOps',
    desc: 'Simula un pipeline de entrega continua moderno usando GitHub Actions, Docker y ArgoCD.',
    runFlow: 'Iniciar Pipeline',
    running: 'Ejecutando Pipeline...',
    reset: '↺ Reiniciar Estado',
    runningLabel: 'En Progreso',
    completeLabel: 'Exitoso',
    pendingLabel: 'Pendiente',
    logsHeader: 'Salida del Pipeline',
    stepDetails: {
      commit: { title: 'Commit de Código', desc: 'Desarrollador guarda cambios en rama', code: '> git commit -m "feat: implement distributed tracing"\n> git checkout -b feat/tracing' },
      push: { title: 'Push a Upstream', desc: 'Código subido al servidor remoto', code: '> git push origin feat/tracing\n[new branch] feat/tracing -> feat/tracing' },
      ci: { title: 'Integración Continua', desc: 'Se ejecutan tests y análisis estático', code: 'Running Jest suite...\nTest Suites: 82 passed, 82 total\nSonarQube: Quality Gate Passed (A)' },
      build: { title: 'Docker Build', desc: 'Compilación y empaquetado', code: '> docker build -t app:v2.1.0-rc1 .\nBuilding context... 45.1MB\n[10/10] EXPORTING IMAGE ✓' },
      image: { title: 'Registro (Registry)', desc: 'Envío de imagen a registro remoto', code: '> docker push ghcr.io/user/app:v2.1.0-rc1\nsha256:8a13ef... pushed successfully' },
      gitops: { title: 'Commit GitOps', desc: 'Bot actualiza el repositorio de manifiestos', code: 'Bot: Update values.yaml\n- imageTag: v2.0.9\n+ imageTag: v2.1.0-rc1\n> git push origin main' },
      sync: { title: 'Sincronización ArgoCD', desc: 'El agente detecta cambios en Git', code: 'ArgoCD: Estado OutOfSync detectado.\nIniciando Sync: Prune=false, Apply=true' },
      deploy: { title: 'Despliegue a K8s', desc: 'Aplicación del ReplicaSet', code: 'Deployment/app actualizado.\nEsperando al rollout: 1 de 3 replicas listas...' },
      verify: { title: 'Verificación', desc: 'Comprobación de métricas DORA', code: 'Ejecutando pruebas de observabilidad...\n✓ Tasa de Error: 0.01% (PASS)\n✓ Latencia p95: 120ms (PASS)' },
    }
  },
};

const flowStepsConfig: { id: FlowStep; labelKey: string; icon: string; delay: number }[] = [
  { id: 'commit', labelKey: 'commit', icon: '💻', delay: 1000 },
  { id: 'push', labelKey: 'push', icon: '↗️', delay: 1500 },
  { id: 'ci', labelKey: 'ci', icon: '🧪', delay: 2500 },
  { id: 'build', labelKey: 'build', icon: '🐳', delay: 3000 },
  { id: 'image', labelKey: 'image', icon: '📦', delay: 1500 },
  { id: 'gitops', labelKey: 'gitops', icon: '🤖', delay: 2000 },
  { id: 'sync', labelKey: 'sync', icon: '🐙', delay: 1500 },
  { id: 'deploy', labelKey: 'deploy', icon: '⎈', delay: 2500 },
  { id: 'verify', labelKey: 'verify', icon: '✅', delay: 2000 },
];

export default function GitOpsFlow() {
  const [activeStep, setActiveStep] = useState<FlowStep | null>(null);
  const [completedSteps, setCompletedSteps] = useState<FlowStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>(['Initialization: CI/CD Pipeline Simulator Ready.']);
  const logsRef = useRef<HTMLDivElement>(null);

  const locale = useStore(currentLocale) as 'en' | 'es';
  const t = translations[locale] || translations.en;

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string | string[]) => {
    if (Array.isArray(msg)) {
      setLogs(prev => [...prev.slice(-30), ...msg]);
    } else {
      setLogs(prev => [...prev.slice(-30), msg]);
    }
  };

  const runFlow = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompletedSteps([]);
    setLogs([]);
    addLog(`[System] Pipeline started manually.`);

    for (let i = 0; i < flowStepsConfig.length; i++) {
      const step = flowStepsConfig[i];
      setActiveStep(step.id);

      // Post log
      const codes = t.stepDetails[step.id].code.split('\n');
      addLog(`--- STEP: ${t.stepDetails[step.id].title.toUpperCase()} ---`);

      // Simulate real output delay 
      for (const line of codes) {
        await new Promise(r => setTimeout(r, step.delay / (codes.length + 1)));
        addLog(line);
      }

      await new Promise(r => setTimeout(r, step.delay / 3));

      // Mark complete before moving to next
      setCompletedSteps(prev => [...prev, step.id]);
    }

    setActiveStep(null);
    setIsRunning(false);
    addLog(`[System] PIPELINE EXECUTION SUCCESSFUL.`);
  };

  const reset = () => {
    setActiveStep(null);
    setCompletedSteps([]);
    setIsRunning(false);
    setLogs(['Initialization: CI/CD Pipeline Simulator Ready.']);
  };

  const getStatus = (step: FlowStep) => {
    if (completedSteps.includes(step)) return 'complete';
    if (activeStep === step) return 'active';
    return 'pending';
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
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <div style={{ color: '#58a6ff', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚡</span> {t.title}
          </div>
          <div style={{ color: '#8b949e', fontSize: '0.65rem', marginTop: '0.2rem' }}>{t.desc}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={runFlow}
          disabled={isRunning}
          style={{
            flex: 1,
            padding: '0.6rem',
            background: isRunning ? '#374151' : '#238636',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            boxShadow: isRunning ? 'none' : '0 0 10px rgba(35, 134, 54, 0.4)'
          }}
        >
          {isRunning ? t.running : `▶ ${t.runFlow}`}
        </button>
        <button
          onClick={reset}
          disabled={isRunning}
          style={{
            padding: '0.6rem 1rem',
            background: 'rgba(33, 38, 45, 0.5)',
            color: '#c9d1d9',
            border: '1px solid #30363d',
            borderRadius: '0.5rem',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem',
            opacity: isRunning ? 0.5 : 1
          }}
        >
          {t.reset}
        </button>
      </div>

      {/* Visual Pipeline Grid */}
      <div style={{ padding: '1.5rem', background: '#0a0d12', borderRadius: '0.5rem', border: '1px solid #21262d', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '0.5rem', rowGap: '2rem', justifyItems: 'center', position: 'relative' }}>
          {flowStepsConfig.map((step, index) => {
            const status = getStatus(step.id);
            const isActive = status === 'active';
            const isComplete = status === 'complete';

            return (
              <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                <div
                  style={{
                    width: '45px',
                    height: '45px',
                    background: isActive ? '#1f2937' : isComplete ? '#065f46' : '#161b22',
                    border: `2px solid ${isActive ? '#3b82f6' : isComplete ? '#10b981' : '#30363d'}`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    boxShadow: isActive ? '0 0 15px rgba(59, 130, 246, 0.5)' : isComplete ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none',
                    transition: 'all 0.3s ease',
                    marginBottom: '0.5rem'
                  }}
                >
                  {step.icon}
                </div>
                <div style={{ fontSize: '0.65rem', color: isActive ? '#58a6ff' : isComplete ? '#34d399' : '#8b949e', fontWeight: isActive || isComplete ? 'bold' : 'normal', textAlign: 'center' }}>
                  {t.stepDetails[step.id].title.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Output Terminal */}
      <div style={{ background: '#010409', borderRadius: '0.5rem', border: '1px solid #30363d', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0.4rem 0.8rem', background: '#161b22', borderBottom: '1px solid #30363d', fontSize: '0.65rem', color: '#8b949e', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚙️ {t.logsHeader}</span>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
          </div>
        </div>
        <div ref={logsRef} style={{ padding: '0.8rem', height: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.65rem', color: '#c9d1d9', fontFamily: "'JetBrains Mono', Consolas, monospace" }}>
          {logs.map((log, i) => (
            <div key={i} style={{
              color: log.includes('✓') || log.includes('SUCCESS') ? '#3fb950' :
                log.includes('--- STEP:') ? '#58a6ff' :
                  log.includes('[System]') ? '#a5d6ff' : '#c9d1d9'
            }}>
              {log}
            </div>
          ))}
          {isRunning && <div style={{ animation: 'pulse 1s infinite' }}>█</div>}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
