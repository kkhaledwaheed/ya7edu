import { Course } from '../types';

export const mockCourses: Course[] = [
  {
    id: 'course_ai_arch',
    title: 'Architecting Production Autonomous AI & Multi-Agent Systems',
    slug: 'autonomous-ai-multi-agent-systems',
    subtitle: 'Build, evaluate, and orchestrate resilient autonomous LLM agents and distributed multi-agent workflows in production.',
    description: `This comprehensive masterclass provides the exact blueprints, architectures, and design patterns required to build industrial-grade multi-agent AI systems. We cover LangGraph, autonomous decision loops, memory indexing with vector DBs, tool execution sandboxes, human-in-the-loop workflows, and latency/cost optimization.`,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    price: 199.99,
    discountPrice: 149.99,
    level: 'ADVANCED',
    category: 'Artificial Intelligence',
    status: 'APPROVED',
    instructorId: 'user_inst_1',
    instructorName: 'Dr. Marcus Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    instructorTitle: 'Principal AI Architect & Distributed Systems Specialist',
    averageRating: 4.95,
    totalStudents: 1420,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
    sections: [
      {
        id: 'sec_1',
        title: 'Module 1: Foundations of Agentic Cognitive Architectures',
        lessons: [
          {
            id: 'les_1_1',
            title: '1.1 Paradigm Shift: From Single-Prompt LLMs to Agentic Loops',
            durationMinutes: 18,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isPreview: true,
            notes: `# Paradigm Shift: From Single-Prompt LLMs to Agentic Loops

### Core Principles
1. **ReAct Pattern**: Interleaving Reasoning (thought) and Acting (tool invocation).
2. **State Machines**: Deterministic guardrails bounding stochastic LLM outputs.
3. **Short-term vs. Long-term memory**:
   - Short term: sliding window message thread + scratchpad.
   - Long term: episodic memory stored in vector index + relational state.

> "True reliability comes from deterministic orchestration wrapping non-deterministic reasoning engines."`,
            resources: [
              { id: 'res_1', name: 'Agentic_Architecture_Cheatsheet.pdf', url: '#', size: '2.4 MB', type: 'PDF' },
              { id: 'res_2', name: 'react-agent-starter.zip', url: '#', size: '840 KB', type: 'ZIP' }
            ]
          },
          {
            id: 'les_1_2',
            title: '1.2 Memory Systems: Episodic, Semantic, and Working Memory',
            durationMinutes: 24,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            notes: `# Memory Architecture in Autonomous Agents

We explore how to implement multi-tier memory:
- **Working Memory**: In-context tokens preserved across tool iterations.
- **Episodic Memory**: Stored past execution trajectories, failures, and learned reflections.
- **Semantic Memory**: Knowledge retrieval through hybrid sparse-dense vector search.`,
            resources: [
              { id: 'res_3', name: 'Memory_Tier_Diagram.png', url: '#', size: '1.2 MB', type: 'PNG' }
            ]
          },
          {
            id: 'les_1_3',
            title: '1.3 Assessment: Agentic Core Architecture Check',
            durationMinutes: 15,
            videoUrl: '',
            quiz: {
              id: 'quiz_mod_1',
              title: 'Module 1 Mastery Quiz: Agentic Architecture',
              passingScore: 80,
              timeLimitMinutes: 10,
              questions: [
                {
                  id: 'q1',
                  question: 'What is the primary architectural purpose of the ReAct pattern in autonomous agents?',
                  options: [
                    'To reduce token usage by suppressing output formatting',
                    'To alternate between verbal reasoning (thought) and external environment actions (tool execution)',
                    'To completely replace vector databases with local arrays',
                    'To make all prompt completions strictly synchronous'
                  ],
                  correctAnswerIndex: 1,
                  explanation: 'ReAct interleaves reasoning traces ("Thought") with actions ("Tool Call") and environment observations to dramatically boost reliability and error correction.'
                },
                {
                  id: 'q2',
                  question: 'Which memory type retains past task trajectories, user feedback, and post-mortem self-reflections?',
                  options: [
                    'Working context cache',
                    'Semantic vector embeddings only',
                    'Episodic memory store',
                    'CPU L3 cache'
                  ],
                  correctAnswerIndex: 2,
                  explanation: 'Episodic memory stores temporal experiences, execution histories, and retrospective evaluations of previous runs.'
                },
                {
                  id: 'q3',
                  question: 'Why are deterministic state machines (e.g. graphs) combined with LLM agents?',
                  options: [
                    'To enforce strict execution boundaries, cycle controls, and human-in-the-loop checkpoints',
                    'Because LLMs cannot run without C++ runtime engines',
                    'To eliminate the need for an API key',
                    'To convert text responses into audio files'
                  ],
                  correctAnswerIndex: 0,
                  explanation: 'State machines ensure that non-deterministic agents stay within strict business boundaries, prevent infinite recursion, and support human checkpoint intervention.'
                }
              ]
            }
          }
        ]
      },
      {
        id: 'sec_2',
        title: 'Module 2: Multi-Agent Collaboration & Supervisor Topologies',
        lessons: [
          {
            id: 'les_2_1',
            title: '2.1 Hierarchical Supervisor vs. Peer-to-Peer Consensus',
            durationMinutes: 30,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            notes: `# Hierarchical Supervisor Pattern
A centralized router agent decomposes a complex objective into distinct domain subtasks, dispatches work to specialized domain agents (Coder, Critic, Researcher, Verifier), and synthesizes the final artifact.`
          },
          {
            id: 'les_2_2',
            title: '2.2 Sandboxed Tool Execution & Secure Code Execution',
            durationMinutes: 22,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            notes: `Security boundaries: never run agent-generated shell scripts or Python code on the host server. We configure ephemeral Docker containers and gVisor microVMs with strict memory/CPU/network quotas.`
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev_1',
        userId: 'user_stud_1',
        userName: 'Sophia Rodriguez',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        comment: 'Hands down the best multi-agent systems course available. The production blueprints for state recovery and human-in-the-loop saved our startup weeks of engineering.',
        createdAt: '2024-02-18T10:15:00Z',
        instructorReply: 'Thank you Sophia! Thrilled to hear your team is deploying the state machine patterns in production.',
        instructorReplyAt: '2024-02-18T14:20:00Z'
      },
      {
        id: 'rev_2',
        userId: 'user_stud_2',
        userName: 'David Kim',
        userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        comment: 'Crystal clear explanations on sandboxing and memory retention. The quizzes are actually challenging and reinforce key takeaways.',
        createdAt: '2024-02-22T08:30:00Z'
      }
    ]
  },
  {
    id: 'course_nextjs_enterprise',
    title: 'Enterprise Next.js 15: Full-Stack Architecture & Scale',
    slug: 'enterprise-nextjs-15-architecture',
    subtitle: 'Master Server Components, Server Actions, streaming SSR, dynamic caching policies, and resilient RBAC security.',
    description: 'Learn how Fortune 500 tech teams build ultra-fast, robust Next.js applications using App Router, TypeScript, Prisma ORM, and automated CI/CD deployments.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    price: 149.99,
    discountPrice: 119.99,
    level: 'INTERMEDIATE',
    category: 'Web Development',
    status: 'APPROVED',
    instructorId: 'user_inst_1',
    instructorName: 'Dr. Marcus Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    instructorTitle: 'Principal AI Architect & Distributed Systems Specialist',
    averageRating: 4.88,
    totalStudents: 980,
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-02-15T09:00:00Z',
    sections: [
      {
        id: 'sec_next_1',
        title: 'Module 1: Server Components & Streaming Architecture',
        lessons: [
          {
            id: 'les_next_1_1',
            title: '1.1 Deep Dive: React 19 RSC Wire Format & Hydration',
            durationMinutes: 20,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isPreview: true,
            notes: 'Understanding how React Server Components eliminate client bundle bloat by rendering solely on the edge/server runtime.'
          },
          {
            id: 'les_next_1_2',
            title: '1.2 Advanced Middleware & JWT-based Role Guarding',
            durationMinutes: 25,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            notes: 'Implementing edge middleware to inspect encrypted session cookies, decode role claims, and rewrite unauthorized routes cleanly.'
          }
        ]
      }
    ],
    reviews: []
  },
  {
    id: 'course_devops_k8s',
    title: 'Kubernetes & Cloud-Native DevOps Bootcamp',
    slug: 'kubernetes-cloud-native-devops',
    subtitle: 'Zero to production Kubernetes: Helm, GitOps with ArgoCD, Prometheus monitoring, and zero-downtime canary deployments.',
    description: 'Transform your deployment workflows with industry-standard container orchestration, persistent volumes, ingress controllers, and automated GitOps rollouts.',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    price: 179.99,
    discountPrice: 139.99,
    level: 'INTERMEDIATE',
    category: 'DevOps & Cloud',
    status: 'APPROVED',
    instructorId: 'user_inst_2',
    instructorName: 'Sarah Jenkins',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    instructorTitle: 'Senior DevOps Architect & Kubernetes Ambassador',
    averageRating: 4.92,
    totalStudents: 1850,
    createdAt: '2023-11-10T14:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z',
    sections: [
      {
        id: 'sec_k8s_1',
        title: 'Module 1: Pods, Deployments & Networking',
        lessons: [
          {
            id: 'les_k8s_1_1',
            title: '1.1 Container Lifecycle & Kubernetes Core Primitives',
            durationMinutes: 32,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isPreview: true,
            notes: 'Mastering the K8s control plane: kube-apiserver, etcd, kube-scheduler, and kubelet.'
          }
        ]
      }
    ],
    reviews: []
  },
  {
    id: 'course_design_systems',
    title: 'Design Systems Engineering with Figma & Tailwind',
    slug: 'design-systems-figma-tailwind',
    subtitle: 'Bridge design and code: Build automated token pipelines, accessible component libraries, and documentation sites.',
    description: 'Learn how to construct scalable design systems that power enterprise software across web and mobile platforms with pixel-perfect consistency.',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    price: 129.99,
    level: 'BEGINNER',
    category: 'UI/UX Design',
    status: 'PENDING_REVIEW', // In Admin moderation queue!
    instructorId: 'user_inst_3',
    instructorName: 'Carlos Mendez',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    instructorTitle: 'UI/UX Design Lead & Design Systems Advocate',
    averageRating: 0,
    totalStudents: 0,
    createdAt: '2024-03-01T15:00:00Z',
    updatedAt: '2024-03-02T11:00:00Z',
    sections: [
      {
        id: 'sec_ds_1',
        title: 'Module 1: Design Tokens Architecture',
        lessons: [
          {
            id: 'les_ds_1_1',
            title: '1.1 Semantic Colors, Typography Scales, and Spacing Tokens',
            durationMinutes: 28,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            notes: 'Configuring Style Dictionary to export JSON tokens into CSS variables and Tailwind theme configurations.'
          }
        ]
      }
    ],
    reviews: []
  },
  {
    id: 'course_quantum_draft',
    title: 'Practical Quantum Computing with Qiskit',
    slug: 'practical-quantum-computing-qiskit',
    subtitle: 'From qubits to quantum algorithms: Superposition, entanglement, and Grover search implementation.',
    description: 'A hands-on introduction to quantum mechanics and programming real IBM quantum hardware via Python and Qiskit.',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: '',
    price: 249.99,
    level: 'ADVANCED',
    category: 'Computer Science',
    status: 'DRAFT', // For Instructor Course Studio builder
    instructorId: 'user_inst_1',
    instructorName: 'Dr. Marcus Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    instructorTitle: 'Principal AI Architect & Distributed Systems Specialist',
    averageRating: 0,
    totalStudents: 0,
    createdAt: '2024-03-05T09:00:00Z',
    updatedAt: '2024-03-05T09:00:00Z',
    sections: [
      {
        id: 'sec_qc_1',
        title: 'Draft Section 1: Qubit Linear Algebra',
        lessons: [
          {
            id: 'les_qc_1_1',
            title: 'Bloch Sphere and Quantum Gates',
            durationMinutes: 15,
            videoUrl: '',
            notes: 'Draft notes on Pauli X, Y, Z and Hadamard transformations.'
          }
        ]
      }
    ],
    reviews: []
  }
];
