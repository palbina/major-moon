import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

interface Res {
  cpu: number;
  memory: number; // in GB
}

interface Pod {
  id: string;
  name: string;
  status: 'Pending' | 'ContainerCreating' | 'Running' | 'Terminating';
  nodeId?: string;
}

interface Node {
  id: string;
  name: string;
  role: 'control-plane' | 'worker';
  status: 'Ready' | 'NotReady';
  os: string;
  capacity: Res;
  usage: Res;
}

const translations = {
  en: {
    title: 'Talos Linux Kubernetes Cluster',
    desc: 'Simulate high availability and pod scheduling across the homelab cluster nodes.',
    deployApp: 'Deploy Application',
    killNode: 'Simulate Node Failure',
    recoverNode: 'Recover Node',
    nodes: 'Nodes',
    pods: 'Pods',
    cpu: 'CPU',
    ram: 'RAM',
    ready: 'Ready',
    notReady: 'NotReady',
    running: 'Running',
    cp: 'Control Plane',
    worker: 'Worker',
    os: 'OS',
  },
  es: {
    title: 'Clúster Kubernetes con Talos Linux',
    desc: 'Simula alta disponibilidad y la programación de pods en los nodos del homelab.',
    deployApp: 'Desplegar Aplicación',
    killNode: 'Simular Caída de Nodo',
    recoverNode: 'Recuperar Nodo',
    nodes: 'Nodos',
    pods: 'Pods',
    cpu: 'CPU',
    ram: 'RAM',
    ready: 'Ready',
    notReady: 'NotReady',
    running: 'Running',
    cp: 'Control Plane',
    worker: 'Worker',
    os: 'SO',
  },
};

const INITIAL_NODES: Node[] = [
  { id: 'master-1', name: 'kmaster-01', role: 'control-plane', status: 'Ready', os: 'Talos Linux', capacity: { cpu: 4, memory: 8 }, usage: { cpu: 15, memory: 25 } },
  { id: 'master-2', name: 'kmaster-02', role: 'control-plane', status: 'Ready', os: 'Talos Linux', capacity: { cpu: 4, memory: 8 }, usage: { cpu: 12, memory: 22 } },
  { id: 'master-3', name: 'kmaster-03', role: 'control-plane', status: 'Ready', os: 'Talos Linux', capacity: { cpu: 4, memory: 8 }, usage: { cpu: 14, memory: 24 } },
  { id: 'worker-1', name: 'kworker-01', role: 'worker', status: 'Ready', os: 'Talos Linux', capacity: { cpu: 16, memory: 64 }, usage: { cpu: 30, memory: 40 } },
  { id: 'worker-2', name: 'kworker-02', role: 'worker', status: 'Ready', os: 'Talos Linux', capacity: { cpu: 16, memory: 64 }, usage: { cpu: 25, memory: 35 } },
];

