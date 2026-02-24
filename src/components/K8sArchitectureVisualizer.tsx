import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

type NodeType = 'control-plane' | 'worker' | 'pod' | 'service';

interface K8sNode {
  id: string;
  type: NodeType;
  label: string;
  status: 'healthy' | 'warning' | 'critical';
  resources?: { cpu: string; memory: string };
}

const translations = {
  en: {
    title: 'Kubernetes Architecture',
    controlPlane: 'Control Plane',
    worker: 'Worker Node',
    pod: 'Pod',
    service: 'Service',
    healthy: 'Healthy',
    warning: 'Warning',
    critical: 'Critical',
    cpu: 'CPU',
    memory: 'Memory',
    pods: 'Pods',
    clickInfo: 'Click nodes for details',
  },
  es: {
    title: 'Arquitectura de Kubernetes',
    controlPlane: 'Plano de Control',
    worker: 'Nodo Worker',
    pod: 'Pod',
    service: 'Servicio',
    healthy: 'Saludable',
    warning: 'Advertencia',
    critical: 'Crítico',
    cpu: 'CPU',
    memory: 'Memoria',
    pods: 'Pods',
    clickInfo: 'Haz clic en los nodos para ver detalles',
  },
};

export default function K8sArchitectureVisualizer() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const locale = useStore(currentLocale) as 'en' | 'es';
  const t = translations[locale] || translations.en;

  const nodes: K8sNode[] = [
    { id: 'cp', type: 'control-plane', label: 'kube-apiserver', status: 'healthy', resources: { cpu: '500m', memory: '1Gi' } },
    { id: 'cp-etcd', type: 'control-plane', label: 'etcd', status: 'healthy', resources: { cpu: '200m', memory: '512Mi' } },
    { id: 'cp-scheduler', type: 'control-plane', label: 'kube-scheduler', status: 'healthy', resources: { cpu: '100m', memory: '256Mi' } },
    { id: 'cp-ctrl', type: 'control-plane', label: 'kube-controller', status: 'healthy', resources: { cpu: '300m', memory: '512Mi' } },
    { id: 'worker1', type: 'worker', label: 'worker-1', status: 'healthy', resources: { cpu: '4', memory: '8Gi' } },
    { id: 'worker2', type: 'worker', label: 'worker-2', status: 'warning', resources: { cpu: '3.2', memory: '7Gi' } },
    { id: 'pod1', type: 'pod', label: 'nginx-pod', status: 'healthy', resources: { cpu: '100m', memory: '128Mi' } },
    { id: 'pod2', type: 'pod', label: 'api-pod', status: 'healthy', resources: { cpu: '250m', memory: '256Mi' } },
    { id: 'pod3', type: 'pod', label: 'db-pod', status: 'critical', resources: { cpu: '500m', memory: '1Gi' } },
    { id: 'svc', type: 'service', label: 'kubernetes', status: 'healthy' },
  ];

  const getNodeColor = (type: NodeType, status: 'healthy' | 'warning' | 'critical') => {
    if (status === 'critical') return '#ef4444';
    if (status === 'warning') return '#f59e0b';
    switch (type) {
      case 'control-plane': return '#8b5cf6';
      case 'worker': return '#06b6d4';
      case 'pod': return '#10b981';
      case 'service': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const selected = nodes.find(n => n.id === selectedNode);

  const renderConnections = () => (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
        </marker>
      </defs>
      {selectedNode && (
        <>
          <line x1="25%" y1="20%" x2="50%" y2="50%" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="75%" y1="20%" x2="50%" y2="50%" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="30%" y1="50%" x2="45%" y2="50%" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="70%" y1="50%" x2="55%" y2="50%" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
        </>
      )}
    </svg>
  );

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)', 
      borderRadius: '1rem', 
      padding: '1.5rem',
      border: '1px solid #30363d',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.75rem',
      position: 'relative'
    }}>
      <div style={{ color: '#58a6ff', fontWeight: 'bold', marginBottom: '1rem' }}>{t.title}</div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '0.75rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#8b5cf6' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.6rem' }}>{t.controlPlane}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#06b6d4' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.6rem' }}>{t.worker}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.6rem' }}>{t.pod}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.6rem' }}>{t.service}</span>
          </div>
        </div>

        {nodes.map(node => (
          <button
            key={node.id}
            onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              background: selectedNode === node.id ? '#1f2937' : '#0d1117',
              border: `2px solid ${selectedNode === node.id ? '#3b82f6' : getNodeColor(node.type, node.status)}`,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: selectedNode && selectedNode !== node.id ? 0.5 : 1
            }}
          >
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: getNodeColor(node.type, node.status),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              color: '#fff'
            }}>
              {node.type === 'control-plane' ? 'CP' : node.type === 'worker' ? 'W' : node.type === 'pod' ? 'P' : 'S'}
            </div>
            <div style={{ color: '#e5e7eb', fontSize: '0.65rem', fontWeight: 600 }}>{node.label}</div>
            <div style={{ 
              fontSize: '0.55rem', 
              color: getStatusColor(node.status),
              textTransform: 'uppercase'
            }}>
              {t[node.status]}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#1f2937', 
          borderRadius: '0.5rem',
          border: '1px solid #374151'
        }}>
          <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '0.5rem' }}>{selected.label}</div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.65rem', color: '#9ca3af' }}>
            <span>{t.cpu}: {selected.resources?.cpu}</span>
            <span>{t.memory}: {selected.resources?.memory}</span>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1rem', fontSize: '0.6rem', color: '#6b7280', textAlign: 'center' }}>
        {t.clickInfo}
      </div>
    </div>
  );
}
