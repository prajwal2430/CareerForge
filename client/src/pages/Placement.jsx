import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronDown, FiChevronUp, FiSearch, FiStar, FiTarget,
  FiBookOpen, FiCheck, FiCode, FiBarChart2, FiUsers,
  FiMessageSquare, FiFileText, FiBriefcase, FiAward, FiZap,
  FiTrendingUp, FiCpu, FiGlobe
} from 'react-icons/fi';

// ─── Full Aptitude Syllabus Data ─────────────────────────────────────────────
const SYLLABUS = [
  {
    id: 'quantitative',
    category: 'Quantitative Aptitude',
    shortName: 'Quant',
    icon: '🔢',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1, #818CF8)',
    description: 'Number crunching & mathematical problem solving tested in all company aptitude rounds.',
    importance: 'Very High',
    avgQuestions: '20–30',
    sections: [
      {
        title: 'Number System',
        icon: '🔣',
        topics: [
          { name: 'Natural, Whole & Integer Numbers', difficulty: 'easy' },
          { name: 'Divisibility Rules (2–19)', difficulty: 'easy' },
          { name: 'HCF & LCM — Methods & Problems', difficulty: 'medium' },
          { name: 'Prime & Composite Numbers', difficulty: 'easy' },
          { name: 'Factorization & Number of Factors', difficulty: 'medium' },
          { name: 'Remainder Theorem & Cyclicity', difficulty: 'hard' },
          { name: 'Unit Digit Calculations', difficulty: 'medium' },
          { name: 'Simplification & BODMAS', difficulty: 'easy' },
        ]
      },
      {
        title: 'Arithmetic',
        icon: '➕',
        topics: [
          { name: 'Percentages', difficulty: 'easy' },
          { name: 'Profit, Loss & Discount', difficulty: 'medium' },
          { name: 'Simple Interest', difficulty: 'easy' },
          { name: 'Compound Interest', difficulty: 'medium' },
          { name: 'Ratio & Proportion', difficulty: 'easy' },
          { name: 'Partnership Problems', difficulty: 'medium' },
          { name: 'Mixtures & Alligation', difficulty: 'medium' },
          { name: 'Averages & Weighted Averages', difficulty: 'easy' },
        ]
      },
      {
        title: 'Time, Work & Speed',
        icon: '⏱️',
        topics: [
          { name: 'Time, Speed & Distance', difficulty: 'medium' },
          { name: 'Relative Speed (Trains, Boats)', difficulty: 'medium' },
          { name: 'Time & Work', difficulty: 'medium' },
          { name: 'Pipes & Cisterns', difficulty: 'medium' },
          { name: 'Work & Wages', difficulty: 'hard' },
          { name: 'Ages Problems', difficulty: 'easy' },
        ]
      },
      {
        title: 'Algebra',
        icon: '📐',
        topics: [
          { name: 'Linear Equations (1 & 2 variables)', difficulty: 'easy' },
          { name: 'Quadratic Equations', difficulty: 'medium' },
          { name: 'Surds & Indices', difficulty: 'medium' },
          { name: 'Logarithms', difficulty: 'medium' },
          { name: 'Inequalities', difficulty: 'hard' },
          { name: 'Progressions — AP, GP, HP', difficulty: 'medium' },
        ]
      },
      {
        title: 'Permutation, Combination & Probability',
        icon: '🎲',
        topics: [
          { name: 'Fundamental Counting Principle', difficulty: 'easy' },
          { name: 'Permutations (nPr)', difficulty: 'medium' },
          { name: 'Combinations (nCr)', difficulty: 'medium' },
          { name: 'Circular Permutations', difficulty: 'hard' },
          { name: 'Probability Basics', difficulty: 'medium' },
          { name: 'Conditional Probability', difficulty: 'hard' },
          { name: 'Bayes Theorem', difficulty: 'hard' },
        ]
      },
      {
        title: 'Geometry & Mensuration',
        icon: '📏',
        topics: [
          { name: 'Lines, Angles & Triangles', difficulty: 'easy' },
          { name: 'Circles — Area, Chord, Tangent', difficulty: 'medium' },
          { name: 'Quadrilaterals & Polygons', difficulty: 'medium' },
          { name: '2D Mensuration (Area & Perimeter)', difficulty: 'medium' },
          { name: '3D Mensuration (Volume & Surface Area)', difficulty: 'medium' },
          { name: 'Coordinate Geometry Basics', difficulty: 'medium' },
          { name: 'Basic Trigonometry', difficulty: 'medium' },
        ]
      },
      {
        title: 'Data Interpretation',
        icon: '📊',
        topics: [
          { name: 'Bar Graphs', difficulty: 'easy' },
          { name: 'Line Graphs', difficulty: 'easy' },
          { name: 'Pie Charts', difficulty: 'easy' },
          { name: 'Tables & Caselets', difficulty: 'medium' },
          { name: 'Mixed DI Sets', difficulty: 'hard' },
          { name: 'Missing Data Interpretation', difficulty: 'hard' },
        ]
      },
    ]
  },
  {
    id: 'logical',
    category: 'Logical Reasoning',
    shortName: 'LR',
    icon: '🧩',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
    description: 'Analytical thinking, pattern recognition and deduction tested by MNCs & product companies.',
    importance: 'Very High',
    avgQuestions: '15–25',
    sections: [
      {
        title: 'Verbal Reasoning',
        icon: '💬',
        topics: [
          { name: 'Blood Relations', difficulty: 'easy' },
          { name: 'Coding-Decoding (Letter & Number)', difficulty: 'medium' },
          { name: 'Direction Sense & Distance', difficulty: 'easy' },
          { name: 'Ranking & Ordering', difficulty: 'easy' },
          { name: 'Alphabetical Series', difficulty: 'easy' },
          { name: 'Number Series Completion', difficulty: 'medium' },
          { name: 'Analogy & Classification', difficulty: 'medium' },
        ]
      },
      {
        title: 'Puzzles & Arrangements',
        icon: '🧠',
        topics: [
          { name: 'Linear Seating Arrangement', difficulty: 'medium' },
          { name: 'Circular Seating Arrangement', difficulty: 'hard' },
          { name: 'Floor-Based Puzzles', difficulty: 'hard' },
          { name: 'Box & Age Puzzles', difficulty: 'medium' },
          { name: 'Scheduling Puzzles', difficulty: 'hard' },
          { name: 'Comparison-Based Puzzles', difficulty: 'medium' },
        ]
      },
      {
        title: 'Syllogisms & Deductions',
        icon: '🔗',
        topics: [
          { name: 'Syllogisms (Venn Diagram Method)', difficulty: 'medium' },
          { name: 'Statements & Conclusions', difficulty: 'medium' },
          { name: 'Statements & Assumptions', difficulty: 'medium' },
          { name: 'Inferences & Arguments', difficulty: 'hard' },
          { name: 'Course of Action', difficulty: 'medium' },
          { name: 'Cause & Effect', difficulty: 'medium' },
        ]
      },
      {
        title: 'Non-Verbal Reasoning',
        icon: '🔷',
        topics: [
          { name: 'Pattern Series (Figures)', difficulty: 'medium' },
          { name: 'Mirror & Water Images', difficulty: 'easy' },
          { name: 'Figure Completion', difficulty: 'medium' },
          { name: 'Paper Folding & Cutting', difficulty: 'hard' },
          { name: 'Dice & Cube Problems', difficulty: 'hard' },
          { name: 'Counting Embedded Figures', difficulty: 'medium' },
        ]
      },
      {
        title: 'Clocks & Calendars',
        icon: '🕐',
        topics: [
          { name: 'Clock Angle Problems', difficulty: 'medium' },
          { name: 'Time Gain/Loss Problems', difficulty: 'medium' },
          { name: 'Calendar Day Calculation', difficulty: 'easy' },
          { name: 'Odd Days Concept', difficulty: 'medium' },
          { name: 'Leap Year Rules', difficulty: 'easy' },
        ]
      },
    ]
  },
  {
    id: 'verbal',
    category: 'Verbal Ability & English',
    shortName: 'Verbal',
    icon: '📝',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899, #F472B6)',
    description: 'Grammar, comprehension and English communication skills assessed across all company rounds.',
    importance: 'High',
    avgQuestions: '15–20',
    sections: [
      {
        title: 'Grammar Fundamentals',
        icon: '📖',
        topics: [
          { name: 'Parts of Speech', difficulty: 'easy' },
          { name: 'Tenses (12 Forms)', difficulty: 'medium' },
          { name: 'Active & Passive Voice', difficulty: 'medium' },
          { name: 'Direct & Indirect Speech', difficulty: 'medium' },
          { name: 'Articles (a, an, the)', difficulty: 'easy' },
          { name: 'Prepositions', difficulty: 'medium' },
          { name: 'Conjunctions', difficulty: 'easy' },
          { name: 'Subject-Verb Agreement', difficulty: 'medium' },
        ]
      },
      {
        title: 'Error Detection & Sentence Correction',
        icon: '✏️',
        topics: [
          { name: 'Spotting Grammatical Errors', difficulty: 'medium' },
          { name: 'Sentence Correction', difficulty: 'medium' },
          { name: 'Fill in the Blanks (Grammar)', difficulty: 'medium' },
          { name: 'Correct Usage of Words', difficulty: 'medium' },
          { name: 'Double Fillers', difficulty: 'hard' },
        ]
      },
      {
        title: 'Vocabulary',
        icon: '📚',
        topics: [
          { name: 'Synonyms (200+ Important Words)', difficulty: 'medium' },
          { name: 'Antonyms', difficulty: 'medium' },
          { name: 'Idioms & Phrases', difficulty: 'hard' },
          { name: 'One Word Substitution', difficulty: 'medium' },
          { name: 'Analogies (Word Pairs)', difficulty: 'medium' },
          { name: 'Contextual Word Meaning', difficulty: 'hard' },
        ]
      },
      {
        title: 'Reading Comprehension',
        icon: '🔍',
        topics: [
          { name: 'Passage-Based Questions (Long RC)', difficulty: 'hard' },
          { name: 'Short RC Passages', difficulty: 'medium' },
          { name: 'Inference Questions', difficulty: 'hard' },
          { name: 'Title / Main Idea Questions', difficulty: 'medium' },
          { name: 'Tone & Attitude of Author', difficulty: 'hard' },
        ]
      },
      {
        title: 'Sentence Rearrangement',
        icon: '🔀',
        topics: [
          { name: 'Para Jumbles (P-Q-R-S format)', difficulty: 'hard' },
          { name: 'Sentence Ordering', difficulty: 'medium' },
          { name: 'Para Completion', difficulty: 'hard' },
          { name: 'Cloze Test', difficulty: 'medium' },
          { name: 'Sentence Summary', difficulty: 'medium' },
        ]
      },
    ]
  },
  {
    id: 'technical',
    category: 'Technical Aptitude (CS Fundamentals)',
    shortName: 'Technical',
    icon: '💻',
    color: '#FF6B00',
    gradient: 'linear-gradient(135deg, #FF6B00, #FF8C42)',
    description: 'Core CS concepts tested in technical screening rounds and online assessments.',
    importance: 'Very High',
    avgQuestions: '20–40',
    sections: [
      {
        title: 'Programming Concepts',
        icon: '⚙️',
        topics: [
          { name: 'Variables, Data Types & Type Casting', difficulty: 'easy' },
          { name: 'Operators & Expressions', difficulty: 'easy' },
          { name: 'Control Structures (if-else, loops)', difficulty: 'easy' },
          { name: 'Functions & Recursion', difficulty: 'medium' },
          { name: 'Pointers & Memory (C/C++)', difficulty: 'hard' },
          { name: 'Object-Oriented Programming (OOP)', difficulty: 'medium' },
          { name: 'Exception Handling', difficulty: 'medium' },
          { name: 'Bit Manipulation', difficulty: 'hard' },
        ]
      },
      {
        title: 'Data Structures',
        icon: '🗂️',
        topics: [
          { name: 'Arrays & Multidimensional Arrays', difficulty: 'easy' },
          { name: 'Strings & String Manipulation', difficulty: 'easy' },
          { name: 'Linked List (Singly, Doubly, Circular)', difficulty: 'medium' },
          { name: 'Stack & Applications (Parentheses, NGE)', difficulty: 'medium' },
          { name: 'Queue, Deque & Priority Queue', difficulty: 'medium' },
          { name: 'Binary Trees & BST', difficulty: 'medium' },
          { name: 'Heaps (Min/Max Heap)', difficulty: 'medium' },
          { name: 'Hashing & Collision Handling', difficulty: 'medium' },
          { name: 'Graphs (Adjacency List/Matrix)', difficulty: 'hard' },
          { name: 'Tries & Segment Trees', difficulty: 'hard' },
        ]
      },
      {
        title: 'Algorithms',
        icon: '🔄',
        topics: [
          { name: 'Sorting Algorithms (Merge, Quick, Heap)', difficulty: 'medium' },
          { name: 'Searching (Binary Search & Variants)', difficulty: 'medium' },
          { name: 'Two Pointers & Sliding Window', difficulty: 'medium' },
          { name: 'Divide & Conquer', difficulty: 'medium' },
          { name: 'Greedy Algorithms', difficulty: 'medium' },
          { name: 'Dynamic Programming (DP)', difficulty: 'hard' },
          { name: 'Graph Algorithms (BFS, DFS, Dijkstra)', difficulty: 'hard' },
          { name: 'Minimum Spanning Tree (Kruskal, Prim)', difficulty: 'hard' },
          { name: 'String Matching (KMP, Z-Algorithm)', difficulty: 'hard' },
          { name: 'Time & Space Complexity (Big-O)', difficulty: 'medium' },
        ]
      },
      {
        title: 'Operating Systems',
        icon: '🖥️',
        topics: [
          { name: 'Process vs Thread', difficulty: 'medium' },
          { name: 'CPU Scheduling Algorithms', difficulty: 'medium' },
          { name: 'Deadlock — Detection, Prevention, Avoidance', difficulty: 'hard' },
          { name: 'Memory Management & Paging', difficulty: 'hard' },
          { name: 'Virtual Memory & Page Replacement', difficulty: 'hard' },
          { name: 'Semaphores & Mutex', difficulty: 'medium' },
          { name: 'File System & Disk Scheduling', difficulty: 'medium' },
        ]
      },
      {
        title: 'Database Management (DBMS)',
        icon: '🗄️',
        topics: [
          { name: 'ER Diagrams & Mapping', difficulty: 'easy' },
          { name: 'Relational Algebra', difficulty: 'medium' },
          { name: 'SQL — DDL, DML, DCL, TCL', difficulty: 'medium' },
          { name: 'Joins (Inner, Outer, Cross, Self)', difficulty: 'medium' },
          { name: 'Normalization (1NF to BCNF)', difficulty: 'hard' },
          { name: 'Transactions & ACID Properties', difficulty: 'medium' },
          { name: 'Indexing & B+ Trees', difficulty: 'hard' },
          { name: 'Concurrency Control', difficulty: 'hard' },
        ]
      },
      {
        title: 'Computer Networks',
        icon: '🌐',
        topics: [
          { name: 'OSI vs TCP/IP Model (All Layers)', difficulty: 'medium' },
          { name: 'IP Addressing & Subnetting (CIDR)', difficulty: 'hard' },
          { name: 'TCP vs UDP', difficulty: 'easy' },
          { name: 'HTTP/HTTPS, DNS, DHCP, FTP, SMTP', difficulty: 'medium' },
          { name: 'Routing Algorithms (Dijkstra, Bellman-Ford)', difficulty: 'hard' },
          { name: 'Error Detection (CRC, Checksum, Hamming)', difficulty: 'hard' },
          { name: 'Congestion & Flow Control', difficulty: 'medium' },
        ]
      },
      {
        title: 'Software Engineering & Design',
        icon: '🏗️',
        topics: [
          { name: 'SDLC Models (Waterfall, Agile, Scrum)', difficulty: 'easy' },
          { name: 'Design Patterns (Singleton, Factory, Observer)', difficulty: 'medium' },
          { name: 'SOLID Principles', difficulty: 'medium' },
          { name: 'System Design Basics (LLD & HLD)', difficulty: 'hard' },
          { name: 'Version Control (Git & GitHub)', difficulty: 'easy' },
          { name: 'API Design & REST Principles', difficulty: 'medium' },
        ]
      },
    ]
  },
  {
    id: 'coding',
    category: 'Coding & Problem Solving',
    shortName: 'Coding',
    icon: '⚙️',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    description: 'Hands-on coding problems solved in timed online rounds — the gateway to top product companies.',
    importance: 'Critical',
    avgQuestions: '2–5 Problems',
    sections: [
      {
        title: 'Core DSA Patterns',
        icon: '🔑',
        topics: [
          { name: 'Prefix Sum & Difference Array', difficulty: 'medium' },
          { name: 'Two Pointer Technique', difficulty: 'medium' },
          { name: 'Sliding Window (Fixed & Variable)', difficulty: 'medium' },
          { name: 'Fast & Slow Pointer (Floyd\'s Cycle)', difficulty: 'medium' },
          { name: 'Merge Intervals', difficulty: 'medium' },
          { name: 'Top-K Elements (Heap)', difficulty: 'medium' },
          { name: 'Binary Search on Answer', difficulty: 'hard' },
          { name: 'Monotonic Stack / Queue', difficulty: 'hard' },
          { name: 'Union-Find (DSU)', difficulty: 'hard' },
          { name: 'Topological Sort (Kahn\'s / DFS)', difficulty: 'hard' },
        ]
      },
      {
        title: 'Dynamic Programming Patterns',
        icon: '🧮',
        topics: [
          { name: '0/1 Knapsack', difficulty: 'hard' },
          { name: 'Unbounded Knapsack', difficulty: 'hard' },
          { name: 'Longest Common Subsequence (LCS)', difficulty: 'hard' },
          { name: 'Longest Increasing Subsequence (LIS)', difficulty: 'hard' },
          { name: 'Matrix Chain Multiplication', difficulty: 'hard' },
          { name: 'DP on Grids', difficulty: 'medium' },
          { name: 'DP on Trees', difficulty: 'hard' },
          { name: 'Bitmask DP', difficulty: 'hard' },
        ]
      },
      {
        title: 'Practice Strategy',
        icon: '🎯',
        topics: [
          { name: 'LeetCode Top 150 Interview Questions', difficulty: 'mixed' },
          { name: 'Striver\'s A2Z DSA Sheet', difficulty: 'mixed' },
          { name: 'Company-Specific Problem Sets', difficulty: 'mixed' },
          { name: 'Timed Mock Coding Rounds (90 min)', difficulty: 'hard' },
          { name: 'Code Review & Optimization', difficulty: 'medium' },
          { name: 'Competitive Programming Basics', difficulty: 'hard' },
        ]
      },
    ]
  },
  {
    id: 'hr',
    category: 'HR & Behavioral Interview',
    shortName: 'HR',
    icon: '🤝',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
    description: 'Personality, communication and culture-fit questions that seal the final offer.',
    importance: 'High',
    avgQuestions: 'Open-ended',
    sections: [
      {
        title: 'Common HR Questions',
        icon: '🙋',
        topics: [
          { name: 'Tell me about yourself (2-min pitch)', difficulty: 'easy' },
          { name: 'Strengths & Weaknesses', difficulty: 'easy' },
          { name: 'Why this company / role?', difficulty: 'medium' },
          { name: 'Where do you see yourself in 5 years?', difficulty: 'medium' },
          { name: 'Greatest achievement / failure', difficulty: 'medium' },
          { name: 'How do you handle pressure / deadlines?', difficulty: 'medium' },
          { name: 'Team conflict resolution experience', difficulty: 'medium' },
        ]
      },
      {
        title: 'STAR Framework (Behavioral)',
        icon: '⭐',
        topics: [
          { name: 'Situation-Task-Action-Result Method', difficulty: 'medium' },
          { name: 'Leadership Examples', difficulty: 'medium' },
          { name: 'Initiative & Innovation Examples', difficulty: 'medium' },
          { name: 'Teamwork & Collaboration Stories', difficulty: 'medium' },
          { name: 'Adaptability & Learning Examples', difficulty: 'medium' },
        ]
      },
      {
        title: 'Group Discussion (GD)',
        icon: '👥',
        topics: [
          { name: 'GD Formats & Etiquette', difficulty: 'easy' },
          { name: 'Fish Bowl & Panel GD', difficulty: 'medium' },
          { name: 'Current Affairs (Tech, Economy, India)', difficulty: 'medium' },
          { name: 'Structuring Arguments Effectively', difficulty: 'medium' },
          { name: 'Listening & Collaborative Leadership', difficulty: 'medium' },
          { name: 'Summarizing & Concluding', difficulty: 'medium' },
        ]
      },
      {
        title: 'Salary & Negotiation',
        icon: '💼',
        topics: [
          { name: 'Understanding CTC Components', difficulty: 'easy' },
          { name: 'How to answer "Expected Salary?"', difficulty: 'medium' },
          { name: 'Counter-offer Strategies', difficulty: 'medium' },
          { name: 'Notice Period Discussion', difficulty: 'easy' },
          { name: 'Joining Date Negotiation', difficulty: 'easy' },
        ]
      },
    ]
  },
  {
    id: 'resume',
    category: 'Resume & Portfolio Building',
    shortName: 'Resume',
    icon: '📄',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
    description: 'Craft an ATS-friendly resume and online presence that gets shortlisted by top recruiters.',
    importance: 'High',
    avgQuestions: 'Continuous',
    sections: [
      {
        title: 'Resume Structure',
        icon: '📑',
        topics: [
          { name: 'ATS-Friendly Single-Column Format', difficulty: 'easy' },
          { name: 'Writing Powerful Action Verbs', difficulty: 'medium' },
          { name: 'Quantifying Impact (%, numbers)', difficulty: 'medium' },
          { name: 'Projects Section — STAR Format', difficulty: 'medium' },
          { name: 'Skills Matrix & Tech Stack', difficulty: 'easy' },
          { name: 'Education & Certifications Section', difficulty: 'easy' },
          { name: 'Tailoring Resume per Job Description', difficulty: 'hard' },
        ]
      },
      {
        title: 'Online Presence & Portfolio',
        icon: '🌐',
        topics: [
          { name: 'GitHub Profile Optimization', difficulty: 'medium' },
          { name: 'LinkedIn Profile & Networking', difficulty: 'medium' },
          { name: 'Personal Portfolio Website', difficulty: 'medium' },
          { name: 'Personal Branding Strategy', difficulty: 'hard' },
          { name: 'Contributing to Open Source', difficulty: 'hard' },
          { name: 'Competitive Programming Profiles (CF/LC)', difficulty: 'medium' },
        ]
      },
    ]
  },
];