export default function K8sArchitectureVisualizer() {
  const locale = useStore(currentLocale) as 'en' | 'es';
  const t = translations[locale] || translations.en;

  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [pods, setPods] = useState<Pod[]>([
    { id: 'p1', name: 'ingress-nginx', status: 'Running', nodeId: 'worker-1' },
    { id: 'p2', name: 'argocd-server', status: 'Running', nodeId: 'worker-2' },
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Dynamic status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
      case 'Running': return '#10b981'; // emerald
      case 'Pending':
      case 'ContainerCreating': return '#f59e0b'; // amber
      case 'NotReady':
      case 'Terminating': return '#ef4444'; // red
      default: return '#6b7280';
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'control-plane' ? '#8b5cf6' : '#0ea5e9';
  };

  // Actions
  const deployApp = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const newPodId = `p${Date.now()}`;
    const newPod: Pod = { id: newPodId, name: `web-app-${Math.floor(Math.random() * 1000)}`, status: 'Pending' };

    setPods(p => [...p, newPod]);

    // Simulate Kube Scheduler
    setTimeout(() => {
      setPods(p => p.map(pod => pod.id === newPodId ? { ...pod, status: 'ContainerCreating' } : pod));

      setTimeout(() => {
        // Find a healthy worker node
        const workers = nodes.filter(n => n.role === 'worker' && n.status === 'Ready');
        const targetNode = workers.length > 0 ? workers[Math.floor(Math.random() * workers.length)].id : undefined;

        setPods(p => p.map(pod => pod.id === newPodId ? { ...pod, status: targetNode ? 'Running' : 'Pending', nodeId: targetNode } : pod));

        if (targetNode) {
          // Increase node usage
          setNodes(ns => ns.map(n => n.id === targetNode ? { ...n, usage: { cpu: Math.min(100, n.usage.cpu + 5), memory: Math.min(100, n.usage.memory + 8) } } : n));
        }

        setIsSimulating(false);
      }, 1500);

    }, 800);
  };

  const toggleNodeStatus = (nodeId: string) => {
    if (isSimulating) return;
    setIsSimulating(true);

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const isFailing = node.status === 'Ready';

    if (isFailing) {
      setNodes(ns => ns.map(n => n.id === nodeId ? { ...n, status: 'NotReady', usage: { cpu: 0, memory: 0 } } : n));

      // Re-schedule pods from this node
      const affectedPods = pods.filter(p => p.nodeId === nodeId);
      if (affectedPods.length > 0) {
        setPods(ps => ps.map(p => p.nodeId === nodeId ? { ...p, status: 'Terminating' } : p));

        setTimeout(() => {
          setPods(ps => ps.filter(p => p.nodeId !== nodeId)); // Remove terminated
          affectedPods.forEach(p => deployReplica(p.name)); // Recreate
          setIsSimulating(false);
        }, 1500);
      } else {
        setIsSimulating(false);
      }
    } else {
      // Recover node
      setNodes(ns => ns.map(n => n.id === nodeId ? { ...n, status: 'Ready', usage: { cpu: 10, memory: 15 } } : n));
      setIsSimulating(false);
    }
  };

  const deployReplica = (name: string) => {
    const newPodId = `p${Date.now()}-${Math.random()}`;
    const newPod: Pod = { id: newPodId, name, status: 'ContainerCreating' };
    setPods(p => [...p, newPod]);

    setTimeout(() => {
      setNodes(currentNodes => {
        const workers = currentNodes.filter(n => n.role === 'worker' && n.status === 'Ready');
        const targetNode = workers.length > 0 ? workers[Math.floor(Math.random() * workers.length)].id : undefined;

        setPods(p => p.map(pod => pod.id === newPodId ? { ...pod, status: targetNode ? 'Running' : 'Pending', nodeId: targetNode } : pod));
        return currentNodes;
      });
    }, 1200);
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid #30363d',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.75rem',
      position: 'relative',
      minWidth: '450px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <div style={{ color: '#58a6ff', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⎈</span> {t.title}
          </div>
          <div style={{ color: '#8b949e', fontSize: '0.65rem', marginTop: '0.2rem' }}>{t.desc}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={deployApp}
          disabled={isSimulating}
          style={{
            flex: 1,
            padding: '0.6rem',
            background: isSimulating ? '#374151' : '#238636',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: isSimulating ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          {isSimulating ? '...' : `▶ ${t.deployApp}`}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Control Plane Group */}
        <div>
          <div style={{ color: '#8b5cf6', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.cp}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {nodes.filter(n => n.role === 'control-plane').map(node => (
              <NodeCard key={node.id} node={node} pods={[]} t={t} onToggle={() => toggleNodeStatus(node.id)} getStatusColor={getStatusColor} getRoleColor={getRoleColor} />
            ))}
          </div>
        </div>

        {/* Worker Node Group */}
        <div>
          <div style={{ color: '#0ea5e9', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.worker}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {nodes.filter(n => n.role === 'worker').map(node => (
              <NodeCard key={node.id} node={node} pods={pods.filter(p => p.nodeId === node.id)} t={t} onToggle={() => toggleNodeStatus(node.id)} getStatusColor={getStatusColor} getRoleColor={getRoleColor} />
            ))}
          </div>
        </div>

        {/* Unscheduled / Pending Pods */}
        {pods.filter(p => !p.nodeId).length > 0 && (
          <div style={{ padding: '0.75rem', background: '#3b2313', border: '1px dashed #f59e0b', borderRadius: '0.5rem' }}>
            <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.65rem' }}>Unscheduled Pods ⚠</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {pods.filter(p => !p.nodeId).map(pod => (
                <div key={pod.id} style={{ padding: '0.25rem 0.5rem', background: '#0a0d12', border: `1px solid ${getStatusColor(pod.status)}`, borderRadius: '0.25rem', fontSize: '0.6rem', color: '#c9d1d9', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(pod.status), animation: pod.status !== 'Pending' ? 'pulse 1s infinite' : 'none' }} />
                  {pod.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function NodeCard({ node, pods, t, onToggle, getStatusColor, getRoleColor }: { node: Node, pods: Pod[], t: any, onToggle: () => void, getStatusColor: (s: string) => string, getRoleColor: (s: string) => string }) {
  const isHealthy = node.status === 'Ready';

  return (
    <div style={{
      background: '#0d1117',
      border: `1px solid ${isHealthy ? '#30363d' : '#ef4444'}`,
      borderRadius: '0.5rem',
      padding: '0.75rem',
      transition: 'all 0.3s ease',
      boxShadow: isHealthy ? 'none' : '0 0 15px rgba(239, 68, 68, 0.2)',
      opacity: isHealthy ? 1 : 0.8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(node.status) }} />
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.7rem' }}>{node.name}</span>
          </div>
          <div style={{ fontSize: '0.55rem', color: '#8b949e', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <span style={{ background: '#1c2128', padding: '1px 4px', borderRadius: '2px' }}>{node.os}</span>
          </div>
        </div>
        <button
          onClick={onToggle}
          style={{
            background: 'transparent',
            border: 'none',
            color: isHealthy ? '#ef4444' : '#10b981',
            cursor: 'pointer',
            fontSize: '0.65rem',
            padding: '0.2rem 0',
            textDecoration: 'underline'
          }}
        >
          {isHealthy ? 'Kill' : 'Recover'}
        </button>
      </div>

      {isHealthy && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.55rem', color: '#8b949e' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>{t.cpu}</span><span>{node.usage.cpu}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: '#161b22', borderRadius: '2px' }}>
              <div style={{ width: `${node.usage.cpu}%`, height: '100%', background: getRoleColor(node.role), borderRadius: '2px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>{t.ram}</span><span>{node.usage.memory}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: '#161b22', borderRadius: '2px' }}>
              <div style={{ width: `${node.usage.memory}%`, height: '100%', background: getRoleColor(node.role), borderRadius: '2px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>
      )}

      {node.role === 'worker' && isHealthy && (
        <div style={{ borderTop: '1px solid #21262d', paddingTop: '0.5rem', minHeight: '32px' }}>
          <div style={{ fontSize: '0.55rem', color: '#8b949e', marginBottom: '0.4rem' }}>{pods.length} {t.pods}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {pods.map(pod => (
              <div
                key={pod.id}
                title={pod.name}
                style={{
                  padding: '2px 4px',
                  background: '#161b22',
                  border: `1px solid ${getStatusColor(pod.status)}40`,
                  borderRadius: '3px',
                  fontSize: '0.55rem',
                  color: '#c9d1d9',
                  maxWidth: '70px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {pod.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
