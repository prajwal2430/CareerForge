import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiChevronLeft, FiCheck, FiPlayCircle, FiFileText, FiCode, FiHelpCircle,
  FiChevronDown, FiChevronUp, FiClock, FiBookOpen, FiAward, FiLock,
  FiExternalLink, FiTarget, FiTrendingUp, FiZap, FiBriefcase, FiStar,
  FiBarChart2, FiCpu, FiGlobe, FiUsers, FiMessageSquare, FiPenTool
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_DATA } from '../data/mockData';
import ProgressRing from '../components/ui/ProgressRing';

// ── Placement Data ──────────────────────────────────────────────────────────
const PLACEMENT_TOPICS = [
  {
    id: 'quantitative',
    category: 'Quantitative Aptitude',
    icon: '🔢',
    color: '#6366F1',
    description: 'Number crunching skills tested in almost every company aptitude round.',
    sections: [
      {
        title: 'Arithmetic',
        topics: [
          'Number System & Divisibility',
          'HCF & LCM',
          'Simplification & Approximation',
          'Percentages',
          'Profit, Loss & Discount',
          'Simple & Compound Interest',
          'Ratio & Proportion',
          'Averages & Mixtures',
          'Time, Speed & Distance',
          'Time & Work',
          'Pipes & Cisterns',
          'Ages Problems',
        ]
      },
      {
        title: 'Algebra & Geometry',
        topics: [
          'Linear & Quadratic Equations',
          'Progressions (AP, GP, HP)',
          'Surds & Indices',
          'Permutations & Combinations',
          'Probability',
          'Mensuration (2D & 3D)',
          'Coordinate Geometry Basics',
          'Trigonometry Basics',
        ]
      },
      {
        title: 'Data Interpretation',
        topics: [
          'Bar Graphs & Line Graphs',
          'Pie Charts',
          'Tables & Caselets',
          'Mixed DI Sets',
        ]
      }
    ]
  },
  {
    id: 'logical',
    category: 'Logical Reasoning',
    icon: '🧩',
    color: '#8B5CF6',
    description: 'Tests analytical thinking, pattern recognition and problem-solving ability.',
    sections: [
      {
        title: 'Verbal Reasoning',
        topics: [
          'Blood Relations',
          'Coding-Decoding',
          'Direction Sense',
          'Ranking & Order',
          'Syllogisms',
          'Seating Arrangements (Linear & Circular)',
          'Scheduling & Calendars',
          'Clocks & Calendars',
        ]
      },
      {
        title: 'Non-Verbal Reasoning',
        topics: [
          'Pattern Completion',
          'Series & Analogy',
          'Mirror & Water Images',
          'Figure Classification',
          'Paper Folding & Cutting',
          'Dice & Cube Puzzles',
        ]
      },
      {
        title: 'Critical Reasoning',
        topics: [
          'Statements & Conclusions',
          'Assumptions & Inferences',
          'Arguments (Strong vs Weak)',
          'Course of Action',
          'Cause & Effect',
        ]
      }
    ]
  },
  {
    id: 'verbal',
    category: 'Verbal Ability & English',
    icon: '📝',
    color: '#EC4899',
    description: 'Grammar, comprehension and communication skills assessed by top MNCs.',
    sections: [
      {
        title: 'Grammar & Vocabulary',
        topics: [
          'Parts of Speech',
          'Tenses & Voice',
          'Sentence Correction',
          'Error Spotting',
          'Fill in the Blanks',
          'Synonyms & Antonyms',
          'Idioms & Phrases',
          'One Word Substitution',
        ]
      },
      {
        title: 'Reading & Writing',
        topics: [
          'Reading Comprehension (RC)',
          'Para Jumbles',
          'Sentence Rearrangement',
          'Cloze Test',
          'Para Completion',
          'Précis Writing',
          'Essay Writing',
        ]
      }
    ]
  },
  {
    id: 'technical',
    category: 'Technical Aptitude (CS)',
    icon: '💻',
    color: '#FF6B00',
    description: 'Core CS fundamentals evaluated in coding & technical interviews.',
    sections: [
      {
        title: 'Programming Fundamentals',
        topics: [
          'C / C++ / Java / Python Basics',
          'OOP Concepts (Encapsulation, Inheritance, Polymorphism)',
          'Recursion & Backtracking',
          'Time & Space Complexity (Big-O)',
          'Bit Manipulation',
        ]
      },
      {
        title: 'Data Structures',
        topics: [
          'Arrays & Strings',
          'Linked List',
          'Stack & Queue',
          'Trees (Binary Tree, BST, AVL)',
          'Heaps & Priority Queue',
          'Hashing & Hash Maps',
          'Graphs (BFS, DFS, Dijkstra, Floyd-Warshall)',
          'Tries & Segment Trees',
        ]
      },
      {
        title: 'Algorithms',
        topics: [
          'Searching & Sorting',
          'Two Pointers & Sliding Window',
          'Divide & Conquer',
          'Greedy Algorithms',
          'Dynamic Programming',
          'Graph Algorithms (MST, Shortest Path)',
          'String Algorithms (KMP, Z-function)',
        ]
      },
      {
        title: 'CS Core Subjects',
        topics: [
          'Operating Systems (Process, Memory, Synchronization)',
          'Database Management (SQL, Normalization, Transactions)',
          'Computer Networks (TCP/IP, OSI, DNS, HTTP)',
          'DBMS Design (ER Diagram, Keys, Indexing)',
          'Software Engineering (SDLC, Agile, Design Patterns)',
          'System Design Basics (Load Balancing, Caching, CDN)',
        ]
      }
    ]
  },
  {
    id: 'coding',
    category: 'Coding & Problem Solving',
    icon: '⚙️',
    color: '#10B981',
    description: 'Online coding rounds: the gateway to top product companies.',
    sections: [
      {
        title: 'Must-Know Patterns',
        topics: [
          'Prefix Sum & Difference Array',
          'Two Pointer Technique',
          'Sliding Window (Fixed & Variable)',
          'Fast & Slow Pointer (Floyd\'s Cycle)',
          'Merge Intervals',
          'Top-K Elements (Heap)',
          'Binary Search on Answer',
          'Monotonic Stack / Queue',
          'Union-Find (DSU)',
          'Topological Sort',
        ]
      },
      {
        title: 'Interview Preparation',
        topics: [
          'LeetCode Top 150 Problems',
          'Company-Specific Problem Sets',
          'Mock Timed Contests',
          'Debugging & Dry-run Practice',
          'Code Optimization Strategies',
        ]
      }
    ]
  },
  {
    id: 'hr',
    category: 'HR & Soft Skills',
    icon: '🤝',
    color: '#F59E0B',
    description: 'Behavioral and communication skills that seal the offer.',
    sections: [
      {
        title: 'HR Interview Preparation',
        topics: [
          'Tell Me About Yourself',
          'Strengths & Weaknesses',
          'Why This Company?',
          'Where Do You See Yourself in 5 Years?',
          'Situational / STAR Questions',
          'Salary Negotiation',
          'Notice Period & Joining Date',
        ]
      },
      {
        title: 'Group Discussion (GD)',
        topics: [
          'GD Formats & Etiquettes',
          'Current Affairs & Hot Topics',
          'Structuring Arguments',
          'Listening & Collaborative Skills',
          'Conclusion & Summarization',
        ]
      },
      {
        title: 'Soft Skills',
        topics: [
          'Communication & Presentation',
          'Team Collaboration',
          'Time Management',
          'Problem-solving Mindset',
          'Email & Professional Writing',
          'Leadership & Initiative',
        ]
      }
    ]
  },
  {
    id: 'resume',
    category: 'Resume & Portfolio',
    icon: '📄',
    color: '#3B82F6',
    description: 'Stand out before the interview even begins.',
    sections: [
      {
        title: 'Resume Building',
        topics: [
          'ATS-Friendly Resume Format',
          'Action Verbs & Quantifying Impact',
          'Projects Section (STAR Format)',
          'Skills Matrix & Tech Stack',
          'Certifications & Awards',
          'Tailoring for Each Job Role',
        ]
      },
      {
        title: 'Portfolio & Online Presence',
        topics: [
          'GitHub Profile Optimization',
          'LinkedIn Profile & Networking',
          'Portfolio Website',
          'Personal Branding',
          'Contributing to Open Source',
          'Competitive Programming Profiles',
        ]
      }
    ]
  },
];