// ─── Stats Overview ──────────────────────────────────────────────────────────
const OVERVIEW_STATS = [
  { label: 'Aptitude Sections', value: '7', icon: '📚', color: '#6366F1' },
  { label: 'Total Topics', value: '200+', icon: '📌', color: '#8B5CF6' },
  { label: 'Companies Covered', value: '50+', icon: '🏢', color: '#EC4899' },
  { label: 'Placement Rounds', value: 'All', icon: '✅', color: '#10B981' },
];

// ─── Company Round Info ──────────────────────────────────────────────────────
const COMPANY_ROUNDS = [
  { company: 'TCS', rounds: ['Online Aptitude (90 min)', 'Technical Interview', 'HR Interview'], color: '#1E40AF', logo: '🔵' },
  { company: 'Infosys', rounds: ['HackWithInfy / InfyTQ', 'Technical Interview', 'HR Interview'], color: '#0F766E', logo: '🟢' },
  { company: 'Wipro', rounds: ['NLTH Online Test', 'Technical Interview', 'HR Interview'], color: '#7E22CE', logo: '🟣' },
  { company: 'Accenture', rounds: ['Cognitive & Coding Test', 'Communication Test', 'HR Interview'], color: '#991B1B', logo: '🔴' },
  { company: 'Amazon', rounds: ['Online Assessment', 'Technical Rounds (2–3)', 'Bar Raiser', 'HR'], color: '#92400E', logo: '🟠' },
  { company: 'Google', rounds: ['Online Assessment', 'Technical Rounds (4–5)', 'System Design', 'Googliness'], color: '#064E3B', logo: '🟡' },
  { company: 'Microsoft', rounds: ['Online Assessment', 'Technical Rounds (3–4)', 'System Design', 'HR'], color: '#1E3A5F', logo: '⬜' },
  { company: 'Cognizant', rounds: ['GenC Test (Aptitude + Coding)', 'Technical Interview', 'HR Interview'], color: '#1D4ED8', logo: '🔷' },
];

