import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

type FlowStep = 'commit' | 'push' | 'ci' | 'build' | 'image' | 'gitops' | 'sync' | 'deploy' | 'verify';

const translations = {
  en: {
    title: 'GitOps Flow',
    runFlow: 'Run Flow',
    running: 'Running...',
    reset: '↺',
    runningLabel: 'Running',
    completeLabel: 'Complete',
    pendingLabel: 'Pending',
    stepDetails: {
      commit: { title: 'Code Commit', desc: 'Developer pushes code changes', code: 'git commit -m "feat: new feature"\ngit push origin main' },
      push: { title: 'Code Push', desc: 'Code pushed to Forgejo/GitHub', code: 'To https://forgejo.local/user/app.git\n   main -> main' },
      ci: { title: 'CI Pipeline', desc: 'Forgejo Actions runs tests & scans', code: 'Run: lint, test, security-scan\n✓ All checks passed' },
      build: { title: 'Docker Build', desc: 'Build Docker image with new code', code: 'docker build -t app:v2.1.0 .\n✓ Built in 45s' },
      image: { title: 'Image Registry', desc: 'Push image to container registry', code: 'docker push ghcr.io/user/app:v2.1.0\n✓ Pushed successfully' },
      gitops: { title: 'GitOps Update', desc: 'Update GitOps repo with new image tag', code: 'Update values.yaml\n  image: v2.1.0\ngit commit & push' },
      sync: { title: 'ArgoCD Sync', desc: 'ArgoCD detects & syncs changes', code: 'Application app synced\nNamespace: default' },
      deploy: { title: 'Deploy to K8s', desc: 'Rolling update to new version', code: 'Deployment: app-v2.1.0\nPods: 3/3 Running' },
      verify: { title: 'Verify', desc: 'Health checks & metrics', code: '✓ Liveness: OK\n✓ Readiness: OK' },
    }
  },
  es: {
    title: 'Flujo GitOps',
    runFlow: 'Ejecutar',
    running: 'Ejecutando...',
    reset: '↺',
    runningLabel: 'Ejecutando',
    completeLabel: 'Completo',
    pendingLabel: 'Pendiente',
    stepDetails: {
      commit: { title: 'Commit de Código', desc: 'Desarrollador pushes cambios', code: 'git commit -m "feat: nueva funcionalidad"\ngit push origin main' },
      push: { title: 'Push de Código', desc: 'Código pusheado a Forgejo/GitHub', code: 'To https://forgejo.local/user/app.git\n   main -> main' },
      ci: { title: 'Pipeline CI', desc: 'Forgejo Actions ejecuta tests y análisis', code: 'Run: lint, test, security-scan\n✓ All checks passed' },
      build: { title: 'Build Docker', desc: 'Build de imagen Docker con nuevo código', code: 'docker build -t app:v2.1.0 .\n✓ Built in 45s' },
      image: { title: 'Registro de Imagen', desc: 'Push de imagen al registry', code: 'docker push ghcr.io/user/app:v2.1.0\n✓ Pushed successfully' },
      gitops: { title: 'Actualización GitOps', desc: 'Actualiza repo GitOps con nuevo tag', code: 'Update values.yaml\n  image: v2.1.0\ngit commit & push' },
      sync: { title: 'Sincronización ArgoCD', desc: 'ArgoCD detecta y sincroniza cambios', code: 'Application app synced\nNamespace: default' },
      deploy: { title: 'Desplegar a K8s', desc: 'Rolling update a nueva versión', code: 'Deployment: app-v2.1.0\nPods: 3/3 Running' },
      verify: { title: 'Verificar', desc: 'Health checks y métricas', code: '✓ Liveness: OK\n✓ Readiness: OK' },
    }
  },
};

const flowStepsConfig: { id: FlowStep; labelKey: string; icon: string }[] = [
  { id: 'commit', labelKey: 'commit', icon: '✏️' },
  { id: 'push', labelKey: 'push', icon: '⬆️' },
  { id: 'ci', labelKey: 'ci', icon: '⚙️' },
  { id: 'build', labelKey: 'build', icon: '📦' },
  { id: 'image', labelKey: 'image', icon: '🗃️' },
  { id: 'gitops', labelKey: 'gitops', icon: '🔄' },
  { id: 'sync', labelKey: 'sync', icon: '🔃' },
  { id: 'deploy', labelKey: 'deploy', icon: '🚀' },
  { id: 'verify', labelKey: 'verify', icon: '✅' },
];