// Placement Category Card
const PlacementCategoryCard = ({ item, accentColor }) => {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        background: 'white',
        border: `1.5px solid ${item.color}25`,
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: open ? `0 8px 32px ${item.color}18` : '0 2px 10px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.25s',
        marginBottom: '1rem'
      }}
    >
      {/* Category Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '1.25rem 1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: open ? `${item.color}08` : 'white',
          borderBottom: open ? `1px solid ${item.color}15` : 'none',
          transition: 'background 0.2s',
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
          border: `1.5px solid ${item.color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          flexShrink: 0,
        }}>
          {item.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: '1rem',
            color: '#1E1E1E',
            marginBottom: '3px',
          }}>{item.category}</div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.4 }}>
            {item.description}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{
            background: `${item.color}15`,
            color: item.color,
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '99px',
            border: `1px solid ${item.color}30`,
          }}>
            {item.sections.reduce((acc, s) => acc + s.topics.length, 0)} topics
          </span>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: '#F9FAFB', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#9CA3AF',
          }}>
            {open ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
          </div>
        </div>
      </div>

      {/* Sections */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '1rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {item.sections.map((section, sIdx) => (
                <div key={sIdx} style={{
                  border: '1px solid #F3F4F6',
                  borderRadius: '14px',
                  overflow: 'hidden',
                }}>
                  <div
                    onClick={() => setOpenSection(openSection === sIdx ? null : sIdx)}
                    style={{
                      padding: '0.75rem 1.1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: openSection === sIdx ? '#FAFAFA' : 'white',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: item.color, flexShrink: 0
                      }} />
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#374151' }}>
                        {section.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600 }}>
                        {section.topics.length} topics
                      </span>
                      <div style={{ color: '#D1D5DB' }}>
                        {openSection === sIdx ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence initial={false}>
                    {openSection === sIdx && (
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
                          borderTop: '1px solid #F3F4F6',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '7px',
                        }}>
                          {section.topics.map((topic, tIdx) => (
                            <span key={tIdx} style={{
                              background: 'white',
                              border: `1px solid ${item.color}25`,
                              borderRadius: '8px',
                              padding: '4px 12px',
                              fontSize: '0.8rem',
                              color: '#374151',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              transition: 'all 0.15s',
                              cursor: 'default',
                            }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = `${item.color}10`;
                                e.currentTarget.style.borderColor = `${item.color}50`;
                                e.currentTarget.style.color = item.color;
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = `${item.color}25`;
                                e.currentTarget.style.color = '#374151';
                              }}
                            >
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: item.color, flexShrink: 0, display: 'inline-block' }} />
                              {topic}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── PlacementTab ─────────────────────────────────────────────────────────────
const PlacementTab = ({ accentColor }) => {
  const totalTopics = PLACEMENT_TOPICS.reduce(
    (acc, cat) => acc + cat.sections.reduce((a, s) => a + s.topics.length, 0), 0
  );

  return (
    <div>
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #1a1040 100%)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '1.75rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, #6366F180 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '20%', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, #8B5CF650 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🎯</span>
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '1.35rem', color: 'white', margin: 0, lineHeight: 1.2 }}>
                Placement Preparation Hub
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                Everything you need to crack aptitude tests & get hired at top companies
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            {[
              { label: 'Categories', value: PLACEMENT_TOPICS.length, icon: '📚' },
              { label: 'Total Topics', value: totalTopics, icon: '📌' },
              { label: 'Interview Rounds', value: 'All Covered', icon: '✅' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ fontSize: '1rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, color: 'white', fontSize: '1rem', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.7rem', marginTop: '2px' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Category Cards */}
      <div>
        {PLACEMENT_TOPICS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.06 }}
          >
            <PlacementCategoryCard item={item} accentColor={accentColor} />
          </motion.div>
        ))}
      </div>

      {/* Footer tip */}
      <div style={{
        marginTop: '0.5rem',
        padding: '1rem 1.25rem',
        background: '#FFF7ED',
        border: '1px solid #FED7AA',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        fontSize: '0.82rem',
        color: '#92400E',
        lineHeight: 1.5
      }}>
        <span style={{ fontSize: '1.1rem' }}>💡</span>
        <div>
          <strong>Pro Tip:</strong> Focus on <strong>Quantitative Aptitude</strong> and <strong>Technical DSA</strong> first — they carry the highest weightage in most placement tests. Use the <em>Practice</em> section to solve company-specific problems.
        </div>
      </div>
    </div>
  );
};