const difficultyConfig = {
  easy: { label: 'Easy', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  medium: { label: 'Medium', color: '#D97706', bg: '#FFF7ED', border: '#FDE68A' },
  hard: { label: 'Hard', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  mixed: { label: 'Mixed', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
};

// ─── Section Accordion ───────────────────────────────────────────────────────
const SectionAccordion = ({ section, color }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: '1px solid #F3F4F6',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '0.5rem',
    }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '0.85rem 1.1rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: open ? `${color}06` : 'white',
          transition: 'background 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <span style={{ fontSize: '1.1rem' }}>{section.icon}</span>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E1E1E', fontFamily: "'Poppins', sans-serif" }}>
            {section.title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: `${color}15`,
            color: color,
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '2px 9px',
            borderRadius: '99px',
            border: `1px solid ${color}25`,
          }}>
            {section.topics.length} topics
          </span>
          <div style={{ color: '#9CA3AF' }}>
            {open ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0.75rem 1.1rem 1rem',
              background: '#FAFAFA',
              borderTop: `1px solid ${color}15`,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '7px',
            }}>
              {section.topics.map((topic, tIdx) => {
                const diff = difficultyConfig[topic.difficulty] || difficultyConfig.medium;
                return (
                  <span
                    key={tIdx}
                    style={{
                      background: 'white',
                      border: `1px solid #E5E7EB`,
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      color: '#374151',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      cursor: 'default',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${color}08`;
                      e.currentTarget.style.borderColor = `${color}40`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  >
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: diff.bg,
                      color: diff.color,
                      border: `1px solid ${diff.border}`,
                      flexShrink: 0,
                    }}>{diff.label}</span>
                    {topic.name}
                  </span>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Category Card ───────────────────────────────────────────────────────────
const CategoryCard = ({ item, isActive, onClick }) => {
  const totalTopics = item.sections.reduce((a, s) => a + s.topics.length, 0);
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      style={{
        background: isActive ? item.color : 'white',
        border: `2px solid ${isActive ? item.color : '#F3F4F6'}`,
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: isActive ? `0 8px 24px ${item.color}40` : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>{item.icon}</div>
      <div style={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
        fontSize: '0.82rem',
        color: isActive ? 'white' : '#1E1E1E',
        marginBottom: '3px',
        lineHeight: 1.3,
      }}>{item.shortName}</div>
      <div style={{
        fontSize: '0.7rem',
        color: isActive ? 'rgba(255,255,255,0.8)' : '#9CA3AF',
        fontWeight: 600,
      }}>{totalTopics} topics</div>
    </motion.div>
  );
};

// ─── Main Placement Page ─────────────────────────────────────────────────────
const Placement = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(SYLLABUS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('syllabus'); // syllabus | companies

  const active = SYLLABUS.find(s => s.id === activeCategory) || SYLLABUS[0];
  const totalTopics = SYLLABUS.reduce((acc, cat) => acc + cat.sections.reduce((a, s) => a + s.topics.length, 0), 0);

  // Filter sections by search
  const filteredSections = active.sections.map(section => ({
    ...section,
    topics: searchQuery
      ? section.topics.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : section.topics,
  })).filter(s => s.topics.length > 0);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '4rem' }}>

      {/* ── Hero Banner ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #1a1040 100%)',
          borderRadius: '28px',
          padding: '2.5rem 2.5rem 2rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, #6366F160 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '15%', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, #EC489940 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20px', left: '55%', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, #10B98130 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  padding: '6px 14px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#94A3B8',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>🎯 CareerForge</div>
              </div>
              <h1 style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 900,
                fontSize: '2.2rem',
                color: 'white',
                margin: '0 0 0.5rem 0',
                lineHeight: 1.15,
              }}>
                Placement Preparation
                <br />
                <span style={{ background: 'linear-gradient(90deg, #818CF8, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Complete Syllabus Hub
                </span>
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '0.92rem', margin: '0 0 1.5rem 0', lineHeight: 1.65, maxWidth: '520px' }}>
                Everything you need to crack aptitude tests, technical rounds, and HR interviews at top companies — all in one place.
              </p>
            </div>

            {/* Quick stat badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: '📚', label: 'Sections', value: SYLLABUS.length },
                { icon: '📌', label: 'Topics', value: `${totalTopics}+` },
                { icon: '🏢', label: 'Companies', value: '50+' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  minWidth: '150px',
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, color: 'white', fontSize: '1.1rem', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ color: '#64748B', fontSize: '0.7rem', marginTop: '2px' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overview stat pills */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Technical CS', 'Coding', 'HR Rounds', 'Resume'].map((tag, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '99px',
                padding: '5px 14px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#CBD5E1',
              }}>{tag}</div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Tab Switcher ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: '#F3F4F6',
        borderRadius: '14px',
        padding: '4px',
        marginBottom: '2rem',
        width: 'fit-content',
      }}>
        {[
          { id: 'syllabus', label: '📖 Aptitude Syllabus' },
          { id: 'companies', label: '🏢 Company Rounds' },
        ].map(tab => (
          <button
            key={tab.id}
            id={`placement-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '9px 22px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: '0.875rem',
              background: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? '#1E1E1E' : '#6B7280',
              boxShadow: activeTab === tab.id ? '0 2px 10px rgba(0,0,0,0.10)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── SYLLABUS TAB ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === 'syllabus' && (
          <motion.div
            key="syllabus"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Category Selector Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}>
              {SYLLABUS.map(item => (
                <CategoryCard
                  key={item.id}
                  item={item}
                  isActive={activeCategory === item.id}
                  onClick={() => { setActiveCategory(item.id); setSearchQuery(''); }}
                />
              ))}
            </div>

            {/* Active Category Detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                {/* Category Header */}
                <div style={{
                  background: `linear-gradient(135deg, white 60%, ${active.color}08)`,
                  border: `1.5px solid ${active.color}25`,
                  borderRadius: '20px',
                  padding: '1.5rem 1.75rem',
                  marginBottom: '1.25rem',
                  boxShadow: `0 4px 20px ${active.color}12`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, ${active.color}22, ${active.color}10)`,
                        border: `2px solid ${active.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem',
                        flexShrink: 0,
                      }}>{active.icon}</div>
                      <div>
                        <h2 style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 800,
                          fontSize: '1.2rem',
                          color: '#1E1E1E',
                          margin: '0 0 4px 0',
                        }}>{active.category}</h2>
                        <p style={{ color: '#6B7280', fontSize: '0.83rem', margin: 0, lineHeight: 1.5, maxWidth: '480px' }}>
                          {active.description}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {[
                        { label: 'Importance', value: active.importance },
                        { label: 'Avg Questions', value: active.avgQuestions },
                        { label: 'Sections', value: active.sections.length },
                      ].map((s, i) => (
                        <div key={i} style={{
                          background: '#F9FAFB',
                          border: '1px solid #F3F4F6',
                          borderRadius: '10px',
                          padding: '8px 14px',
                          textAlign: 'center',
                        }}>
                          <div style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 600, marginBottom: '2px' }}>{s.label}</div>
                          <div style={{ fontWeight: 800, color: active.color, fontSize: '0.92rem' }}>{s.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <div style={{
                  position: 'relative',
                  marginBottom: '1.25rem',
                }}>
                  <FiSearch style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF',
                    fontSize: '1rem',
                  }} />
                  <input
                    type="text"
                    placeholder={`Search topics in ${active.shortName}...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 16px 11px 42px',
                      borderRadius: '12px',
                      border: `1.5px solid ${searchQuery ? active.color + '50' : '#E5E7EB'}`,
                      fontSize: '0.875rem',
                      outline: 'none',
                      color: '#1E1E1E',
                      fontFamily: "'Inter', sans-serif",
                      background: 'white',
                      boxShadow: searchQuery ? `0 0 0 3px ${active.color}12` : 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: '#F3F4F6',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        color: '#6B7280',
                        fontWeight: 600,
                      }}
                    >Clear</button>
                  )}
                </div>

                {/* Sections with Topics */}
                {filteredSections.length > 0 ? (
                  filteredSections.map((section, idx) => (
                    <SectionAccordion key={idx} section={section} color={active.color} />
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: '#9CA3AF',
                    fontSize: '0.9rem',
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
                    No topics found for "<strong>{searchQuery}</strong>"
                  </div>
                )}

                {/* Difficulty Legend */}
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem 1.25rem',
                  background: '#F9FAFB',
                  border: '1px solid #F3F4F6',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Difficulty:</span>
                  {Object.entries(difficultyConfig).map(([key, cfg]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px',
                        borderRadius: '4px', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                      }}>{cfg.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── COMPANIES TAB ─────────────────────────────────────────── */}
        {activeTab === 'companies' && (
          <motion.div
            key="companies"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#1E1E1E',
                margin: '0 0 4px 0',
              }}>Company-Wise Placement Rounds</h2>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', margin: 0 }}>
                Know exactly what to expect in each company's hiring process
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {COMPANY_ROUNDS.map((company, cIdx) => (
                <motion.div
                  key={cIdx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: cIdx * 0.06 }}
                  style={{
                    background: 'white',
                    border: '1.5px solid #F3F4F6',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}
                  whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(0,0,0,0.09)' }}
                >
                  {/* Company Header */}
                  <div style={{
                    background: company.color,
                    padding: '1.1rem 1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      flexShrink: 0,
                    }}>{company.logo}</div>
                    <div>
                      <div style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        color: 'white',
                      }}>{company.company}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                        {company.rounds.length} Round{company.rounds.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Rounds List */}
                  <div style={{ padding: '1rem 1.25rem' }}>
                    {company.rounds.map((round, rIdx) => (
                      <div
                        key={rIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 0',
                          borderBottom: rIdx < company.rounds.length - 1 ? '1px dashed #F3F4F6' : 'none',
                        }}
                      >
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '8px',
                          background: company.color + '15',
                          border: `1.5px solid ${company.color}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          color: company.color,
                          flexShrink: 0,
                        }}>{rIdx + 1}</div>
                        <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>{round}</span>
                      </div>
                    ))}
                    <button
                      onClick={() => navigate('/practice')}
                      style={{
                        marginTop: '0.85rem',
                        width: '100%',
                        background: company.color + '12',
                        color: company.color,
                        border: `1.5px solid ${company.color}30`,
                        borderRadius: '10px',
                        padding: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = company.color + '22'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = company.color + '12'; }}
                    >
                      <FiCode size={13} /> Practice {company.company} Questions
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pro Tips Section */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#1E1E1E',
                margin: '0 0 1rem 0',
              }}>🎯 Expert Placement Tips</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {[
                  { icon: '⏱️', title: 'Time Management', desc: 'Spend max 2 min per aptitude question. Skip and come back if stuck.', color: '#6366F1' },
                  { icon: '📊', title: 'Focus on High-Weightage Topics', desc: 'Percentages, Time-Work, Coding Patterns cover ~60% of questions.', color: '#10B981' },
                  { icon: '🔁', title: 'Consistent Practice', desc: 'Solve 10 aptitude Qs and 1 coding problem daily for 60 days.', color: '#FF6B00' },
                  { icon: '🧪', title: 'Mock Tests Weekly', desc: 'Take full-length mock tests every week under timed conditions.', color: '#EC4899' },
                  { icon: '📱', title: 'Company-Specific Prep', desc: 'Each company has a pattern — study previous year test papers.', color: '#F59E0B' },
                  { icon: '🤝', title: 'Soft Skills Matter', desc: 'GD + HR rounds filter 30% of candidates. Prepare your STAR stories.', color: '#8B5CF6' },
                ].map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    style={{
                      background: 'white',
                      border: `1.5px solid ${tip.color}20`,
                      borderRadius: '16px',
                      padding: '1.25rem',
                      borderLeft: `4px solid ${tip.color}`,
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{tip.icon}</div>
                    <div style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: '#1E1E1E',
                      marginBottom: '5px',
                    }}>{tip.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.55 }}>{tip.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        style={{
          marginTop: '2.5rem',
          background: 'linear-gradient(135deg, #1E293B, #0F172A)',
          borderRadius: '20px',
          padding: '1.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: '1.1rem',
            color: 'white',
            marginBottom: '4px',
          }}>Ready to start practicing?</div>
          <div style={{ color: '#64748B', fontSize: '0.83rem' }}>
            Apply your knowledge with real aptitude & coding problems
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/practice')}
            style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 22px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <FiCode size={15} /> Practice Problems
          </button>
          <button
            onClick={() => navigate('/roadmaps')}
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'white',
              border: '1.5px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '10px 22px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          >
            <FiTarget size={15} /> View Roadmaps
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Placement;
