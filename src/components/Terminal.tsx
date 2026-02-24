import { useState, useRef, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale } from '../store/languageStore';

type CommandHistory = {
    cmd: string;
    output: string;
    isError?: boolean;
};

type Dict = Record<string, string>;

const commands: Record<string, (args: string[], lang: string, flags: string[], cwd: string) => string> = {
    help: (_, lang) => {
        const dict: Dict = {
            en: `Available commands:
  help          Show this help message
  whoami        Display current user
  pwd           Print working directory
  ls [path]     List directory contents
  cd <path>     Change directory
  cat <file>    Display file contents
  mkdir <name>  Create directory
  neofetch      System information
  date          Show current date and time
  uname [-a]    System information
  echo <text>   Print text
  clear         Clear terminal
  skills        Show DevOps skills
  contact       Display contact info
  ─────────────────────────────
  DevOps Commands:
  docker        Docker info and management
  kubectl       Kubernetes CLI simulation
  git           Git commands
  terraform     Terraform commands
  helm          Helm package manager`,
            es: `Comandos disponibles:
  help          Mostrar ayuda
  whoami        Mostrar usuario actual
  pwd           Mostrar directorio actual
  ls [ruta]     Listar contenido
  cd <ruta>     Cambiar directorio
  cat <archivo> Mostrar contenido
  mkdir <nombre> Crear directorio
  neofetch      Información del sistema
  date          Mostrar fecha y hora
  uname [-a]    Información del sistema
  echo <texto>  Imprimir texto
  clear         Limpiar terminal
  skills        Mostrar habilidades DevOps
  contact       Información de contacto
  ─────────────────────────────
  Comandos DevOps:
  docker        Docker info y gestión
  kubectl       Simulación CLI de Kubernetes
  git           Comandos de Git
  terraform     Comandos de Terraform
  helm          Gestor de paquetes Helm`
        };
        return dict[lang] || dict.en;
    },
    whoami: () => 'peter',
    pwd: (_, __, ___, cwd) => cwd,
    ls: (args, lang, ___, cwd) => {
        const path = args[0] || '';
        const targetDir = path.startsWith('/') ? path : cwd === '/' ? '/' + path : cwd + '/' + path;

        const dirs: Record<string, string[]> = {
            '/home/peter': ['projects/', 'skills.md', 'contact.txt', 'blog/', 'certs/', '.bashrc'],
            '/home/peter/projects': ['kubernetes-cluster/', 'ci-cd-pipeline/', 'monitoring-stack/', 'terraform-aws/'],
            '/home/peter/projects/kubernetes-cluster': ['README.md', 'deploy.yaml', 'values.yaml', 'Makefile'],
            '/home/peter/projects/ci-cd-pipeline': ['.gitlab-ci.yml', 'Dockerfile', 'scripts/'],
            '/home/peter/projects/monitoring-stack': ['prometheus.yml', 'grafana/', 'alertmanager/'],
        };

        const contents = dirs[targetDir];
        if (!contents) {
            return lang === 'es' ? `ls: no existe el directorio: ${path}` : `ls: cannot access '${path}': No such file or directory`;
        }

        const dirsList = contents.filter(c => c.endsWith('/')).sort();
        const filesList = contents.filter(c => !c.endsWith('/')).sort();
        return [...dirsList, ...filesList].join('  ');
    },
    cd: (args, lang, ___, cwd) => {
        const path = args[0] || '/home/peter';
        let targetDir = path;

        if (!path.startsWith('/')) {
            if (path === '..') {
                const parts = cwd.split('/').filter(Boolean);
                parts.pop();
                targetDir = '/' + parts.join('/') || '/';
            } else if (path === '.') {
                targetDir = cwd;
            } else {
                targetDir = cwd === '/' ? '/' + path : cwd + '/' + path;
            }
        }

        const validPaths = ['/home/peter', '/home/peter/projects', '/home/peter/projects/kubernetes-cluster',
            '/home/peter/projects/ci-cd-pipeline', '/home/peter/projects/monitoring-stack', '/'];

        if (!validPaths.includes(targetDir)) {
            return lang === 'es' ? `cd: no existe el directorio: ${path}` : `cd: no such directory: ${path}`;
        }

        return `__CWD__${targetDir}`;
    },
    cat: (args, lang) => {
        const file = args[0];
        const files: Record<string, string> = {
            'skills.md': `# DevOps Skills

## Container Orchestration
- Kubernetes, K3s, Helm
- Docker, Podman

## Cloud Platforms
- AWS (EC2, EKS, S3, Lambda)
- GCP, Azure

## CI/CD
- GitHub Actions
- GitLab CI
- ArgoCD

## Infrastructure as Code
- Terraform
- Ansible
- Pulumi`,
            'contact.txt': `Peter DevOps Engineer
─────────────────
Email:    peter@devops.engineer
GitHub:   github.com/peter-devops
Twitter:  @peterdevops
LinkedIn: linkedin.com/in/peter-devops`,
            'README.md': `# Portfolio Projects

Various DevOps projects and case studies.`,
            'deploy.yaml': `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app`,
            'values.yaml': `replicaCount: 3
image:
  repository: nginx
  tag: latest
service:
  type: ClusterIP`,
        };

        if (!file) {
            return lang === 'es' ? 'cat: falta operando de archivo' : 'cat: missing file operand';
        }

        const content = files[file];
        if (!content) {
            return lang === 'es' ? `cat: ${file}: No existe el archivo` : `cat: ${file}: No such file or directory`;
        }

        return content;
    },
    mkdir: (args, lang) => {
        const name = args[0];
        if (!name) {
            return lang === 'es' ? 'mkdir: falta operando' : 'mkdir: missing operand';
        }
        return lang === 'es' ? `mkdir: directorio '${name}' creado` : `mkdir: created directory '${name}'`;
    },
    neofetch: (_, lang) => {
        const dict: Dict = {
            en: `                    peter@peter-devops
        .-:.                  ---------------
      .sssssssss.            OS: DevOps Portfolio Linux
     :sssssssssssss:         Host: Cloud VM
    .ssssssssssssssssss.     Kernel: 6.1.0-k8s
    :ssssssssssssssssssss:   Uptime: 99.9% uptime
    \`sssssssssssssssssssss\`  Shell: bash 5.2
    \`sssssssssssssssssssss\`  Terminal: xterm-256color
     \`sssssssssssssssssss\`    CPU: 4 vCPU @ 3.2GHz
      \`.sssssssssssssssss.\`   Memory: 16GB / 32GB
        \`-sssssssssssssss-\`
                           `,
            es: `                    peter@peter-devops
        .-:.                  ---------------
      .sssssssss.            SO: DevOps Portfolio Linux
     :sssssssssssss:         Host: VM en la Nube
    .ssssssssssssssssss.     Kernel: 6.1.0-k8s
    :ssssssssssssssssssss:   Uptime: 99.9% uptime
    \`sssssssssssssssssssss\`  Shell: bash 5.2
    \`sssssssssssssssssssss\`  Terminal: xterm-256color
     \`sssssssssssssssssss\`    CPU: 4 vCPU @ 3.2GHz
      \`.sssssssssssssssss.\`   Memoria: 16GB / 32GB
        \`-sssssssssssssss-\`
                           `
        };
        return dict[lang] || dict.en;
    },
    date: () => new Date().toString(),
    uname: (args) => {
        if (args.includes('-a')) return 'Linux peter-devops 6.1.0-k8s #1 SMP x86_64 GNU/Linux';
        return 'Linux';
    },
    echo: (args) => args.join(' '),
    skills: (_, lang) => {
        const dict: Dict = {
            en: `DevOps Skills:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐳 Container    Docker, Podman, Containerd
☸️  Orchest     Kubernetes, K3s, Helm, Kustomize
☁️  Cloud       AWS, GCP, Azure
🔄  CI/CD       GitHub Actions, GitLab CI, ArgoCD
📦 IaC         Terraform, Ansible, Pulumi
🐙 Git         Git, GitHub, GitLab, Bitbucket
📊 Observab    Prometheus, Grafana, ELK, Thanos
🔐 Security    Vault, Trivy, Falco
🐳 Monitor     Thanos, Loki, Alertmanager`,
            es: `Habilidades DevOps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐳 Contenedores Docker, Podman, Containerd
☸️  Orquestación Kubernetes, K3s, Helm, Kustomize
☁️  Cloud       AWS, GCP, Azure
🔄  CI/CD       GitHub Actions, GitLab CI, ArgoCD
📦 IaC         Terraform, Ansible, Pulumi
🐙 Git         Git, GitHub, GitLab, Bitbucket
📊 Observab    Prometheus, Grafana, ELK, Thanos
🔐 Seguridad   Vault, Trivy, Falco
🐳 Monitoreo   Thanos, Loki, Alertmanager`
        };
        return dict[lang] || dict.en;
    },
    contact: (_, lang) => {
        const dict: Dict = {
            en: `Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email     peter@devops.engineer
🐙 GitHub    github.com/peter-devops
🐦 Twitter   @peterdevops
💼 LinkedIn  linkedin.com/in/peter-devops
🌐 Website   devops.engineer`,
            es: `Información de Contacto:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email     peter@devops.engineer
🐙 GitHub    github.com/peter-devops
🐦 Twitter   @peterdevops
💼 LinkedIn  linkedin.com/in/peter-devops
🌐 Web       devops.engineer`
        };
        return dict[lang] || dict.en;
    },
    docker: (args, lang) => {
        const subcmd = args[0] || 'ps';

        if (subcmd === 'ps' || subcmd === 'ps -a') {
            const dict: Dict = {
                en: `CONTAINER ID   IMAGE                    STATUS          PORTS
c8f2a1b3d4e5   nginx:latest           Up 2 hours      80:8080->80/tcp
a1b2c3d4e5f6   postgres:15            Up 5 hours      5432:5432->5432/tcp
d4e5f6a7b8c9   redis:7-alpine         Up 2 hours      6379:6379->6379/tcp
e6f7a8b9c0d1   prometheus:latest      Up 1 hour       9090:9090->9090/tcp`,
                es: `CONTENEDOR     IMAGEN                ESTADO          PUERTOS
c8f2a1b3d4e5   nginx:latest           Activo 2h       80:8080->80/tcp
a1b2c3d4e5f6   postgres:15            Activo 5h       5432:5432->5432/tcp
d4e5f6a7b8c9   redis:7-alpine         Activo 2h       6379:6379->6379/tcp
e6f7a8b9c0d1   prometheus:latest      Activo 1h       9090:9090->9090/tcp`
            };
            return dict[lang] || dict.en;
        }

        if (subcmd === 'images') {
            return `REPOSITORY          TAG       IMAGE ID       SIZE
nginx                latest    a6bd71f48f68   142MB
postgres            15        938b361d8b55   379MB
redis               7-alpine  fc8c2f46f84a   32MB
prometheus          latest    c9d7d3b5e8a2   188MB
grafana             latest    9c9b5f8e7d6a   251MB`;
        }

        if (subcmd === 'run') {
            const container = args[1] || 'container';
            return `Unable to find image 'latest' locally
Pulling from library/${container}...
latest: Pulling from library/${container} (1/3)
latest: Pulling from library/${container} (2/3)
latest: Pulling from library/${container} (3/3)
latest: Pull complete
Digest: sha256:abc123...
Status: Downloaded newer image for ${container}:latest`;
        }

        return lang === 'es'
            ? `docker: '${subcmd}' no es un comando docker válido`
            : `docker: '${subcmd}' is not a docker command`;
    },
    kubectl: (args, lang) => {
        const subcmd = args[0] || 'get pods';

        if (subcmd === 'get pods' || subcmd === 'get all') {
            const dict: Dict = {
                en: `NAMESPACE     NAME                        READY   STATUS    RESTARTS   AGE
default       nginx-deployment-6b7f6d8b9c    2/2     Running   0          5d
default       postgres-stateful-0            1/1     Running   0          12d
kube-system   coredns-6d4fb8b7c-d8e9f        1/1     Running   0          30d
kube-system   metrics-server-7b9f8c7d6-e    1/1     Running   0          28d
monitoring    prometheus-0                   1/1     Running   0          7d
monitoring    grafana-7d8f9e8c7d-6f5g4      1/1     Running   0          3d`,
                es: `NAMESPACE     NOMBRE                       READY   ESTADO    REINICIOS  EDAD
default       nginx-deployment-6b7f6d8b9c    2/2     Running   0          5d
default       postgres-stateful-0            1/1     Running   0          12d
kube-system   coredns-6d4fb8b7c-d8e9f        1/1     Running   0          30d
kube-system   metrics-server-7b9f8c7d6-e    1/1     Running   0          28d
monitoring    prometheus-0                   1/1     Running   0          7d
monitoring    grafana-7d8f9e8c7d-6f5g4      1/1     Running   0          3d`
            };
            return dict[lang] || dict.en;
        }

        if (subcmd === 'get nodes' || subcmd === 'get node') {
            return `NAME           STATUS   ROLES           AGE   VERSION
master-01     Ready    control-plane   30d   v1.28.0
worker-01     Ready    <none>          28d   v1.28.0
worker-02     Ready    <none>          28d   v1.28.0`;
        }

        if (subcmd === 'cluster-info') {
            return `Kubernetes control plane is running at https://kubernetes.local:6443
CoreDNS is running at https://kubernetes.local:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy`;
        }

        if (subcmd === 'version') {
            return `Client Version: v1.28.0
Server Version: v1.28.0 (git commit: abc123...)`;
        }

        if (subcmd === 'get svc' || subcmd === 'get services') {
            return `NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP      10.96.0.1       <none>         443/TCP        30d
nginx-svc    LoadBalancer   10.96.45.123    1.2.3.4       80:30080/TCP   5d
postgres-svc ClusterIP      10.96.78.234    <none>         5432/TCP       12d`;
        }

        return lang === 'es'
            ? `kubectl: '${subcmd}' no es un comando kubectl conocido`
            : `kubectl: '${subcmd}' is not a kubectl command`;
    },
    git: (args, lang) => {
        const subcmd = args[0] || 'status';

        if (subcmd === 'status') {
            return `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

modified:   src/components/Terminal.tsx
modified:   package.json
modified:   astro.config.mjs

no changes added to commit`;
        }

        if (subcmd === 'log') {
            return `commit a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6 (HEAD -> main)
Author: Peter <peter@devops.engineer>
Date:   ${new Date().toDateString()}

    feat: Add interactive terminal component

commit b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7 (origin/main)
Author: Peter <peter@devops.engineer>
Date:   ${new Date(Date.now() - 86400000).toDateString()}

    fix: Update portfolio content

commit c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8
Author: Peter <peter@devops.engineer>
Date:   ${new Date(Date.now() - 172800000).toDateString()}

    chore: Improve i18n support`;
        }

        if (subcmd === 'branch') {
            return `* main
  feature/terminal
  fix/navbar
  develop`;
        }

        if (subcmd === 'remote' && args[1] === '-v') {
            return `origin  git@github.com:peter-devops/portfolio.git (fetch)
origin  git@github.com:peter-devops/portfolio.git (push)`;
        }

        if (subcmd === 'diff') {
            return `diff --git a/src/components/Terminal.tsx b/src/components/Terminal.tsx
--- a/src/components/Terminal.tsx
+++ b/src/components/Terminal.tsx
@@ -1,5 +1,5 @@
-import { useState } from 'preact/hooks';
+import { useState, useEffect } from 'preact/hooks';
 import { useStore } from '@nanostores/preact';
 import { currentLocale } from '../store/languageStore';`;
        }

        return lang === 'es'
            ? `git: '${subcmd}' no es un comando git`
            : `git: '${subcmd}' is not a git command`;
    },
    terraform: (args, lang) => {
        const subcmd = args[0] || 'version';

        if (subcmd === 'version') {
            return `Terraform v1.6.0
on linux_amd64
+ provider registry.terraform.io/hashicorp/aws v5.0.0
+ provider registry.terraform.io/hashicorp/kubernetes v2.23.0`;
        }

        if (subcmd === 'init') {
            return `Initializing the backend...
Initializing provider plugins...
- Finding latest versions of hashicorp/aws...
- Using previously-installed hashicorp/aws v5.0.0
Terraform has been successfully initialized!`;
        }

        if (subcmd === 'plan') {
            return `Terraform will perform the following actions:

  # aws_instance.web will be created
  + resource "aws_instance" "web" {
      + ami                          = "ami-0c55b159cbfafe1f0"
      + instance_type               = "t3.micro"
      + tags                        = {
          + "Name" = "DevOps-Web-Server"
        }
    }

Plan: 1 to add, 0 to change, 0 to destroy.`;
        }

        if (subcmd === 'apply') {
            return `Terraform will perform the following actions:

  # aws_instance.web will be created
  + resource "aws_instance" "web" {
      + ami                          = "ami-0c55b159cbfafe1f0"
      + instance_type               = "t3.micro"
    }

Plan: 1 to add, 0 to change, 0 to destroy.
Do you want to perform these actions? Enter a value: yes

aws_instance.web: Creating...
aws_instance.web: Still creating... [10s elapsed]
aws_instance.web: Creation complete after 15s

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.`;
        }

        return lang === 'es'
            ? `terraform: '${subcmd}' no es un comando de terraform`
            : `terraform: '${subcmd}' is not a terraform command`;
    },
    helm: (args, lang) => {
        const subcmd = args[0] || 'version';

        if (subcmd === 'version') {
            return `version.BuildInfo{Version:"v3.12.0",GitCommit:"1e04014cbe1165f4e4e4c9",GitTreeState:"clean"}`;
        }

        if (subcmd === 'list') {
            return `NAME            NAMESPACE   REVISION    UPDATED                             STATUS      CHART
nginx-ingress    default     1           2024-01-15 10:30:00.123 +0000    deployed    nginx-ingress-4.5.0
prometheus       monitoring  3           2024-01-20 15:45:22.456 +0000    deployed    prometheus-25.0.0
grafana          monitoring  2           2024-01-22 09:15:33.789 +0000    deployed    grafana-6.0.0`;
        }

        if (subcmd === 'install') {
            const release = args[1] || 'release';
            const chart = args[2] || 'nginx';
            return `NAME: ${release}
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
1. Get the application URL by running these commands:
  kubectl port-forward svc/${release} 8080:80`;
        }

        if (subcmd === 'repo' && args[1] === 'list') {
            return `NAME        URL
stable      https://charts.helm.sh/stable
ingress-nginx https://kubernetes.github.io/ingress-nginx
grafana     https://grafana.github.io/helm-charts`;
        }

        return lang === 'es'
            ? `helm: '${subcmd}' no es un comando de helm`
            : `helm: '${subcmd}' is not a helm command`;
    },
};

