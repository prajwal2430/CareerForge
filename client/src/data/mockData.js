export const MOCK_DATA = {
  user: {
    streak: 12,
    dsaProgress: 45,
    courseProgress: 60,
    mockScore: 8,
    resumeScore: 85,
    rank: 12450
  },
  problems: {
    easy: { solved: 45, total: 100 },
    medium: { solved: 20, total: 200 },
    hard: { solved: 5, total: 150 }
  },
  weeklyActivity: [
    { day: 'Mon', hours: 2, problems: 3 },
    { day: 'Tue', hours: 3, problems: 5 },
    { day: 'Wed', hours: 1, problems: 1 },
    { day: 'Thu', hours: 4, problems: 7 },
    { day: 'Fri', hours: 2, problems: 2 },
    { day: 'Sat', hours: 5, problems: 10 },
    { day: 'Sun', hours: 6, problems: 12 },
  ],
  tasks: [
    { id: 1, title: 'Solve 2 DSA Questions', completed: true, points: 20 },
    { id: 2, title: 'Complete React Context Lecture', completed: false, points: 30 },
    { id: 3, title: 'Take Weekly Mock Assessment', completed: false, points: 50 },
  ],
  courses: [
    { id: 1, title: 'Complete DSA for Placements', instructor: 'Striver', rating: 4.9, students: '120k', duration: '50h', image: 'dsa-thumb', category: 'DSA', progress: 45 },
    { id: 2, title: 'MERN Stack Masterclass', instructor: 'Hitesh C', rating: 4.8, students: '85k', duration: '60h', image: 'mern-thumb', category: 'Web Dev', progress: 10 },
    { id: 3, title: 'System Design Interview', instructor: 'Gaurav Sen', rating: 4.9, students: '50k', duration: '20h', image: 'sd-thumb', category: 'System Design', progress: 0 },
<<<<<<< Updated upstream
    { id: 4, title: 'Quantitative Aptitude & Logical Reasoning', instructor: 'CareerRide', rating: 4.9, students: '150k', duration: '40h', image: 'apti-thumb', category: 'Aptitude', progress: 0, youtubeId: 'euz9GWR3ITY' },
=======
    { id: 4, title: 'AI & Machine Learning Foundations', instructor: 'Andrew Ng', rating: 4.9, students: '95k', duration: '40h', image: 'ml-thumb', category: 'AI/ML', progress: 20 },
    { id: 5, title: 'DevOps & Cloud Engineering Bootcamp', instructor: 'Mumshad M', rating: 4.8, students: '70k', duration: '35h', image: 'devops-thumb', category: 'DevOps', progress: 5 }
>>>>>>> Stashed changes
  ],
  companies: [
    { id: 'google', name: 'Google', logo: 'google-logo', difficulty: 'Hard', roles: ['SWE', 'SRE'], package: '30-40 LPA' },
    { id: 'amazon', name: 'Amazon', logo: 'amazon-logo', difficulty: 'Medium', roles: ['SDE-1', 'AWS'], package: '25-45 LPA' },
    { id: 'microsoft', name: 'Microsoft', logo: 'microsoft-logo', difficulty: 'Medium', roles: ['SDE', 'PM'], package: '40-50 LPA' },
  ],
  roadmaps: [
    { id: 'java', title: 'Java Backend Developer', duration: '6 Months', steps: 15, progress: 40 },
    { id: 'mern', title: 'MERN Stack Developer', duration: '4 Months', steps: 12, progress: 10 },
    { id: 'data', title: 'Data Scientist', duration: '8 Months', steps: 20, progress: 0 },
  ],
  roadmapDetails: {
    java: {
      id: 'java',
      title: 'Java Backend Developer',
      description: 'A comprehensive path to becoming a job-ready Java Backend Developer. Master core Java, Spring Boot, databases, microservices, and cloud deployment.',
      duration: '6 Months',
      totalModules: 15,
      linkedCourseId: 1,
      color: '#FF6B00',
      emoji: '☕',
      phases: [
        {
          id: 1,
          phase: 'Phase 1: Core Java Mastery',
          duration: '4 weeks',
          completed: true,
          modules: [
            { id: 1, title: 'Java Fundamentals & OOP', topics: ['Variables & Data Types', 'Classes & Objects', 'Inheritance & Polymorphism', 'Interfaces & Abstraction'], completed: true, duration: '1 week', courseId: 1, type: 'video' },
            { id: 2, title: 'Collections Framework', topics: ['ArrayList, LinkedList', 'HashMap & HashSet', 'TreeMap & PriorityQueue', 'Iterators & Comparators'], completed: true, duration: '1 week', courseId: 1, type: 'video' },
            { id: 3, title: 'Exception Handling & File I/O', topics: ['Try-Catch-Finally', 'Custom Exceptions', 'File Reading/Writing', 'Serialization'], completed: true, duration: '3 days', courseId: 1, type: 'video' },
            { id: 4, title: 'Multithreading & Concurrency', topics: ['Threads & Runnable', 'Synchronized blocks', 'ExecutorService', 'CompletableFuture'], completed: true, duration: '1 week', courseId: 1, type: 'assignment' }
          ]
        },
        {
          id: 2,
          phase: 'Phase 2: Data Structures & Algorithms',
          duration: '6 weeks',
          completed: true,
          modules: [
            { id: 5, title: 'Arrays, Strings & Sorting', topics: ['Two Pointers', 'Sliding Window', 'Binary Search', 'Merge Sort & QuickSort'], completed: true, duration: '2 weeks', courseId: 1, type: 'video' },
            { id: 6, title: 'Linked Lists, Stacks & Queues', topics: ['Singly & Doubly Linked Lists', 'Stack using Arrays', 'Queue using LinkedList', 'Monotonic Stack'], completed: true, duration: '1.5 weeks', courseId: 1, type: 'video' },
            { id: 7, title: 'Trees & Graphs', topics: ['Binary Trees & BST', 'BFS & DFS Traversal', 'Shortest Path (Dijkstra)', 'Union-Find'], completed: false, duration: '2 weeks', courseId: 1, type: 'assignment' },
            { id: 8, title: 'Dynamic Programming', topics: ['Memoization vs Tabulation', '0/1 Knapsack', 'Longest Common Subsequence', 'Matrix Chain Multiplication'], completed: false, duration: '2 weeks', courseId: 1, type: 'quiz' }
          ]
        },
        {
          id: 3,
          phase: 'Phase 3: Spring Boot & REST APIs',
          duration: '4 weeks',
          completed: false,
          modules: [
            { id: 9, title: 'Spring Core & Dependency Injection', topics: ['IoC Container', 'Beans & Annotations', '@Autowired & @Component', 'Spring Profiles'], completed: false, duration: '1 week', courseId: 1, type: 'video' },
            { id: 10, title: 'Spring Boot REST API Development', topics: ['@RestController & @RequestMapping', 'Request Validation', 'Error Handling with @ControllerAdvice', 'API Documentation with Swagger'], completed: false, duration: '2 weeks', courseId: 1, type: 'assignment' },
            { id: 11, title: 'Spring Security & JWT', topics: ['Authentication vs Authorization', 'JWT Token Generation', 'Spring Security Filter Chain', 'OAuth2 Basics'], completed: false, duration: '1 week', courseId: 1, type: 'video' }
          ]
        },
        {
          id: 4,
          phase: 'Phase 4: Databases & Persistence',
          duration: '3 weeks',
          completed: false,
          modules: [
            { id: 12, title: 'SQL & Relational Databases', topics: ['Joins & Subqueries', 'Indexing & Query Optimization', 'Transactions & ACID', 'PostgreSQL Setup'], completed: false, duration: '1.5 weeks', courseId: 3, type: 'video' },
            { id: 13, title: 'Spring Data JPA & Hibernate', topics: ['Entity Mapping', 'Relationships (OneToMany, ManyToMany)', 'JPQL Queries', 'Pagination & Sorting'], completed: false, duration: '1.5 weeks', courseId: 1, type: 'assignment' }
          ]
        },
        {
          id: 5,
          phase: 'Phase 5: Microservices & Deployment',
          duration: '7 weeks',
          completed: false,
          modules: [
            { id: 14, title: 'Microservices Architecture', topics: ['Service Discovery (Eureka)', 'API Gateway (Spring Cloud)', 'Inter-service Communication', 'Circuit Breaker (Resilience4j)'], completed: false, duration: '2 weeks', courseId: 3, type: 'video' },
            { id: 15, title: 'Containerization & Cloud Deployment', topics: ['Docker & Dockerfile', 'Docker Compose', 'CI/CD with GitHub Actions', 'AWS EC2 / Railway Deployment'], completed: false, duration: '2 weeks', courseId: 5, type: 'assignment' }
          ]
        }
      ]
    },
    mern: {
      id: 'mern',
      title: 'MERN Stack Developer',
      description: 'Go from zero to full-stack hero. Build production-ready web applications using MongoDB, Express, React, and Node.js.',
      duration: '4 Months',
      totalModules: 12,
      linkedCourseId: 2,
      color: '#61DAFB',
      emoji: '⚛️',
      phases: [
        {
          id: 1,
          phase: 'Phase 1: Frontend with React',
          duration: '3 weeks',
          completed: true,
          modules: [
            { id: 1, title: 'JavaScript ES6+ Essentials', topics: ['Arrow Functions & Destructuring', 'Promises & Async/Await', 'Array Methods (map, filter, reduce)', 'ES Modules & Spread Operator'], completed: true, duration: '1 week', courseId: 2, type: 'video' },
            { id: 2, title: 'React Hooks & Component Architecture', topics: ['useState & useEffect', 'useContext & useReducer', 'Custom Hooks', 'Component Composition'], completed: false, duration: '2 weeks', courseId: 2, type: 'video' }
          ]
        },
        {
          id: 2,
          phase: 'Phase 2: State Management & Routing',
          duration: '2 weeks',
          completed: false,
          modules: [
            { id: 3, title: 'React Router v7', topics: ['Client-side Routing', 'Dynamic Routes & Params', 'Nested Routes & Layouts', 'Protected Routes'], completed: false, duration: '1 week', courseId: 2, type: 'video' },
            { id: 4, title: 'Redux Toolkit & Global State', topics: ['Store, Slices & Actions', 'createAsyncThunk', 'RTK Query', 'Redux DevTools'], completed: false, duration: '1 week', courseId: 2, type: 'assignment' }
          ]
        },
        {
          id: 3,
          phase: 'Phase 3: Backend with Node.js & Express',
          duration: '4 weeks',
          completed: false,
          modules: [
            { id: 5, title: 'Node.js Core Concepts', topics: ['Event Loop & Non-blocking I/O', 'Modules & NPM', 'Streams & Buffers', 'Worker Threads'], completed: false, duration: '1 week', courseId: 2, type: 'video' },
            { id: 6, title: 'RESTful API with Express', topics: ['Routing & Middleware', 'CORS & Body Parser', 'Error Handling', 'Rate Limiting'], completed: false, duration: '1.5 weeks', courseId: 2, type: 'video' },
            { id: 7, title: 'Authentication — JWT & Sessions', topics: ['JWT Access & Refresh Tokens', 'Bcrypt Password Hashing', 'HTTP-only Cookies', 'Google OAuth2'], completed: false, duration: '1.5 weeks', courseId: 2, type: 'assignment' }
          ]
        },
        {
          id: 4,
          phase: 'Phase 4: MongoDB & Database Design',
          duration: '3 weeks',
          completed: false,
          modules: [
            { id: 8, title: 'MongoDB & Mongoose', topics: ['Schemas & Models', 'CRUD Operations', 'Aggregation Pipeline', 'Indexing'], completed: false, duration: '1.5 weeks', courseId: 2, type: 'video' },
            { id: 9, title: 'Database Relationships & Optimization', topics: ['Embedded vs Referenced Documents', 'Population & Virtuals', 'Query Optimization', 'MongoDB Atlas Setup'], completed: false, duration: '1.5 weeks', courseId: 2, type: 'reading' }
          ]
        },
        {
          id: 5,
          phase: 'Phase 5: Full-Stack Integration & Deployment',
          duration: '4 weeks',
          completed: false,
          modules: [
            { id: 10, title: 'File Uploads & Real-time with Socket.io', topics: ['Multer for File Uploads', 'Cloudinary Integration', 'WebSocket Basics', 'Real-time Chat Implementation'], completed: false, duration: '2 weeks', courseId: 2, type: 'assignment' },
            { id: 11, title: 'Testing & Code Quality', topics: ['Unit Testing with Jest', 'API Testing with Supertest', 'React Testing Library', 'ESLint & Prettier'], completed: false, duration: '1 week', courseId: 2, type: 'quiz' },
            { id: 12, title: 'Deployment to Production', topics: ['Vercel for React Frontend', 'Render for Node.js Backend', 'Environment Variables', 'CI/CD with GitHub Actions'], completed: false, duration: '1 week', courseId: 2, type: 'assignment' }
          ]
        }
      ]
    },
    data: {
      id: 'data',
      title: 'Data Scientist',
      description: 'Master data science from Python fundamentals to machine learning model deployment. Become industry-ready with real-world projects and interview prep.',
      duration: '8 Months',
      totalModules: 20,
      linkedCourseId: 4,
      color: '#10B981',
      emoji: '📊',
      phases: [
        {
          id: 1,
          phase: 'Phase 1: Python & Math Foundations',
          duration: '4 weeks',
          completed: false,
          modules: [
            { id: 1, title: 'Python for Data Science', topics: ['NumPy Arrays & Vectorization', 'Pandas DataFrames', 'Data Cleaning & Preprocessing', 'Matplotlib & Seaborn'], completed: false, duration: '2 weeks', courseId: 4, type: 'video' },
            { id: 2, title: 'Statistics & Probability', topics: ['Descriptive Statistics', 'Probability Distributions', 'Hypothesis Testing', 'Bayesian Thinking'], completed: false, duration: '1 week', courseId: 4, type: 'reading' },
            { id: 3, title: 'Linear Algebra & Calculus', topics: ['Vectors & Matrix Operations', 'Eigenvalues & Eigenvectors', 'Gradients & Derivatives', 'Chain Rule & Backpropagation'], completed: false, duration: '1 week', courseId: 4, type: 'reading' }
          ]
        },
        {
          id: 2,
          phase: 'Phase 2: Machine Learning Core',
          duration: '6 weeks',
          completed: false,
          modules: [
            { id: 4, title: 'Supervised Learning Algorithms', topics: ['Linear & Logistic Regression', 'Decision Trees & Random Forest', 'SVM & KNN', 'Gradient Boosting (XGBoost)'], completed: false, duration: '2 weeks', courseId: 4, type: 'video' },
            { id: 5, title: 'Unsupervised Learning', topics: ['K-Means Clustering', 'PCA Dimensionality Reduction', 'DBSCAN', 'Anomaly Detection'], completed: false, duration: '1.5 weeks', courseId: 4, type: 'video' },
            { id: 6, title: 'Model Evaluation & Feature Engineering', topics: ['Cross-Validation', 'Precision, Recall, F1', 'Feature Selection Methods', 'Handling Imbalanced Data'], completed: false, duration: '1.5 weeks', courseId: 4, type: 'assignment' },
            { id: 7, title: 'scikit-learn Mastery', topics: ['Pipelines & ColumnTransformer', 'GridSearchCV & RandomizedSearch', 'Ensemble Methods', 'Saving & Loading Models'], completed: false, duration: '1 week', courseId: 4, type: 'assignment' }
          ]
        },
        {
          id: 3,
          phase: 'Phase 3: Deep Learning & Neural Networks',
          duration: '6 weeks',
          completed: false,
          modules: [
            { id: 8, title: 'Deep Learning Fundamentals', topics: ['Neural Network Architecture', 'Activation Functions', 'Forward & Backpropagation', 'Loss Functions & Optimizers'], completed: false, duration: '2 weeks', courseId: 4, type: 'video' },
            { id: 9, title: 'Convolutional Neural Networks (CNNs)', topics: ['Conv2D & Pooling Layers', 'Transfer Learning (ResNet, VGG)', 'Image Classification Project', 'Object Detection Basics'], completed: false, duration: '2 weeks', courseId: 4, type: 'assignment' },
            { id: 10, title: 'Recurrent Networks & Transformers', topics: ['LSTM & GRU for Sequences', 'Attention Mechanism', 'BERT & GPT Fundamentals', 'Fine-tuning Pretrained Models'], completed: false, duration: '2 weeks', courseId: 4, type: 'video' }
          ]
        },
        {
          id: 4,
          phase: 'Phase 4: Specializations',
          duration: '8 weeks',
          completed: false,
          modules: [
            { id: 11, title: 'Natural Language Processing (NLP)', topics: ['Text Preprocessing & Tokenization', 'TF-IDF & Word2Vec', 'Sentiment Analysis', 'Named Entity Recognition'], completed: false, duration: '2 weeks', courseId: 4, type: 'video' },
            { id: 12, title: 'Computer Vision Projects', topics: ['Face Detection with OpenCV', 'Image Segmentation', 'GANs Basics', 'Real-time Object Detection (YOLO)'], completed: false, duration: '2 weeks', courseId: 4, type: 'assignment' },
            { id: 13, title: 'Time Series Analysis', topics: ['ARIMA & SARIMA Models', 'Prophet by Meta', 'LSTM for Time Series', 'Stock Price Prediction'], completed: false, duration: '2 weeks', courseId: 4, type: 'video' },
            { id: 14, title: 'Recommender Systems', topics: ['Collaborative Filtering', 'Content-based Filtering', 'Matrix Factorization', 'Building Netflix-style Recommendations'], completed: false, duration: '2 weeks', courseId: 4, type: 'assignment' }
          ]
        },
        {
          id: 5,
          phase: 'Phase 5: MLOps & Deployment',
          duration: '4 weeks',
          completed: false,
          modules: [
            { id: 15, title: 'SQL for Data Analysis', topics: ['Window Functions', 'CTEs & Subqueries', 'Data Aggregation', 'BI Tools (Tableau/Power BI Intro)'], completed: false, duration: '1 week', courseId: 4, type: 'reading' },
            { id: 16, title: 'Model Deployment with FastAPI', topics: ['REST APIs for ML Models', 'Containerizing with Docker', 'Streamlit for Demos', 'AWS SageMaker Basics'], completed: false, duration: '1.5 weeks', courseId: 5, type: 'assignment' },
            { id: 17, title: 'MLflow & Experiment Tracking', topics: ['Logging Runs & Metrics', 'Model Registry', 'A/B Testing for Models', 'Data Versioning with DVC'], completed: false, duration: '1.5 weeks', courseId: 5, type: 'video' }
          ]
        }
      ]
    }
  }
};
