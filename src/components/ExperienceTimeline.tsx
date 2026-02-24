import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

interface Commit {
    id: string;
    hash: string;
    role: Record<'en' | 'es', string>;
    company: string;
    date: Record<'en' | 'es', string>;
    details: Record<'en' | 'es', string[]>;
}

const timeline: Commit[] = [
    {
        id: 'current',
        hash: 'a1b2c3d',
        role: { en: 'Senior DevOps Engineer', es: 'Ingeniero DevOps Senior' },
        company: 'Tech Corp',
        date: { en: '2023 - Present', es: '2023 - Presente' },
        details: {
            en: [
                'Designed and deployed Highly Available Kubernetes clusters using Talos Linux.',
                'Migrated legacy applications to ArgoCD, reducing deployment times by 40%.',
                'Implemented Istio Ambient Mesh for mTLS and L7 observability.',
            ],
            es: [
                'Diseño y despliegue de clústers Kubernetes de Alta Disponibilidad usando Talos Linux.',
                'Migración de apps heredadas a ArgoCD, reduciendo el tiempo de deploy en un 40%.',
                'Implementación de Istio Ambient Mesh para mTLS y observabilidad L7.',
            ],
        },
    },
    {
        id: 'mid',
        hash: '4f5a6b7',
        role: { en: 'Cloud Infrastructure Engineer', es: 'Ingeniero de Infraestructura Cloud' },
        company: 'Cloud Solutions Inc.',
        date: { en: '2020 - 2023', es: '2020 - 2023' },
        details: {
            en: [
                'Automated AWS infrastructure provisioning using Terraform and CI/CD pipelines.',
                'Managed a multi-environment CI/CD pipeline in GitHub Actions/GitLab CI.',
                'Reduced cloud costs by 25% through resource sizing and spot instances.',
            ],
            es: [
                'Automatización de provisión en AWS usando Terraform y pipelines CI/CD.',
                'Gestión de pipelines multi-ambiente en GitHub Actions/GitLab CI.',
                'Reducción de costos cloud en 25% mediante sizing y spot instances.',
            ],
        },
    },
    {
        id: 'junior',
        hash: '8c9d0e1',
        role: { en: 'Linux Systems Administrator', es: 'Administrador de Sistemas Linux' },
        company: 'ServerTech',
        date: { en: '2018 - 2020', es: '2018 - 2020' },
        details: {
            en: [
                'Administered 200+ Linux servers (CentOS/Ubuntu), handling updates and security.',
                'Wrote Python and Bash scripts to automate standard operational procedures.',
                'Managed bare-metal hypervisors (Proxmox/KVM) and storage clusters.',
            ],
            es: [
                'Administración de más de 200 servidores Linux, manejando parches y seguridad.',
                'Desarrollo de scripts en Python y Bash para automatizar operaciones de TI.',
                'Gestión de hipervisores bare-metal (Proxmox/KVM) y storage.',
            ],
        }
    }
];

export default function ExperienceTimeline() {
    const locale = useStore(currentLocale) as 'en' | 'es';
    const [activeCommit, setActiveCommit] = useState<string>(timeline[0].id);

    return (
        <div style={{
            background: 'linear-gradient(180deg, rgba(13, 17, 23, 0.8) 0%, rgba(22, 27, 34, 0.8) 100%)',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid #30363d',
            fontFamily: "'JetBrains Mono', monospace",
            color: '#c9d1d9',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            margin: '2rem 0'
        }}>
            <h3 style={{
                margin: '0 0 1.5rem 0',
                color: '#58a6ff',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                fontSize: '1.25rem'
            }}>
                <svg fill="currentColor" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M11.93 8.5a4.002 4.002 0 01-7.86 0H.75a.75.75 0 010-1.5h3.32a4.002 4.002 0 017.86 0h3.32a.75.75 0 010 1.5h-3.32zM8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path></svg>
                {locale === 'es' ? 'Git History: Experiencia' : 'Git History: Experience'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {timeline.map((commit, index) => {
                    const isActive = activeCommit === commit.id;
                    const isLast = index === timeline.length - 1;

                    return (
                        <div key={commit.id} style={{ display: 'flex', gap: '1.5rem' }}>
                            {/* Branch/Node Graph */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
                                <div
                                    onClick={() => setActiveCommit(commit.id)}
                                    style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        background: isActive ? '#238636' : '#161b22',
                                        border: `2px solid ${isActive ? '#3fb950' : '#8b949e'}`,
                                        cursor: 'pointer',
                                        zIndex: 2,
                                        boxShadow: isActive ? '0 0 10px rgba(46, 160, 67, 0.5)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                />
                                {!isLast && (
                                    <div style={{
                                        width: '2px',
                                        flex: 1,
                                        background: isActive ? 'linear-gradient(180deg, #3fb950 0%, #30363d 100%)' : '#30363d',
                                        margin: '0.2rem 0'
                                    }} />
                                )}
                            </div>

                            {/* Commit Content */}
                            <div
                                onClick={() => setActiveCommit(commit.id)}
                                style={{
                                    flex: 1,
                                    paddingBottom: isLast ? '0' : '2rem',
                                    cursor: 'pointer',
                                    opacity: isActive ? 1 : 0.6,
                                    transform: isActive ? 'translateX(5px)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ color: '#e6edf3', fontWeight: 'bold', fontSize: '1rem' }}>{commit.role[locale]}</span>
                                    <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>@ {commit.company}</span>
                                    <span style={{
                                        color: '#8b949e',
                                        fontSize: '0.75rem',
                                        background: '#21262d',
                                        padding: '0.1rem 0.4rem',
                                        borderRadius: '0.3rem',
                                        marginLeft: 'auto'
                                    }}>
                                        {commit.hash}
                                    </span>
                                </div>

                                <div style={{ color: '#8b949e', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                                    {commit.date[locale]}
                                </div>

                                {/* Details expand area */}
                                <div style={{
                                    maxHeight: isActive ? '300px' : '0',
                                    overflow: 'hidden',
                                    transition: 'max-height 0.4s ease, opacity 0.4s ease, margin 0.4s ease',
                                    opacity: isActive ? 1 : 0,
                                    marginTop: isActive ? '1rem' : '0'
                                }}>
                                    <div style={{
                                        padding: '1rem',
                                        background: 'rgba(33, 38, 45, 0.4)',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #30363d'
                                    }}>
                                        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#c9d1d9', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {commit.details[locale].map((desc, i) => (
                                                <li key={i}>{desc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
