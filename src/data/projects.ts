export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  images: string[];
  tags: string[];
  techStack: string[];
  category: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  features: string[];
  challenges: string[];
  metrics: {
    value: string;
    label: string;
    description?: string;
  }[];
  implementation: {
    approach: string;
    technologies: {
      name: string;
      reason: string;
    }[];
  };
  architecture?: string;
  // documentation may include setup, usage, api, contributing, and other free-form notes
  documentation: Record<string, any>;
  // repository metadata / notes — allow flexible shape since different projects provide different fields
  repoNotes?: Record<string, any>;
}

export const projectsData: Project[] = [
  {
    id: "healthy-ai",
    title: "Healthy AI",
    description:
      "Production-grade AI health prediction platform for real-time heart disease risk scoring.",
    fullDescription:
      "Healthy AI is a production-ready platform built during NIELIT x IIT Ropar training. It uses a Gradient Boosting Classifier on heart-disease datasets, provides interactive EDA, and generates automated PDF reports per patient for practical clinical workflows.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80"],
    tags: ["Python", "Flask", "Scikit-learn", "Pandas", "ReportLab"],
    techStack: ["Python", "Flask", "Scikit-learn", "Pandas", "Matplotlib", "ReportLab"],
    category: "Live Projects",
    featured: true,
    githubUrl: "https://github.com/BhavyaKansal20/healthy-ai.git",
    liveUrl: "https://healthyai-dlog.onrender.com",
    features: [
      "Real-time risk scoring",
      "Interactive exploratory analytics",
      "Patient-wise PDF report generation",
      "Deployable web interface",
    ],
    challenges: [
      "Balancing interpretability and performance for clinical use",
      "Building stable report generation for varied input quality",
    ],
    metrics: [
      { value: "Live", label: "Deployment", description: "Hosted on Render" },
      { value: "1", label: "Core Model", description: "Gradient Boosting Classifier" },
      { value: "Auto", label: "Reporting", description: "Per-patient PDF export" },
    ],
    implementation: {
      approach:
        "Built as an end-to-end Flask workflow: data processing, model inference, visualization, and downloadable reports.",
      technologies: [
        { name: "Flask", reason: "Simple and reliable web serving layer for model inference" },
        { name: "Scikit-learn", reason: "Fast experimentation and stable classical ML pipeline" },
        { name: "ReportLab", reason: "Programmatic PDF report generation for practical sharing" },
      ],
    },
    architecture: "Input form -> ML inference -> analytics visualization -> generated report",
    documentation: {
      overview: "Heart disease risk prediction system built for applied AI deployment.",
    },
  },
  {
    id: "signlang-ai",
    title: "SignLang AI",
    description: "Real-time sign language gesture translation into text and speech.",
    fullDescription:
      "SignLang AI tracks hand landmarks with MediaPipe and classifies gesture sequences using a PyTorch LSTM model. It is engineered for high frame-rate inference and accessible interaction.",
    image: "https://images.unsplash.com/photo-1520975682031-ae1a6f1d3e2c?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1520975682031-ae1a6f1d3e2c?auto=format&fit=crop&w=1400&q=80"],
    tags: ["Python", "MediaPipe", "PyTorch", "LSTM", "Flask"],
    techStack: ["Python", "MediaPipe", "PyTorch", "LSTM", "Flask", "Hugging Face Spaces"],
    category: "Live Projects",
    featured: true,
    githubUrl: "https://github.com/BhavyaKansal20/SignLang-Al.git",
    liveUrl: "https://kansal0920-signlang-ai.hf.space",
    features: [
      "Live hand landmark detection",
      "Sequence-based sign classification",
      "Text and speech output",
      "Web deployment for accessibility",
    ],
    challenges: [
      "Maintaining stability in real-time sequence capture",
      "Reducing latency while keeping gesture accuracy reliable",
    ],
    metrics: [
      { value: "Live", label: "Deployment", description: "Hosted on Hugging Face Spaces" },
      { value: "Real-time", label: "Inference", description: "Designed for continuous gesture input" },
      { value: "LSTM", label: "Sequence Model", description: "Temporal gesture modeling" },
    ],
    implementation: {
      approach:
        "The pipeline tracks keypoints frame-by-frame, buffers sequences, and classifies them with an LSTM for robust temporal understanding.",
      technologies: [
        { name: "MediaPipe", reason: "Accurate and lightweight hand tracking" },
        { name: "PyTorch", reason: "Flexible sequence-model training and inference" },
        { name: "LSTM", reason: "Effective for temporal gesture patterns" },
      ],
    },
    architecture: "Camera stream -> landmark extraction -> sequence buffer -> LSTM classifier -> output",
    documentation: {
      overview: "Sign language recognition and translation workflow for assistive AI.",
    },
  },
  {
    id: "deepfake-scanner",
    title: "DeepFake Scanner",
    description: "Real-time deepfake detection with confidence scoring and forensic overlays.",
    fullDescription:
      "DeepFake Scanner is an AI-powered media verification system trained with EfficientNet-B4 on DFDC-style data. It classifies media as real or manipulated and presents confidence-driven outputs in an interactive app.",
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1400&q=80"],
    tags: ["Python", "EfficientNet", "PyTorch", "Gradio"],
    techStack: ["Python", "EfficientNet-B4", "PyTorch", "Gradio", "Hugging Face Spaces"],
    category: "Live Projects",
    featured: true,
    githubUrl: "https://github.com/BhavyaKansal20/DeepFake-Detector.git",
    liveUrl: "https://kansal0920-deepfake-scanner.hf.space",
    features: [
      "Real-vs-fake classification",
      "Confidence score visualization",
      "Interactive deployment",
      "Computer vision forensic context",
    ],
    challenges: [
      "Handling varied manipulation patterns and media quality",
      "Keeping false positives low in practical settings",
    ],
    metrics: [
      { value: "Live", label: "Deployment", description: "Hosted on Hugging Face Spaces" },
      { value: "B4", label: "Model Backbone", description: "EfficientNet-B4 fine-tuning" },
      { value: "CV", label: "Domain", description: "Computer vision authenticity checking" },
    ],
    implementation: {
      approach:
        "Fine-tuned deep CNN pipeline with user-facing app for instant authenticity predictions and confidence output.",
      technologies: [
        { name: "EfficientNet-B4", reason: "Strong accuracy-efficiency balance for image classification" },
        { name: "PyTorch", reason: "Training flexibility and deployment-friendly inference" },
        { name: "Gradio", reason: "Rapid interactive interface for model demos" },
      ],
    },
    architecture: "Media input -> preprocessing -> EfficientNet inference -> confidence and label output",
    documentation: {
      overview: "Applied deepfake detection for media authenticity workflows.",
    },
  },
  {
    id: "aagni-assistant",
    title: "AAGNI Assistant",
    description: "Telegram-based NLP assistant for real-time query handling and script automation.",
    fullDescription:
      "AAGNI is an NLP-driven assistant that responds to natural language prompts over Telegram and can trigger backend actions. It is designed for context-aware responses and practical automation support.",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1400&q=80"],
    tags: ["Python", "NLP", "Telegram API", "Automation"],
    techStack: ["Python", "NLP", "Telegram Bot API", "python-telegram-bot"],
    category: "Codes",
    featured: false,
    githubUrl: "https://github.com/BhavyaKansal20/Telegram-Chatbot-",
    features: [
      "Context-aware conversation flow",
      "Real-time command execution",
      "Chat-based automation",
    ],
    challenges: [
      "Managing robust conversational state",
      "Safe execution boundaries for automation commands",
    ],
    metrics: [
      { value: "Telegram", label: "Platform", description: "Assistant interface via bot" },
      { value: "NLP", label: "Core", description: "Natural language query handling" },
    ],
    implementation: {
      approach: "Telegram message processing layer plus NLP intent routing and backend action handlers.",
      technologies: [
        { name: "Telegram Bot API", reason: "Reliable messaging interface for conversational agents" },
        { name: "Python", reason: "Rapid backend scripting and integration" },
      ],
    },
    documentation: { overview: "Telegram automation assistant for applied NLP workflows." },
  },
  {
    id: "immutable-doc-verify",
    title: "Immutable Doc-Verify",
    description: "Document verification workflow combining OCR and cryptographic integrity checks.",
    fullDescription:
      "Immutable Doc-Verify extracts text from documents with OCR, generates secure hashes, and validates records against a tamper-resistant ledger model to protect certificate integrity.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=80"],
    tags: ["Python", "OCR", "Cryptography", "SHA-256"],
    techStack: ["Python", "Tesseract OCR", "Cryptography", "SHA-256"],
    category: "Codes",
    featured: false,
    githubUrl: "https://github.com/BhavyaKansal20/Certificate-Verifier",
    features: [
      "OCR-based content extraction",
      "Hash-based integrity verification",
      "Tamper-checking workflow",
    ],
    challenges: [
      "Handling OCR noise in varied document scans",
      "Designing consistent and explainable verification output",
    ],
    metrics: [
      { value: "SHA-256", label: "Integrity", description: "Cryptographic hash validation" },
      { value: "OCR", label: "Extraction", description: "Text retrieval for certificate checks" },
    ],
    implementation: {
      approach: "Document ingestion pipeline with OCR, hashing, and ledger comparison for trust validation.",
      technologies: [
        { name: "Tesseract OCR", reason: "Reliable extraction from scanned documents" },
        { name: "SHA-256", reason: "Deterministic integrity fingerprinting" },
      ],
    },
    documentation: { overview: "Digital certificate verification pipeline with OCR and cryptographic checks." },
  },
  {
    id: "neurolock-ai",
    title: "NeuroLock AI",
    description: "Facial emotion analytics platform for live tracking, session insights, and PDF reporting.",
    fullDescription:
      "NeuroLock AI is an upgraded real-time facial emotion recognition system built on top of earlier CV work. It combines Flask, WebSockets, and FER-based inference for continuous emotion tracking and reporting.",
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=1400&q=80"],
    tags: ["Flask", "OpenCV", "Socket.IO", "FER", "ReportLab"],
    techStack: ["Flask", "OpenCV", "Socket.IO", "FER", "ReportLab"],
    category: "Codes",
    featured: false,
    githubUrl: "https://github.com/BhavyaKansal20/neurolock-ai-",
    features: ["Live emotion tracking", "Session analytics", "PDF report generation"],
    challenges: ["Maintaining low-latency webcam inference", "Packaging analytics for practical review"],
    metrics: [
      { value: "Live", label: "Tracking", description: "Continuous emotion inference" },
      { value: "PDF", label: "Reporting", description: "Session summary exports" },
    ],
    implementation: {
      approach: "WebSocket-backed Flask application that streams emotion states and aggregates analytics in real time.",
      technologies: [
        { name: "Flask", reason: "Fast web serving and backend orchestration" },
        { name: "Socket.IO", reason: "Reliable real-time browser updates" },
      ],
    },
    documentation: { overview: "Real-time facial emotion analytics and reporting workflow." },
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Repository of machine learning experiments, notebooks, and model-building practice.",
    fullDescription:
      "A curated GitHub repository for machine learning practice, experiments, and reusable notebooks covering supervised learning, evaluation, and iterative model development.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=80"],
    tags: ["Python", "ML", "Notebooks", "Experiments"],
    techStack: ["Python", "Scikit-learn", "Pandas", "Jupyter"],
    category: "ML/Datasets",
    featured: false,
    githubUrl: "https://github.com/BhavyaKansal20/MachineLearning.git",
    features: ["Model experiments", "Notebook-based learning", "Reusable workflow snippets"],
    challenges: ["Organizing repeated experiments", "Keeping notebooks easy to revisit"],
    metrics: [
      { value: "GitHub", label: "Repo", description: "Machine learning practice repository" },
      { value: "ML", label: "Scope", description: "General model building and experimentation" },
    ],
    implementation: {
      approach: "Notebook-driven repository for ML experimentation and concept validation.",
      technologies: [
        { name: "Python", reason: "Primary language for data science and modeling" },
        { name: "Jupyter", reason: "Interactive experimentation and iteration" },
      ],
    },
    documentation: { overview: "Machine learning experiment repository." },
  },
  {
    id: "datasets",
    title: "Datasets",
    description: "Repository of datasets and data resources used across AI and ML work.",
    fullDescription:
      "A clean GitHub repository for managing datasets, collection references, and reusable data sources that support training, testing, and analysis across ML projects.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80"],
    tags: ["Data", "Curation", "Python", "Resources"],
    techStack: ["Python", "CSV/JSON", "Data Curation", "Research"],
    category: "ML/Datasets",
    featured: false,
    githubUrl: "https://github.com/BhavyaKansal20/Datasets.git",
    features: ["Dataset references", "Training data organization", "Reusable data sources"],
    challenges: ["Keeping datasets organized and traceable", "Supporting multiple experiment workflows"],
    metrics: [
      { value: "GitHub", label: "Repo", description: "Dataset management repository" },
      { value: "Data", label: "Focus", description: "Curation and reuse for ML workflows" },
    ],
    implementation: {
      approach: "Repository structure for dataset organization, references, and experiment-ready data assets.",
      technologies: [
        { name: "Python", reason: "Scripts for preprocessing and organization" },
        { name: "Structured files", reason: "Easy reuse across ML projects" },
      ],
    },
    documentation: { overview: "Dataset repository supporting machine learning projects." },
  },
];
