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
  documentation: Record<string, any>;
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
    id: "chromacrystal-uhd",
    title: "ChromaCrystal UHD",
    description: "Enterprise-grade, memory-optimized AI pipeline for colorizing, enhancing, and upscaling vintage photographs.",
    fullDescription: "ChromaCrystal UHD is an enterprise-grade, memory-optimized AI pipeline that colorizes, enhances, and upscales vintage photographs. Built with an unbreakable Zero-Crash Memory Isolation architecture, it seamlessly orchestrates cascaded AI inferences (DeOldify, GFPGAN, and Real-ESRGAN) on a single machine without RAM exhaustion, supporting FastAPI backends and Dockerized execution.",
    image: "/chromacrystal.png",
    images: ["/chromacrystal.png"],
    tags: ["Python", "PyTorch", "FastAPI", "ONNX", "DeOldify", "Docker"],
    techStack: ["Python", "PyTorch", "FastAPI", "ONNX", "OpenCV", "Gradio", "DeOldify", "GFPGAN", "Real-ESRGAN", "Docker", "Hugging Face Spaces"],
    category: "Live Projects",
    featured: true,
    githubUrl: "https://github.com/BhavyaKansal20/ChromaCrystal_UHD.git",
    liveUrl: "https://bhavyakansal20-chromacrystal-uhd.hf.space",
    features: [
      "Colorizes vintage black and white photographs using DeOldify",
      "Restores and enhances facial details using GFPGAN",
      "Super-resolves and upscales images with Real-ESRGAN",
      "Zero-Crash Memory Isolation architecture for cascaded model flows",
      "FastAPI backend with Gradio UI layer for rapid serving",
    ],
    challenges: [
      "Orchestrating multiple heavy PyTorch models sequentially on limited RAM",
      "Preventing out-of-memory crashes during high-resolution upscaling",
    ],
    metrics: [
      { value: "Live", label: "Deployment", description: "Hosted on Hugging Face Spaces" },
      { value: "3", label: "Core AI Models", description: "DeOldify + GFPGAN + Real-ESRGAN" },
      { value: "Docker", label: "Runtime Environment", description: "Containerized deployment" },
    ],
    implementation: {
      approach: "Built as a modular cascaded pipeline in Docker. Implements memory isolation boundaries to process each restoration stage independently, releasing GPU/RAM handles sequentially.",
      technologies: [
        { name: "PyTorch", reason: "Core deep learning engine for the restoration networks" },
        { name: "FastAPI", reason: "High-performance backend API serving the pipeline" },
        { name: "ONNX", reason: "Model inference acceleration and portability" },
      ],
    },
    architecture: "Input Image -> DeOldify (Color) -> GFPGAN (Face) -> Real-ESRGAN (Upscale) -> Output Image",
    documentation: {
      overview: "Memory-optimized production pipeline for vintage photo restoration.",
    },
  },
  {
    id: "deepfake-scanner",
    title: "DeepFake Scanner",
    description: "Real-time deepfake detection platform for images, videos, and cloned voices.",
    fullDescription: "DeepFake Scanner is a real-time, multi-modal AI media authenticity platform. It features deep learning sub-systems to classify manipulated content: an EfficientNet-B0 face-swap detector (95.8% accuracy), a GAN-image detector (98.1% AUC-ROC), and a voice clone classifier (99.6% accuracy) served via a high-throughput FastAPI REST backend and a Streamlit dashboard.",
    image: "/deepfakeai.png",
    images: ["/deepfakeai.png"],
    tags: ["Python", "PyTorch", "FastAPI", "Streamlit", "EfficientNet", "AudioMLP"],
    techStack: ["Python", "PyTorch", "FastAPI", "Streamlit", "EfficientNet", "AudioMLP", "Spectral Analysis", "Docker", "Hugging Face Spaces"],
    category: "Live Projects",
    featured: true,
    githubUrl: "https://github.com/BhavyaKansal20/DeepFake-Detector.git",
    liveUrl: "https://bhavyakansal20-deepfake-scanner.hf.space",
    features: [
      "95.8% Accurate Face-Swap Detection trained on FaceForensics++",
      "98.1% AUC-ROC GAN-based synthetic image detection on CIFAKE",
      "99.6% Accurate Voice Clone Detection trained on WaveFake",
      "Under 200ms latency inference with Apple Silicon MPS acceleration",
      "Interactive Streamlit interface and Swagger-documented FastAPI backend",
    ],
    challenges: [
      "Handling different compression levels and media formats in real-time pipelines",
      "Minimizing latency while combining visual and audio classification models",
    ],
    metrics: [
      { value: "95.8%", label: "Face-Swap Acc", description: "Trained on FaceForensics++" },
      { value: "98.1%", label: "GAN Image AUC", description: "Evaluated on CIFAKE" },
      { value: "99.6%", label: "Voice Clone Acc", description: "Evaluated on WaveFake" },
      { value: "<200ms", label: "Inference Latency", description: "High-speed API delivery" },
    ],
    implementation: {
      approach: "Designed as a dual-backend architecture. Streamlit serves the user interface, routing media files to a FastAPI service which runs EfficientNet-B0 and Spectral Audio MLP classifiers.",
      technologies: [
        { name: "EfficientNet", reason: "Excellent parameter-to-accuracy ratio for spatial spoofing detection" },
        { name: "FastAPI", reason: "Asynchronous backend for routing parallel media inference jobs" },
        { name: "PyTorch", reason: "Primary model development and tensor acceleration framework" },
      ],
    },
    architecture: "Media Ingest -> Feature Extractor -> (EfficientNet / AudioMLP) -> Fusion Layer -> Auth Output",
    documentation: {
      overview: "Production-grade multi-modal deepfake detection service.",
    },
  },
  {
    id: "signlang-ai",
    title: "SignLang AI",
    description: "Real-time Indian Sign Language (ISL) recognition and bilingual translation system.",
    fullDescription: "SignLang AI is an accessibility platform translating Indian Sign Language (ISL) gestures in real-time. It tracks hand landmarks (21 points per hand) using MediaPipe, processes temporal sequences through a 3-layer PyTorch LSTM model (99.9% validation accuracy), and converts them to bilingual text and speech (English + Hindi) with auto-grammar fixing.",
    image: "/signlangai.png",
    images: ["/signlangai.png"],
    tags: ["Python", "Flask", "PyTorch", "LSTM", "MediaPipe", "gTTS"],
    techStack: ["Python", "Flask", "PyTorch", "LSTM", "MediaPipe", "OpenCV", "gTTS", "Docker", "Hugging Face Spaces"],
    category: "Live Projects",
    featured: true,
    githubUrl: "https://github.com/BhavyaKansal20/SignLang-AI.git",
    liveUrl: "https://bhavyakansal20-signlang-ai.hf.space",
    features: [
      "Dual-hand skeletons and 21 landmark MediaPipe tracking",
      "3-layer PyTorch LSTM model with 99.9% validation accuracy",
      "Bilingual English/Hindi speech generation via gTTS engine",
      "Rule-based NLP sentence builder with automated grammar fixing",
      "Interactive dictionary drawer supporting 35 common ISL signs",
    ],
    challenges: [
      "Ensuring smooth real-time landmark extraction across varied lighting conditions",
      "Reducing sequence classification latency to maintain natural conversation pacing",
    ],
    metrics: [
      { value: "99.9%", label: "LSTM Val Acc", description: "Tested on 42,000+ gesture samples" },
      { value: "35", label: "ISL Signs", description: "Common interactive sign dictionary" },
      { value: "Bilingual", label: "Speech Engine", description: "Bilingual English + Hindi output" },
    ],
    implementation: {
      approach: "Sequence-to-sequence landmark buffering pipeline. Captures webcam landmarks, accumulates temporal buffers, and feeds them into an LSTM network integrated with gTTS and a Flask wrapper.",
      technologies: [
        { name: "MediaPipe", reason: "Lightweight, robust hand skeleton extraction directly from frames" },
        { name: "PyTorch LSTM", reason: "Captures temporal sequence dynamics of hand movements" },
        { name: "gTTS", reason: "Dynamic text-to-speech audio generation" },
      ],
    },
    architecture: "Webcam -> MediaPipe -> Keypoint Vector -> LSTM -> Text Translation -> NLP Grammar -> gTTS Audio",
    documentation: {
      overview: "Real-time temporal gesture translation system for accessibility.",
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
    id: "retinex-ai",
    title: "RetiNex AI",
    description: "Deep learning medical imaging pipeline with GradCAM explainability for Diabetic Retinopathy.",
    fullDescription: "RetiNex AI is a production-ready medical computer vision platform that detects Diabetic Retinopathy from retinal scans. It bridges the gap between raw TensorFlow models and clinical trust by integrating Explainable AI (XAI) via GradCAM heatmaps, highlighting the exact microaneurysms and hemorrhages driving its predictions.",
    image: "/retinex.png",
    images: ["/retinex.png"],
    tags: ["TensorFlow", "FastAPI", "React", "Explainable AI", "Computer Vision"],
    techStack: ["TensorFlow", "Keras", "OpenCV", "FastAPI", "React", "TailwindCSS", "Google Sheets API", "ReportLab"],
    category: "Live Projects",
    featured: true,
    githubUrl: "https://github.com/BhavyaKansal20/RetiNex_AI.git",
    features: [
      "Diabetic Retinopathy severity classification",
      "GradCAM explainability heatmaps",
      "Severity-Aware Focal Loss for extreme class imbalance",
      "FastAPI inference backend with test-time augmentation",
      "Interactive analytics dashboard and automated PDF reports",
    ],
    challenges: [
      "Balancing high accuracy with medical explainability",
      "Handling extreme class imbalance in the APTOS dataset",
      "Orchestrating complex CV pipelines (CLAHE preprocessing + GradCAM) efficiently",
    ],
    metrics: [
      { value: "77.2%", label: "Accuracy", description: "APTOS validation split" },
      { value: "0.65", label: "Macro F1", description: "Handling severe class imbalance" },
      { value: "1.2s", label: "Inference", description: "End-to-end including GradCAM" },
    ],
    implementation: {
      approach: "End-to-end clinical AI stack with a tf.data optimized EfficientNet pipeline, a fully asynchronous FastAPI inference service, and a React/Tailwind SPA with Chart.js analytics.",
      technologies: [
        { name: "TensorFlow", reason: "Core deep learning and dataset pipeline" },
        { name: "FastAPI", reason: "Asynchronous API serving for heavy ML models" },
        { name: "React", reason: "Modern, responsive clinician dashboard interface" },
      ],
    },
    architecture: "Retinal Image -> CLAHE Preprocessor -> EfficientNet -> GradCAM Extractor -> FastAPI -> React Dashboard",
    documentation: {
      overview: "Explainable deep learning pipeline for Diabetic Retinopathy detection.",
    },
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Repository of machine learning experiments, notebooks, and model-building practice.",
    fullDescription:
      "A curated machine learning lab repository with notebook-driven experimentation, model benchmarking, and beginner-to-intermediate practice flows designed for consistent upskilling and reproducible learning.",
    image: "/ml.png",
    images: ["/ml.png"],
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
    id: "deep-learning",
    title: "Deep Learning",
    description: "Structured deep learning notebook repository from fundamentals to advanced architectures.",
    fullDescription:
      "Deep Learning is a continuously updated, notebook-first repository covering end-to-end deep learning foundations and practice. It includes ANN, CNN, RNN, LSTM, preprocessing, model evaluation, and optimization workflows with beginner-friendly yet production-aware explanations.",
    image: "/deeplearning.png",
    images: ["/deeplearning.png"],
    tags: ["Python", "TensorFlow", "Keras", "Jupyter", "Deep Learning"],
    techStack: ["Python", "TensorFlow", "Keras", "NumPy", "Pandas", "Scikit-learn", "Jupyter"],
    category: "ML/Datasets",
    featured: false,
    githubUrl: "https://github.com/BhavyaKansal20/DeepLearning.git",
    features: [
      "Structured notebook index across core DL domains",
      "ANN, CNN, RNN, and sequence-model learning tracks",
      "Data preprocessing, feature engineering, and optimization modules",
      "Beginner-to-advanced educational progression with practical code",
    ],
    challenges: [
      "Maintaining consistent structure and clarity across many deep learning topics",
      "Balancing conceptual explanations with implementation-first notebooks",
    ],
    metrics: [
      { value: "1", label: "Star", description: "Public engagement signal" },
      { value: "Jupyter", label: "Primary Language", description: "Notebook-first repository" },
      { value: "MIT", label: "License", description: "Open source educational repository" },
    ],
    implementation: {
      approach:
        "Designed as a modular deep learning knowledge base, organized by topic progression: preprocessing, neural fundamentals, sequence models, CNNs, and model optimization.",
      technologies: [
        { name: "TensorFlow", reason: "Core framework for deep learning modeling and experimentation" },
        { name: "Keras", reason: "Simplified high-level API for neural network prototyping" },
        { name: "Jupyter", reason: "Interactive notebook workflow for concept-to-code learning" },
      ],
    },
    architecture: "Notebook modules -> data preparation -> model building -> evaluation and tuning -> reusable DL references",
    documentation: {
      overview: "Production-grade deep learning knowledge repository with structured notebooks and practical implementation tracks.",
    },
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
  {
    id: "aagni-assistant",
    title: "AAGNI Assistant",
    description: "Bilingual Telegram-based AI assistant powered by GPT-3.5 Turbo and Text-to-Speech.",
    fullDescription: "AAGNI is a voice-enabled conversational AI chatbot on Telegram, built like an interactive personal assistant. It routes queries to OpenRouter (GPT-3.5 Turbo), generates instant text replies, and converts responses to speech dynamically using gTTS and pygame audio playback.",
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1400&q=80"],
    tags: ["Python", "OpenRouter", "gTTS", "Telegram Bot"],
    techStack: ["Python", "python-telegram-bot", "OpenRouter API", "gTTS", "pygame", "Requests", "dotenv"],
    category: "Codes",
    featured: false,
    githubUrl: "https://github.com/BhavyaKansal20/Telegram-Chatbot-",
    features: [
      "Jarvis-like conversational chatbot interface",
      "Dynamic Text-to-Speech (TTS) audio generation",
      "Robust API orchestration via OpenRouter",
    ],
    challenges: [
      "Managing robust conversational state over Telegram polling sessions",
      "Configuring local pygame voice playback streams synchronously",
    ],
    metrics: [
      { value: "Telegram", label: "Platform", description: "Assistant interface via bot" },
      { value: "2", label: "Stars", description: "GitHub community signal" },
    ],
    implementation: {
      approach: "Telegram polling handler integrated with an OpenRouter post-request layer, followed by a thread-safe gTTS speech compiler and local audio playback loops.",
      technologies: [
        { name: "python-telegram-bot", reason: "Active wrapper for Telegram APIs" },
        { name: "OpenRouter", reason: "Bypasses strict single-API restrictions for models like GPT-3.5" },
        { name: "gTTS", reason: "Simple and robust offline Text-to-Speech engine" },
      ],
    },
    documentation: { overview: "Telegram automation assistant for applied NLP and speech generation." },
  },
  {
    id: "immutable-doc-verify",
    title: "Certificate Verifier",
    description: "Authenticity verification system combining Tesseract OCR, SHA-256 hashing, and SQLite ledger.",
    fullDescription: "Certificate Verifier is an API-driven verification system. It extracts certificate details (Name, Course, Registration No.) using Tesseract OCR and OpenCV, computes a cryptographic SHA-256 hash representation, and verifies its authenticity against an immutable local database ledger representing a local blockchain. It also generates a verification QR code for secure validation.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=80"],
    tags: ["FastAPI", "OCR", "Cryptography", "SQLite"],
    techStack: ["Python", "FastAPI", "Tesseract OCR", "OpenCV", "QR Code", "SQLite", "HTML5", "CSS3", "JavaScript"],
    category: "Codes",
    featured: false,
    githubUrl: "https://github.com/BhavyaKansal20/Certificate-Verifier",
    features: [
      "Intelligent OCR-based document feature extraction",
      "Deterministic SHA-256 cryptographic document hashing",
      "Immutable SQLite verification ledger (Local Blockchain)",
      "Verification QR code generation & scanning with pyzbar",
    ],
    challenges: [
      "Handling OCR character noise on highly stylized certificate backgrounds",
      "Designing clean secure client forms that interface with Python API endpoints",
    ],
    metrics: [
      { value: "SHA-256", label: "Integrity", description: "Cryptographic hash validation" },
      { value: "OCR", label: "Extraction", description: "Text retrieval for certificate checks" },
    ],
    implementation: {
      approach: "Asynchronous FastAPI backend coupled with sqlite3 query operations. Extracts certificate layout data via pytesseract, hashes it, checks registration indices, and renders authenticity states.",
      technologies: [
        { name: "FastAPI", reason: "Rapid async API delivery for document processing" },
        { name: "Tesseract OCR", reason: "Intelligent layout-aware text extraction" },
        { name: "SQLite", reason: "Stores immutable transaction-style verification index" },
      ],
    },
    documentation: { overview: "Digital certificate verification pipeline with OCR and cryptographic checks." },
  },
  {
    id: "neurolock-ai",
    title: "NeuroLock AI v2",
    description: "Real-time facial recognition and emotion analytics platform utilizing DNN ResNet-10 SSD and CNN ensembles.",
    fullDescription: "NeuroLock AI v2 is a classroom-grade emotion intelligence system. It captures webcam/IP-camera streams, performs facial detection with ResNet-10 SSD, extracts facial features for recognition via dlib HOG, classifies emotions using an ensemble CNN with Test-Time Augmentation (70%+ accuracy), and streams analytics to a Socket.IO dashboard with downloadable PDF session reports.",
    image: "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?auto=format&fit=crop&w=1400&q=80",
    images: ["https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?auto=format&fit=crop&w=1400&q=80"],
    tags: ["Flask", "OpenCV", "Socket.IO", "PyTorch", "dlib HOG"],
    techStack: ["Python", "Flask", "Flask-SocketIO", "PyTorch", "OpenCV", "dlib HOG", "SQLite", "ReportLab", "Docker"],
    category: "Codes",
    featured: false,
    githubUrl: "https://github.com/BhavyaKansal20/neurolock-ai-",
    features: [
      "Accurate face detection with ResNet-10 SSD DNN",
      "Classroom Mode supporting multi-student tracking",
      "Bespoke ensemble CNN emotion model (70%+ accuracy)",
      "Real-time streaming via WebSocket (Socket.IO)",
      "Per-student PDF analytics report generation",
      "Grad-CAM network attention heatmap overlay",
    ],
    challenges: [
      "Ensuring low-latency frame classification over web sockets during concurrent student streams",
      "Configuring dlib compilation and face landmarks tracking inside Docker",
    ],
    metrics: [
      { value: "70%+", label: "Emotion Acc", description: "Ensemble CNN model + TTA" },
      { value: "DNN", label: "Face Detector", description: "ResNet-10 SSD architecture" },
      { value: "dlib HOG", label: "Face Recog", description: "Multi-student identifier" },
    ],
    implementation: {
      approach: "WebSocket-backed Flask service hosting PyTorch CNN classification loops. Captures real-time frames via socket connections, detects faces using ResNet-10, runs HOG recognition, evaluates expressions, and pushes analytics back to clients.",
      technologies: [
        { name: "Flask-SocketIO", reason: "Asynchronous WebSocket transport for streaming image frames" },
        { name: "PyTorch", reason: "Host model architectures for expression classification" },
        { name: "OpenCV DNN", reason: "ResNet-based face detector yielding higher stability than Haar Cascades" },
      ],
    },
    documentation: { overview: "Real-time facial emotion analytics, recognition, and reporting workflow." },
  }
];
