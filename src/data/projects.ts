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
      "Live AI health intelligence platform for heart, diabetes, and brain tumor risk workflows.",
    fullDescription:
      "Healthy AI is a deployable ML product that combines tabular and vision pipelines in one Flask application. It supports heart disease and diabetes risk prediction, brain tumor MRI classification, EDA dashboards, and downloadable PDF reports with secure session-based access.",
    image: "/healthyai.png",
    images: [
      "/healthyai.png",
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1400&q=80",
    ],
    tags: ["Python", "Flask", "Scikit-learn", "PyTorch", "ReportLab"],
    techStack: ["Python", "Flask", "Scikit-learn", "PyTorch", "SQLite", "Matplotlib", "ReportLab"],
    category: "Live Projects",
    featured: true,
    githubUrl: "https://github.com/BhavyaKansal20/healthy-ai.git",
    liveUrl: "https://healthyai-dlog.onrender.com",
    features: [
      "Heart disease prediction with Gradient Boosting",
      "Diabetes risk prediction with high-accuracy ML pipeline",
      "Brain MRI tumor classification with EfficientNet model",
      "EDA charts, report history, and downloadable PDF summaries",
      "Secure login flow and protected dashboard routes",
    ],
    challenges: [
      "Serving both tabular and image inference flows in one production app",
      "Maintaining clear UX for non-technical users in healthcare-like workflows",
      "Keeping deployment stable on Render with compatible ML dependencies",
    ],
    metrics: [
      { value: "Live", label: "Deployment", description: "Hosted on Render" },
      { value: "97.2%", label: "Diabetes Model", description: "Reported project accuracy" },
      { value: "83.7%", label: "Heart Model", description: "Reported project accuracy" },
      { value: "3", label: "Prediction Modules", description: "Heart, Diabetes, Brain MRI" },
    ],
    implementation: {
      approach:
        "Architected as a modular Flask platform with route-level feature separation: prediction APIs, secure report history, and analytics dashboards sharing a consistent inference and storage layer.",
      technologies: [
        { name: "Flask", reason: "Production-friendly routing, templates, and auth flow in a single service" },
        { name: "Scikit-learn", reason: "Reliable tabular ML pipelines for heart and diabetes predictions" },
        { name: "PyTorch", reason: "Brain MRI classification with deep learning model serving" },
        { name: "ReportLab", reason: "Automated medical-style PDF report generation" },
      ],
    },
    architecture: "Client -> Flask auth/routes -> tabular or MRI inference engine -> SQLite/report layer -> dashboard + PDF export",
    documentation: {
      overview: "End-to-end AI health prediction platform built for practical deployment and portfolio-grade product execution.",
    },
  },
  {
    id: "signlang-ai",
    title: "SignLang AI",
    description: "Real-time sign language gesture translation into text and speech.",
    fullDescription:
      "SignLang AI is a real-time Indian Sign Language recognition app that detects hand landmarks with MediaPipe and classifies temporal gesture sequences using a PyTorch LSTM model, then converts output to readable text and speech for accessibility.",
    image: "/signlangai.png",
    images: ["/signlangai.png"],
    tags: ["Python", "MediaPipe", "PyTorch", "LSTM", "Flask"],
    techStack: ["Python", "MediaPipe", "PyTorch", "LSTM", "Flask", "Hugging Face Spaces"],
    category: "Live Projects",
    featured: true,
    githubUrl: "https://github.com/BhavyaKansal20/SignLang-AI.git",
    liveUrl: "https://bhavyakansal20-signlang-ai.hf.space",
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
      { value: "LSTM", label: "Sequence Model", description: "Temporal sign classification" },
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
      "DeepFake Scanner is an AI-powered media authenticity system focused on practical deepfake screening. It uses deep learning backbones to classify manipulated content and surfaces confidence-oriented outputs for faster trust decisions.",
    image: "/deepfakeai.png",
    images: ["/deepfakeai.png"],
    tags: ["Python", "EfficientNet", "PyTorch", "Gradio"],
    techStack: ["Python", "EfficientNet", "PyTorch", "Streamlit", "Hugging Face Spaces"],
    category: "Live Projects",
    featured: true,
    githubUrl: "https://github.com/BhavyaKansal20/DeepFake-Detector.git",
    liveUrl: "https://bhavyakansal20-deepfake-scanner.hf.space",
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
      { value: "CNN", label: "Model Family", description: "Deep learning-based media classification" },
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
    id: "ml-house-price-prediction",
    title: "ML House Price Prediction",
    description: "Streamlit-based regression app for house price prediction using tree models.",
    fullDescription:
      "ML House Price Prediction is a deployable machine learning web app that estimates property prices using Random Forest and Decision Tree regression models. It is built with Streamlit for practical usage, quick experimentation, and accessible model-driven predictions.",
    image: "/homeprediction.png",
    images: ["/homeprediction.png"],
    tags: ["Python", "Streamlit", "Random Forest", "Decision Tree", "Regression"],
    techStack: ["Python", "Scikit-learn", "Streamlit", "Pandas", "Jupyter Notebook"],
    category: "Live Projects",
    featured: true,
    githubUrl: "https://github.com/BhavyaKansal20/ML_HousePricePrediction.git",
    liveUrl: "https://bhavyakansal20-house-price-prediction.hf.space",
    features: [
      "Interactive house price prediction interface",
      "Model comparison across Random Forest and Decision Tree",
      "Fast user input-to-prediction workflow",
      "Live deployment for recruiter-ready demonstration",
    ],
    challenges: [
      "Balancing model explainability with practical prediction quality",
      "Designing simple UX for non-technical users to enter property features",
    ],
    metrics: [
      { value: "Live", label: "Deployment", description: "Hosted on Hugging Face Spaces" },
      { value: "2", label: "Core Models", description: "Random Forest + Decision Tree" },
      { value: "1", label: "Star", description: "GitHub community signal" },
    ],
    implementation: {
      approach:
        "Built as a lightweight Streamlit product with preprocessing + inference layers to support real-time housing price predictions from tabular feature inputs.",
      technologies: [
        { name: "Streamlit", reason: "Fast and clean web app delivery for ML demos" },
        { name: "Scikit-learn", reason: "Reliable regression model training and prediction" },
        { name: "Pandas", reason: "Tabular data preprocessing and feature handling" },
      ],
    },
    architecture: "User input form -> preprocessing -> regression inference -> predicted price output",
    documentation: {
      overview: "Practical ML regression app for house price estimation with a deployable interface.",
    },
  },
  {
    id: "aagni-assistant",
    title: "AAGNI Assistant",
    description: "Telegram-based NLP assistant for real-time query handling and script automation.",
    fullDescription:
      "AAGNI Assistant is a Telegram-based conversational automation bot that handles natural-language inputs, maps them to intents, and executes backend actions for productivity-oriented workflows.",
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1400&q=80"],
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
      { value: "2", label: "Stars", description: "GitHub community signal" },
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
      "Immutable Doc-Verify extracts certificate data with OCR, creates cryptographic integrity fingerprints, and verifies authenticity through deterministic comparison flows to reduce fake document risk.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=80"],
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
      "NeuroLock AI is a real-time emotion analytics system that processes webcam streams, classifies emotional states, and generates session summaries for behavior-aware educational and engagement scenarios.",
    image: "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?auto=format&fit=crop&w=1400&q=80"],
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
      "A curated machine learning lab repository with notebook-driven experimentation, model benchmarking, and beginner-to-intermediate practice flows designed for consistent upskilling and reproducible learning.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80"],
    tags: ["Python", "ML", "Notebooks", "Experiments"],
    techStack: ["Python", "Scikit-learn", "Pandas", "Jupyter"],
    category: "ML/Datasets",
    featured: false,
    githubUrl: "https://github.com/BhavyaKansal20/MachineLearning.git",
    features: ["Model experiments", "Notebook-based learning", "Reusable workflow snippets"],
    challenges: ["Organizing repeated experiments", "Keeping notebooks easy to revisit"],
    metrics: [
      { value: "GitHub", label: "Repo", description: "Machine learning practice repository" },
      { value: "1", label: "Star", description: "Public engagement signal" },
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
      "A structured datasets repository containing curated, original, and refined resources used across multiple AI/ML experiments. It is organized for fast reuse in training, validation, and comparative evaluation workflows.",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1400&q=80"],
    tags: ["Data", "Curation", "Python", "Resources"],
    techStack: ["Python", "CSV/JSON", "Data Curation", "Research"],
    category: "ML/Datasets",
    featured: false,
    githubUrl: "https://github.com/BhavyaKansal20/Datasets.git",
    features: ["Dataset references", "Training data organization", "Reusable data sources"],
    challenges: ["Keeping datasets organized and traceable", "Supporting multiple experiment workflows"],
    metrics: [
      { value: "GitHub", label: "Repo", description: "Dataset management repository" },
      { value: "1", label: "Star", description: "Public engagement signal" },
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