// --- Helper: type icon ---
const TypeIcon = ({ type, completed }) => {
  if (completed) return <FiCheck style={{ color: 'var(--color-success)', fontWeight: 700 }} />;
  const icons = {
    video: <FiPlayCircle />,
    reading: <FiFileText />,
    assignment: <FiCode />,
    quiz: <FiHelpCircle />,
  };
  return icons[type] || <FiPlayCircle />;
};

// --- Phase Card ---
const PhaseCard = ({ phase, phaseIndex, roadmapColor, linkedCourseId }) => {
  const [expanded, setExpanded] = useState(phaseIndex === 0 || !phase.completed ? false : false);
  const [expandedModule, setExpandedModule] = useState(null);
  const navigate = useNavigate();

  const completedModules = phase.modules.filter(m => m.completed).length;
  const phaseProgress = Math.round((completedModules / phase.modules.length) * 100);

  // Default expand the first in-progress phase
  const [isOpen, setIsOpen] = useState(
    phase.modules.some(m => !m.completed) && phaseIndex <= 2
  );

  const isLocked = phaseIndex > 0 && !phase.completed && phaseIndex >= 3;

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      {/* Timeline line + node */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '4px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: phase.completed
            ? `linear-gradient(135deg, ${roadmapColor}, ${roadmapColor}dd)`
            : 'white',
          border: `3px solid ${phase.completed ? roadmapColor : '#E5E7EB'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '0.85rem',
          color: phase.completed ? 'white' : '#9CA3AF',
          boxShadow: phase.completed ? `0 4px 14px ${roadmapColor}50` : '0 2px 8px rgba(0,0,0,0.06)',
          zIndex: 2,
          transition: 'all 0.3s ease',
          flexShrink: 0
        }}>
          {phase.completed ? <FiCheck strokeWidth={3} /> : phaseIndex + 1}
        </div>
        <div style={{
          width: '2px',
          flex: 1,
          minHeight: '24px',
          background: phase.completed
            ? `linear-gradient(180deg, ${roadmapColor}80, ${roadmapColor}20)`
            : 'linear-gradient(180deg, #E5E7EB, transparent)',
          marginTop: '4px'
        }} />
      </div>

      {/* Phase content */}
      <div style={{ flex: 1, marginBottom: '1.5rem' }}>
        {/* Phase header — clickable to expand/collapse */}
        <div
          onClick={() => setIsOpen(o => !o)}
          style={{
            background: 'white',
            border: `1px solid ${phase.completed ? roadmapColor + '40' : '#E5E7EB'}`,
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            transition: 'box-shadow 0.2s, border-color 0.2s',
            boxShadow: isOpen ? '0 8px 24px rgba(0,0,0,0.07)' : '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              {phase.completed && (
                <span style={{
                  background: roadmapColor + '15',
                  color: roadmapColor,
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 10px',
                  borderRadius: '99px',
                  border: `1px solid ${roadmapColor}30`,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>✓ Completed</span>
              )}
              {!phase.completed && phaseProgress > 0 && (
                <span style={{
                  background: '#FFF7ED',
                  color: '#FF6B00',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 10px',
                  borderRadius: '99px',
                  border: '1px solid #FF6B0030',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>⚡ In Progress</span>
              )}
              {!phase.completed && phaseProgress === 0 && (
                <span style={{
                  background: '#F9FAFB',
                  color: '#9CA3AF',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 10px',
                  borderRadius: '99px',
                  border: '1px solid #E5E7EB',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>Upcoming</span>
              )}
            </div>
            <h3 style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: '1rem',
              color: '#1E1E1E',
              margin: '0 0 0.5rem 0'
            }}>{phase.phase}</h3>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#6B7280' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiClock size={12} /> {phase.duration}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiBookOpen size={12} /> {phase.modules.length} modules
              </span>
              <span style={{ fontWeight: 600, color: roadmapColor }}>
                {completedModules}/{phase.modules.length} done
              </span>
            </div>
          </div>

          {/* Mini progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: phase.completed ? roadmapColor : '#1E1E1E' }}>
                {phaseProgress}%
              </div>
              <div style={{ width: '64px', height: '4px', background: '#F3F4F6', borderRadius: '99px', overflow: 'hidden', marginTop: '4px' }}>
                <div style={{
                  height: '100%',
                  width: `${phaseProgress}%`,
                  background: phase.completed
                    ? `linear-gradient(90deg, ${roadmapColor}, ${roadmapColor}aa)`
                    : 'linear-gradient(90deg, #FF6B00, #FF8C00)',
                  borderRadius: '99px',
                  transition: 'width 0.6s ease'
                }} />
              </div>
            </div>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF',
              transition: 'transform 0.2s'
            }}>
              {isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
            </div>
          </div>
        </div>

        {/* Expanded Module List */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                marginTop: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                paddingLeft: '0.5rem'
              }}>
                {phase.modules.map((mod, mIdx) => (
                  <div key={mod.id}>
                    {/* Module Row */}
                    <div
                      onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                      style={{
                        background: mod.completed ? '#F0FDF4' : 'white',
                        border: `1px solid ${mod.completed ? '#BBF7D0' : '#E5E7EB'}`,
                        borderRadius: '12px',
                        padding: '0.9rem 1.25rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = mod.completed ? '#86EFAC' : roadmapColor + '60';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = mod.completed ? '#BBF7D0' : '#E5E7EB';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Status icon */}
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        background: mod.completed ? '#DCFCE7' : '#F9FAFB',
                        border: `1.5px solid ${mod.completed ? '#86EFAC' : '#E5E7EB'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: mod.completed ? '#16A34A' : '#9CA3AF',
                        flexShrink: 0,
                        fontSize: '0.9rem'
                      }}>
                        <TypeIcon type={mod.type} completed={mod.completed} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: mod.completed ? '#16A34A' : '#1E1E1E',
                          marginBottom: '2px',
                          textDecoration: mod.completed ? 'line-through' : 'none',
                          textDecorationColor: '#16A34A'
                        }}>
                          {mod.title}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem', color: '#9CA3AF' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <FiClock size={10} /> {mod.duration}
                          </span>
                          <span>{mod.topics.length} topics</span>
                          <span style={{
                            background: mod.type === 'video' ? '#EFF6FF' : mod.type === 'assignment' ? '#FFF7ED' : mod.type === 'quiz' ? '#F5F3FF' : '#F0FDF4',
                            color: mod.type === 'video' ? '#3B82F6' : mod.type === 'assignment' ? '#F97316' : mod.type === 'quiz' ? '#8B5CF6' : '#16A34A',
                            padding: '1px 8px',
                            borderRadius: '99px',
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}>{mod.type}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                        {/* Go to Course button */}
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/courses/${mod.courseId}`); }}
                          style={{
                            background: roadmapColor + '15',
                            color: roadmapColor,
                            border: `1px solid ${roadmapColor}30`,
                            borderRadius: '8px',
                            padding: '5px 10px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = roadmapColor + '25'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = roadmapColor + '15'; }}
                        >
                          <FiExternalLink size={11} /> Course
                        </button>
                        <div style={{ color: '#D1D5DB' }}>
                          {expandedModule === mod.id ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Topics */}
                    <AnimatePresence>
                      {expandedModule === mod.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            marginTop: '4px',
                            marginLeft: '1rem',
                            background: '#FAFAFA',
                            border: '1px solid #F3F4F6',
                            borderRadius: '10px',
                            padding: '0.75rem 1rem',
                          }}
                        >
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            Topics Covered
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {mod.topics.map((topic, tIdx) => (
                              <span key={tIdx} style={{
                                background: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                padding: '4px 10px',
                                fontSize: '0.78rem',
                                color: '#374151',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}>
                                {mod.completed && <FiCheck size={10} style={{ color: '#16A34A' }} />}
                                {topic}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => navigate(`/courses/${mod.courseId}`)}
                            style={{
                              marginTop: '0.75rem',
                              background: `linear-gradient(135deg, ${roadmapColor}, ${roadmapColor}cc)`,
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '7px 16px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: `0 4px 12px ${roadmapColor}40`
                            }}
                          >
                            <FiPlayCircle size={14} />
                            {mod.completed ? 'Review in Course' : 'Start in Course'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================================
const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('roadmap');

  const roadmap = MOCK_DATA.roadmaps.find(r => r.id === id) || MOCK_DATA.roadmaps[0];
  const detail = MOCK_DATA.roadmapDetails[id] || MOCK_DATA.roadmapDetails['java'];

  const allModules = detail.phases.flatMap(p => p.modules);
  const completedModules = allModules.filter(m => m.completed).length;
  const totalModules = allModules.length;
  const progress = Math.round((completedModules / totalModules) * 100);

  const completedPhases = detail.phases.filter(p => p.completed).length;
  const inProgressPhase = detail.phases.find(p => p.modules.some(m => !m.completed) && p.modules.some(m => m.completed));
  const allTopics = allModules.flatMap(m => m.topics).length;

  const TABS = [
    { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
    { id: 'placement', label: 'Placement', icon: '🎯' },
  ];

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '860px', margin: '0 auto' }}>
      {/* Back link */}
      <Link
        to="/roadmaps"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '0.85rem',
          fontWeight: 500,
          marginBottom: '1.5rem',
          transition: 'color 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.color = detail.color}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <FiChevronLeft /> Back to Roadmaps
      </Link>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: `linear-gradient(135deg, white 60%, ${detail.color}08)`,
          border: `1px solid ${detail.color}25`,
          borderRadius: '24px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: `0 8px 32px ${detail.color}12`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative blur orb */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${detail.color}20 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Emoji icon */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: `linear-gradient(135deg, ${detail.color}22, ${detail.color}10)`,
            border: `2px solid ${detail.color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            flexShrink: 0
          }}>
            {detail.emoji}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                background: detail.color + '15',
                color: detail.color,
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '3px 12px',
                borderRadius: '99px',
                border: `1px solid ${detail.color}30`,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>Learning Roadmap</span>
              <span style={{
                background: '#F9FAFB',
                color: '#6B7280',
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '3px 12px',
                borderRadius: '99px',
                border: '1px solid #E5E7EB'
              }}>
                {detail.duration}
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#1E1E1E',
              margin: '0 0 0.5rem 0',
              lineHeight: 1.2
            }}>
              {detail.title}
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: 0, lineHeight: 1.6, maxWidth: '560px' }}>
              {detail.description}
            </p>
          </div>

          {/* Progress Ring */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <ProgressRing
              progress={progress}
              size={80}
              strokeWidth={6}
              valueText={`${progress}%`}
              color={detail.color}
            />
            <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600 }}>Overall Progress</span>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #F3F4F6',
          flexWrap: 'wrap'
        }}>
          {[
            { icon: <FiTarget size={14} />, label: 'Phases', value: detail.phases.length },
            { icon: <FiBookOpen size={14} />, label: 'Modules', value: totalModules },
            { icon: <FiZap size={14} />, label: 'Topics', value: allTopics },
            { icon: <FiCheck size={14} />, label: 'Completed', value: completedModules },
            { icon: <FiTrendingUp size={14} />, label: 'Phases Done', value: `${completedPhases}/${detail.phases.length}` },
          ].map((stat, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F9FAFB',
              border: '1px solid #F3F4F6',
              borderRadius: '10px',
              padding: '6px 14px',
              fontSize: '0.82rem'
            }}>
              <span style={{ color: detail.color }}>{stat.icon}</span>
              <span style={{ color: '#9CA3AF' }}>{stat.label}:</span>
              <span style={{ fontWeight: 700, color: '#1E1E1E' }}>{stat.value}</span>
            </div>
          ))}

          {/* Jump to Course button */}
          <button
            onClick={() => navigate(`/courses/${detail.linkedCourseId}`)}
            style={{
              marginLeft: 'auto',
              background: `linear-gradient(135deg, ${detail.color}, ${detail.color}cc)`,
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 18px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: `0 4px 14px ${detail.color}40`,
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${detail.color}50`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 14px ${detail.color}40`; }}
          >
            <FiPlayCircle size={14} /> Continue Learning
          </button>
        </div>
      </motion.div>

      {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: '#F3F4F6',
        borderRadius: '14px',
        padding: '4px',
        marginBottom: '1.75rem',
        width: 'fit-content',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '9px 22px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              background: activeTab === tab.id
                ? 'white'
                : 'transparent',
              color: activeTab === tab.id ? detail.color : '#6B7280',
              boxShadow: activeTab === tab.id
                ? `0 2px 10px rgba(0,0,0,0.10)`
                : 'none',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
            {tab.label}
            {tab.id === 'placement' && (
              <span style={{
                background: activeTab === 'placement' ? detail.color : '#E5E7EB',
                color: activeTab === 'placement' ? 'white' : '#9CA3AF',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '99px',
                letterSpacing: '0.03em',
              }}>NEW</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === 'roadmap' && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.25 }}
          >
            {/* Phase Timeline */}
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#1E1E1E',
                  margin: 0
                }}>
                  Learning Path
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
                  Click any phase or module to expand
                </span>
              </div>

              <div>
                {detail.phases.map((phase, idx) => (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                  >
                    <PhaseCard
                      phase={phase}
                      phaseIndex={idx}
                      roadmapColor={detail.color}
                      linkedCourseId={detail.linkedCourseId}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'placement' && (
          <motion.div
            key="placement"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            <PlacementTab accentColor={detail.color} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoadmapDetail;