export default function GitOpsFlow() {
  const [activeStep, setActiveStep] = useState<FlowStep | null>(null);
  const [completedSteps, setCompletedSteps] = useState<FlowStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showDetails, setShowDetails] = useState<FlowStep | null>(null);
  const locale = useStore(currentLocale) as 'en' | 'es';
  const t = translations[locale] || translations.en;

  const getLabel = (key: string) => {
    const labels: Record<string, Record<string, string>> = {
      en: { commit: 'Commit', push: 'Push', ci: 'CI', build: 'Build', image: 'Registry', gitops: 'GitOps', sync: 'Sync', deploy: 'Deploy', verify: 'Verify' },
      es: { commit: 'Commit', push: 'Push', ci: 'CI', build: 'Build', image: 'Registry', gitops: 'GitOps', sync: 'Sync', deploy: 'Deploy', verify: 'Verify' }
    };
    return labels[locale]?.[key] || key;
  };

  const runFlow = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompletedSteps([]);

    const steps: FlowStep[] = ['commit', 'push', 'ci', 'build', 'image', 'gitops', 'sync', 'deploy', 'verify'];
    let idx = 0;

    const interval = setInterval(() => {
      if (idx >= steps.length) {
        clearInterval(interval);
        setIsRunning(false);
        return;
      }

      const step = steps[idx];
      setActiveStep(step);
      if (idx > 0) {
        setCompletedSteps(prev => [...prev, steps[idx - 1]]);
      }
      idx++;
    }, 1000);
  };

  const reset = () => {
    setActiveStep(null);
    setCompletedSteps([]);
    setIsRunning(false);
    setShowDetails(null);
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
      minWidth: '450px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ color: '#58a6ff', fontWeight: 'bold' }}>{t.title}</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={runFlow}
            disabled={isRunning}
            style={{
              padding: '0.4rem 1rem',
              background: isRunning ? '#374151' : '#238636',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '0.7rem',
              fontWeight: 600
            }}
          >
            {isRunning ? t.running : `▶ ${t.runFlow}`}
          </button>
          <button
            onClick={reset}
            style={{
              padding: '0.4rem 0.75rem',
              background: '#21262d',
              color: '#c9d1d9',
              border: '1px solid #30363d',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.7rem'
            }}
          >
            {t.reset}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', justifyContent: 'center', marginBottom: '1rem' }}>
        {flowStepsConfig.map((step, index) => {
          const status = getStatus(step.id);
          const isActive = status === 'active';
          const isComplete = status === 'complete';

          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setShowDetails(showDetails === step.id ? null : step.id)}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: isActive ? '#1d4ed8' : isComplete ? '#065f46' : '#21262d',
                  color: isActive ? '#60a5fa' : isComplete ? '#34d399' : '#6b7280',
                  border: `1px solid ${isActive ? '#3b82f6' : isComplete ? '#059669' : '#30363d'}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.3s ease',
                  minWidth: '50px'
                }}
              >
                <span style={{ fontSize: '1rem' }}>{step.icon}</span>
                <span>{getLabel(step.labelKey)}</span>
              </button>
              {index < flowStepsConfig.length - 1 && (
                <div style={{ width: '12px', height: '2px', background: isComplete ? '#34d399' : '#30363d' }} />
              )}
            </div>
          );
        })}
      </div>

      {showDetails && (
        <div style={{ padding: '1rem', background: '#0d1117', borderRadius: '0.5rem', border: '1px solid #30363d' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ color: '#58a6ff', fontWeight: 'bold', fontSize: '0.8rem' }}>
              {t.stepDetails[showDetails].title}
            </div>
            <button
              onClick={() => setShowDetails(null)}
              style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1rem' }}
            >
              ×
            </button>
          </div>
          <div style={{ color: '#9ca3af', fontSize: '0.7rem', marginBottom: '0.75rem' }}>
            {t.stepDetails[showDetails].desc}
          </div>
          <pre style={{ background: '#161b22', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.65rem', color: '#34d399', overflow: 'auto', margin: 0 }}>
            {t.stepDetails[showDetails].code}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#21262d', borderRadius: '0.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '0.65rem' }}>
        <div><span style={{ color: '#1d4ed8' }}>●</span> {t.runningLabel}</div>
        <div><span style={{ color: '#059669' }}>✓</span> {t.completeLabel}</div>
        <div><span style={{ color: '#6b7280' }}>○</span> {t.pendingLabel}</div>
      </div>
    </div>
  );
}