const welcomeMessage = (lang: string): string => {
    const dict: Dict = {
        en: `Welcome to DevOps Terminal v2.0.0
Type 'help' for available commands.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        es: `Bienvenido a DevOps Terminal v2.0.0
Escribe 'help' para ver comandos disponibles.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    };
    return dict[lang] || dict.en;
};

export default function Terminal() {
    const [history, setHistory] = useState<CommandHistory[]>([]);
    const [input, setInput] = useState('');
    const [cwd, setCwd] = useState('/home/peter');
    const [historyIndex, setHistoryIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const locale = useStore(currentLocale);

    useEffect(() => {
        if (history.length === 0) {
            setHistory([{ cmd: '', output: welcomeMessage(locale) }]);
        }
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const executeCommand = (cmd: string) => {
        setHistoryIndex(-1); // reset history nav
        const trimmed = cmd.trim();
        if (!trimmed) {
            setHistory(prev => [...prev, { cmd: '', output: '' }]);
            return;
        }

        const parts = trimmed.split(' ');
        const baseCmd = parts[0];
        const args = parts.slice(1);
        const flags = args.filter(arg => arg.startsWith('-'));

        if (baseCmd === 'clear') {
            setHistory([]);
            setCwd('/home/peter');
            return;
        }

        if (baseCmd === 'cd') {
            const result = commands.cd(args, locale, flags, cwd);
            if (result.startsWith('__CWD__')) {
                setCwd(result.replace('__CWD__', ''));
                setHistory(prev => [...prev, { cmd: trimmed, output: '' }]);
            } else {
                setHistory(prev => [...prev, { cmd: trimmed, output: result, isError: true }]);
            }
            return;
        }

        if (commands[baseCmd]) {
            const result = commands[baseCmd](args, locale, flags, cwd);
            setHistory(prev => [...prev, { cmd: trimmed, output: result }]);
        } else {
            const errorMsg = locale === 'es'
                ? `Comando no encontrado: ${baseCmd}. Escribe 'help' para ver comandos.`
                : `Command not found: ${baseCmd}. Type 'help' for available commands.`;
            setHistory(prev => [...prev, { cmd: trimmed, output: errorMsg, isError: true }]);
        }
    };

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        executeCommand(input);
        setInput('');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const cmdHistory = history.filter(h => h.cmd).map(h => h.cmd);

        if (e.key === 'Enter') {
            handleSubmit(e);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length > 0) {
                const newIndex = historyIndex < cmdHistory.length - 1 ? historyIndex + 1 : historyIndex;
                setHistoryIndex(newIndex);
                setInput(cmdHistory[cmdHistory.length - 1 - newIndex] || '');
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(cmdHistory[cmdHistory.length - 1 - newIndex] || '');
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const availableCommands = Object.keys(commands);
            const matches = availableCommands.filter(c => c.startsWith(input));
            if (matches.length === 1) {
                setInput(matches[0]);
            }
        }
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <div
            className="terminal-window"
            ref={terminalRef}
            onClick={focusInput}
            style={{
                background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.85) 0%, rgba(22, 27, 34, 0.95) 100%)',
                backdropFilter: 'blur(12px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                fontSize: '0.8rem',
                lineHeight: '1.5',
                maxHeight: '450px',
                overflowY: 'auto',
                cursor: 'text',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <style>{`
                .terminal-window:hover {
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(88, 166, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.15);
                }
                .terminal-dots div {
                    transition: transform 0.2s;
                }
                .terminal-dots:hover div {
                    transform: scale(1.1);
                }
            `}</style>

            {/* Window Controls Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <div className="terminal-dots" style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', boxShadow: '0 0 5px rgba(255, 95, 86, 0.4)' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', boxShadow: '0 0 5px rgba(255, 189, 46, 0.4)' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', boxShadow: '0 0 5px rgba(39, 201, 63, 0.4)' }}></div>
                </div>
                <div style={{ color: '#8b949e', fontSize: '0.75rem', flex: 1, textAlign: 'center', fontWeight: 500 }}>
                    peter@devops-terminal ~ {cwd.replace('/home/peter', '~')}
                </div>
                <div style={{ color: '#6366f1', fontWeight: 'bold', fontSize: '0.7rem' }}>v2.0.0</div>
            </div>

            {history.map((entry, index) => (
                <div key={index} style={{ marginBottom: '0.15rem' }}>
                    {entry.cmd && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <span style={{ color: '#3fb950', fontWeight: 'bold' }}>❯</span>
                            <span style={{ color: '#e6edf3' }}>{entry.cmd}</span>
                        </div>
                    )}
                    {entry.output && (
                        <pre style={{
                            color: entry.isError ? '#ff7b72' : '#8b949e',
                            margin: '0.15rem 0 0.5rem 0.5rem',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'inherit',
                            fontSize: 'inherit'
                        }}>
                            {entry.output}
                        </pre>
                    )}
                </div>
            ))}

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                <span style={{ color: '#3fb950', fontWeight: 'bold' }}>❯</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onInput={(e) => setInput((e.target as HTMLInputElement).value)}
                    onKeyDown={handleKeyDown}
                    spellcheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#e6edf3',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        caretColor: '#3fb950'
                    }}
                />
            </form>
        </div>
    );
}
