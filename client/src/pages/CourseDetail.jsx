import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  FiPlayCircle, FiCheckCircle, FiLock, FiClock, FiStar,
  FiAward, FiFileText, FiCode, FiHelpCircle, FiVideo,
  FiChevronDown, FiChevronUp, FiExternalLink, FiBookOpen,
  FiUsers, FiBarChart2, FiGlobe, FiCheck
} from 'react-icons/fi';
import { MOCK_DATA } from '../data/mockData';
import toast from 'react-hot-toast';

/* ─── Curricula ─────────────────────────────────────────────────────────────── */
const dsaCurriculum = [
  {
    section: 'Section 1: Introduction to Data Structures',
    duration: '1h 20m', expanded: true,
    lessons: [
      { title: 'What are Data Structures?', duration: '15:24', completed: true, type: 'video', youtubeId: 'bum_19loj9A', desc: 'Learn about linear and non-linear data structures and their real-world applications.' },
      { title: 'Time & Space Complexity (Big O)', duration: '28:10', completed: true, type: 'video', youtubeId: '__vX2sjlpXU', desc: 'Analyze and compare algorithm efficiency using Big O complexity models.' },
      { title: 'Memory Allocation — Stack vs Heap', duration: '20:00', completed: false, type: 'reading', content: '### Memory Allocation in Programming\n\nMemory is allocated in two key segments:\n\n1. **Stack Memory** — Fast, managed automatically by the compiler. Used for static allocations and local variables.\n\n2. **Heap Memory** — Dynamic space managed manually or via garbage collector. Used for dynamic arrays and object instances.' },
    ]
  },
  {
    section: 'Section 2: Arrays & Strings', duration: '3h 45m', expanded: false,
    lessons: [
      { title: 'Arrays Fundamentals', duration: '30:00', completed: false, type: 'video', youtubeId: 'QJNwK2uJyGs', desc: 'Master array storage, insertion, deletion, and traversal.' },
      { title: 'Two Pointers Technique', duration: '45:00', completed: false, type: 'video', youtubeId: 'On03HWe2tZM', desc: 'Optimize search patterns using dual boundary pointers.' },
      { title: 'Sliding Window Pattern', duration: '50:00', completed: false, type: 'video', youtubeId: 'MK-NZ4hN7rs', desc: 'Reduce O(N²) loops to linear runtime using sliding window.' },
      { title: 'Arrays Practice — Two Sum', duration: '1:00:00', completed: false, type: 'assignment', problemId: 1, problemTitle: 'Two Sum', desc: 'Identify indices of two array elements summing to a target value.' },
    ]
  },
  {
    section: 'Section 3: Linked Lists', duration: '2h 30m', expanded: false,
    lessons: [
      { title: 'Singly Linked Lists', duration: '40:00', completed: false, type: 'video', youtubeId: 'njTh_OwMljA', desc: 'Node allocations, next pointers, and traversal algorithms.' },
      { title: 'Doubly & Circular Linked Lists', duration: '50:00', completed: false, type: 'video', youtubeId: 'Ast5seuIAaE', desc: 'Traverse forwards and backwards using prev/next links.' },
      { title: 'Fast & Slow Pointers', duration: '30:00', completed: false, type: 'video', youtubeId: 'gBTe7lFR3vc', desc: 'Hare and Tortoise model for cycles and midpoints.' },
      { title: 'Quiz: Linked Lists', duration: '10:00', completed: false, type: 'quiz', question: 'Time complexity to insert at the beginning of a Singly Linked List?', options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'], answerIdx: 0 },
    ]
  }
];

const aptitudeCurriculum = [
  {
    section: 'Section 1: Quantitative Foundations', duration: '4h 15m', expanded: true,
    lessons: [
      { title: 'Intro to Quantitative Aptitude', duration: '20:00', completed: true, type: 'video', youtubeId: 'JZSPBtGERXs', desc: 'Placement exam formats, speed strategies, and arithmetic importance.' },
      { title: 'Speed Maths & Calculation Tricks', duration: '40:00', completed: true, type: 'video', youtubeId: 'kMBj2fp52tA', desc: 'Vedic math tricks, multiplication shortcuts, and division estimators.' },
      { title: 'Number Systems & Properties', duration: '1:15:00', completed: false, type: 'video', youtubeId: 'WUvTyaaNkzM', desc: 'Prime numbers, divisibility, LCM/HCF, remainders.' },
      { title: 'Percentages, Profit & Loss', duration: '2:00:00', completed: false, type: 'video', youtubeId: 'aircAruvnKk', desc: 'Pricing, discount ratios, cost/sell margins.' },
    ]
  },
  {
    section: 'Section 2: Arithmetic Word Problems', duration: '6h 30m', expanded: false,
    lessons: [
      { title: 'Ratio & Proportion', duration: '45:00', completed: false, type: 'video', youtubeId: 'HAnw168huqA', desc: 'Proportion metrics, shares, mixtures.' },
      { title: 'Time, Speed and Distance', duration: '1:45:00', completed: false, type: 'video', youtubeId: 'Kas0tIxDvrg', desc: 'Relative speeds, train overtaking, river flow equations.' },
      { title: 'Practice Test — Palindrome Number', duration: '2:00:00', completed: false, type: 'assignment', problemId: 9, problemTitle: 'Palindrome Number', desc: 'Solidify quantitative reasoning with coding practice.' },
    ]
  },
  {
    section: 'Section 3: Logical Reasoning', duration: '5h', expanded: false,
    lessons: [
      { title: 'Syllogisms & Venn Diagrams', duration: '1:30:00', completed: false, type: 'video', youtubeId: 'RKHx8dYrfaA', desc: 'Evaluate logical validity using visual Venn intersections.' },
      { title: 'Quiz: Reasoning Ability', duration: '10:00', completed: false, type: 'quiz', question: 'If "STATION" is coded as "URCVMQP", what will be the code for "RAILWAY"?', options: ['TCKNXCA', 'TCKNXAC', 'TCLOYAB', 'SCKNYBD'], answerIdx: 0 },
    ]
  }
];

const webDevCurriculum = [
  {
    section: 'Section 1: Frontend & React.js', duration: '3h 15m', expanded: true,
    lessons: [
      { title: 'ES6+ Javascript Fundamentals', duration: '35:00', completed: true, type: 'video', youtubeId: 'W6NZfCO5SIk', desc: 'Arrow functions, destructuring, async/await.' },
      { title: 'React.js Crash Course', duration: '1:10:00', completed: true, type: 'video', youtubeId: 'w7ejDZ8SWv8', desc: 'Components, props, state, and hooks.' },
      { title: 'Reading: Virtual DOM & Reconciliation', duration: '30:00', completed: false, type: 'reading', content: '### Virtual DOM and Diffing Algorithm\n\nReact maintains an in-memory representation called the **Virtual DOM**.\n\n1. React creates a new virtual representation on state change.\n2. It compares with the previous snapshot using an O(N) **diffing algorithm**.\n3. Only modified nodes are updated in the real DOM.' },
    ]
  },
  {
    section: 'Section 2: Node.js & REST APIs', duration: '4h', expanded: false,
    lessons: [
      { title: 'Node.js & Express Crash Course', duration: '1:15:00', completed: false, type: 'video', youtubeId: 'fBNz5xF-Kx4', desc: 'Route parameters, response bodies, middleware.' },
      { title: 'REST API Design Assignment', duration: '2:00:00', completed: false, type: 'assignment', problemId: 2, problemTitle: 'Add Two Numbers', desc: 'Practice linked list sums in the interactive IDE.' },
      { title: 'Quiz: REST & Routing', duration: '10:00', completed: false, type: 'quiz', question: 'Which HTTP method partially updates an existing resource?', options: ['GET', 'POST', 'PUT', 'PATCH'], answerIdx: 3 },
    ]
  }
];

const systemDesignCurriculum = [
  {
    section: 'Section 1: Scaling & Load Balancing', duration: '4h 30m', expanded: true,
    lessons: [
      { title: 'System Design Fundamentals', duration: '1:10:00', completed: true, type: 'video', youtubeId: 'xpDnVSmNFX0', desc: 'CPU/RAM bottlenecks vs horizontal node clusters.' },
      { title: 'Load Balancers Explained', duration: '1:45:00', completed: false, type: 'video', youtubeId: 'K0Ta65OqQkY', desc: 'Round-robin, IP hash, least connections, Nginx configs.' },
      { title: 'Reading: CAP Theorem', duration: '35:00', completed: false, type: 'reading', content: '### CAP Theorem\n\nA distributed database can guarantee at most two of:\n\n1. **Consistency** — Every read gets the most recent write.\n2. **Availability** — Every node returns a non-error response.\n3. **Partition Tolerance** — System operates despite message drops.' },
    ]
  },
  {
    section: 'Section 2: Database Partitioning & Cache', duration: '5h 15m', expanded: false,
    lessons: [
      { title: 'Sharding & Replication Models', duration: '2:00:00', completed: false, type: 'video', youtubeId: '5faMjKuB9bc', desc: 'Hash/range partitioning, multi-leader replication.' },
      { title: 'Caching Assignment', duration: '2:15:00', completed: false, type: 'assignment', problemId: 3, problemTitle: 'Longest Substring Without Repeating Characters', desc: 'Sliding window algorithm representing sub-cache keys.' },
      { title: 'Quiz: Caching & Partitioning', duration: '10:00', completed: false, type: 'quiz', question: 'What eviction strategy discards least recently used items?', options: ['FIFO', 'LRU', 'LFU', 'MRU'], answerIdx: 1 },
    ]
  }
];

/* ─── Quiz Widget ─────────────────────────────────────────────────────────── */
const QuizWidget = ({ quiz }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { setSelected(null); setSubmitted(false); }, [quiz]);

  const submit = () => {
    if (selected === null) { toast.error('Pick an option first!'); return; }
    setSubmitted(true);
    selected === quiz.answerIdx ? toast.success('Correct! 🎉') : toast.error('Wrong — try again!');
  };

  return (
    <div className="quiz-widget">
      <p className="quiz-question">{quiz.question}</p>
      <div className="quiz-options">
        {quiz.options.map((opt, idx) => {
          let cls = 'quiz-option';
          if (selected === idx && !submitted) cls += ' selected';
          if (submitted && idx === quiz.answerIdx) cls += ' correct';
          else if (submitted && selected === idx) cls += ' wrong';
          return (
            <button key={idx} className={cls} disabled={submitted} onClick={() => setSelected(idx)}>
              <span className="quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
              <span>{opt}</span>
              {submitted && idx === quiz.answerIdx && <FiCheck className="quiz-check" />}
            </button>
          );
        })}
      </div>
      {!submitted
        ? <button className="btn btn-primary btn-sm" onClick={submit}>Check Answer</button>
        : <button className="btn btn-ghost btn-sm" onClick={() => { setSelected(null); setSubmitted(false); }}>Try Again</button>
      }
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const CourseDetail = () => {
  const { id } = useParams();
  const course = MOCK_DATA.courses.find(c => c.id.toString() === id) || MOCK_DATA.courses[0];

  const getCurriculum = () => {
    if (course.category === 'Aptitude') return aptitudeCurriculum;
    if (course.category === 'Web Dev') return webDevCurriculum;
    if (course.category === 'System Design') return systemDesignCurriculum;
    return dsaCurriculum;
  };

  const [curriculum, setCurriculum] = useState(getCurriculum);
  const [activeLesson, setActiveLesson] = useState(getCurriculum()[0].lessons[0]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fresh = getCurriculum();
    setCurriculum(fresh);
    setActiveLesson(fresh[0].lessons[0]);
  }, [id]);

  const allLessons = curriculum.flatMap(s => s.lessons);
  const completedCount = allLessons.filter(l => l.completed).length;
  const progress = Math.round((completedCount / allLessons.length) * 100);

  const toggleSection = (idx) => {
    setCurriculum(prev => prev.map((s, i) => i === idx ? { ...s, expanded: !s.expanded } : s));
  };

  const markComplete = () => {
    setCurriculum(prev => prev.map(s => ({
      ...s,
      lessons: s.lessons.map(l => l.title === activeLesson.title ? { ...l, completed: true } : l)
    })));
    setActiveLesson(prev => ({ ...prev, completed: true }));
    toast.success('Lesson marked as complete!');
  };

  const getIcon = (type, completed, isActive) => {
    if (completed) return <span className="lesson-icon done"><FiCheckCircle /></span>;
    if (type === 'video') return <span className={`lesson-icon ${isActive ? 'active' : ''}`}><FiPlayCircle /></span>;
    if (type === 'reading') return <span className="lesson-icon reading"><FiFileText /></span>;
    if (type === 'assignment') return <span className="lesson-icon assignment"><FiCode /></span>;
    if (type === 'quiz') return <span className="lesson-icon quiz"><FiHelpCircle /></span>;
    return <span className="lesson-icon"><FiLock /></span>;
  };

  const categoryThumb = {
    'dsa-thumb': 'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?q=80&w=800&auto=format&fit=crop',
    'mern-thumb': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    'sd-thumb': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    'apti-thumb': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
  };
  const thumb = categoryThumb[course.image] || categoryThumb['mern-thumb'];

  return (
    <div className="course-page">

      {/* ── Video + Sidebar Grid ── */}
      <div className="course-player-layout">

        {/* LEFT: Video Panel */}
        <div className="course-player-main">

          {/* Video Player */}
          <div className="video-wrapper">
            {activeLesson.type === 'video' && activeLesson.youtubeId ? (
              <div className="video-player-container">
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${activeLesson.youtubeId}`}
                  width="100%"
                  height="100%"
                  controls
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  config={{ youtube: { playerVars: { modestbranding: 1, rel: 0 } } }}
                />
              </div>
            ) : (
              <div className="video-placeholder">
                <img src={thumb} alt={course.title} className="video-thumb-img" />
                <div className="video-placeholder-overlay">
                  {activeLesson.type === 'reading' && <FiBookOpen size={48} />}
                  {activeLesson.type === 'assignment' && <FiCode size={48} />}
                  {activeLesson.type === 'quiz' && <FiHelpCircle size={48} />}
                  <p>{activeLesson.type === 'reading' ? 'Reading Article' : activeLesson.type === 'assignment' ? 'Coding Assignment' : 'Knowledge Quiz'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Title Bar */}
          <div className="lesson-title-bar">
            <div className="lesson-title-left">
              <span className={`lesson-type-badge type-${activeLesson.type}`}>
                {activeLesson.type === 'video' && '▶ Video'}
                {activeLesson.type === 'reading' && '📖 Reading'}
                {activeLesson.type === 'assignment' && '💻 Assignment'}
                {activeLesson.type === 'quiz' && '❓ Quiz'}
              </span>
              <h1 className="lesson-main-title">{activeLesson.title}</h1>
            </div>
            <div className="lesson-title-actions">
              {!activeLesson.completed && (
                <button className="btn btn-sm btn-secondary" onClick={markComplete}>
                  <FiCheck /> Mark Complete
                </button>
              )}
              {activeLesson.completed && (
                <span className="completed-badge"><FiCheckCircle /> Completed</span>
              )}
              {activeLesson.type === 'video' && activeLesson.youtubeId && (
                <a
                  href={`https://www.youtube.com/watch?v=${activeLesson.youtubeId}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-sm btn-ghost"
                >
                  <FiExternalLink /> YouTube
                </a>
              )}
            </div>
          </div>

          {/* Content Tabs */}
          <div className="course-tabs-bar">
            {['overview', 'content', 'notes'].map(tab => (
              <button
                key={tab}
                className={`course-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="course-tab-content">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="overview-tab">
                {/* Description */}
                <div className="overview-section">
                  <h3>About this lesson</h3>
                  <p>{activeLesson.desc || 'Watch the lecture and follow along. Complete quizzes and assignments to reinforce your understanding.'}</p>
                </div>

                {/* Reading content */}
                {activeLesson.type === 'reading' && activeLesson.content && (
                  <div className="reading-content">
                    <div className="reading-body">{activeLesson.content}</div>
                    <button className="btn btn-primary btn-sm" onClick={markComplete}>
                      <FiCheck /> Mark as Read
                    </button>
                  </div>
                )}

                {/* Assignment CTA */}
                {activeLesson.type === 'assignment' && (
                  <div className="assignment-cta">
                    <div className="assignment-cta-icon">💻</div>
                    <div>
                      <h4>Coding Challenge</h4>
                      <p>Solve <strong>{activeLesson.problemTitle}</strong> in the interactive IDE to complete this lesson.</p>
                    </div>
                    <Link to={`/practice/${activeLesson.problemId}`} className="btn btn-primary">
                      Open IDE →
                    </Link>
                  </div>
                )}

                {/* Quiz */}
                {activeLesson.type === 'quiz' && (
                  <div>
                    <h3 className="mb-4">Knowledge Check</h3>
                    <QuizWidget quiz={activeLesson} />
                  </div>
                )}

                {/* Study tips for videos */}
                {activeLesson.type === 'video' && (
                  <div className="study-tips">
                    <h4>💡 Study Tips</h4>
                    <ul>
                      <li>Pause and rewind whenever a concept is unclear.</li>
                      <li>Code along with the video for best retention.</li>
                      <li>Take notes on key patterns and time complexities.</li>
                      <li>Attempt the linked practice problems after each section.</li>
                    </ul>
                  </div>
                )}

                {/* Course meta */}
                <div className="overview-meta-grid">
                  <div className="meta-item"><FiUsers /><span><strong>{course.students}</strong> students enrolled</span></div>
                  <div className="meta-item"><FiStar style={{ color: '#f59e0b' }} /><span><strong>{course.rating}</strong> average rating</span></div>
                  <div className="meta-item"><FiClock /><span><strong>{course.duration}</strong> total content</span></div>
                  <div className="meta-item"><FiBarChart2 /><span><strong>Beginner</strong> level</span></div>
                  <div className="meta-item"><FiGlobe /><span><strong>English</strong> language</span></div>
                  <div className="meta-item"><FiAward /><span><strong>Certificate</strong> on completion</span></div>
                </div>
              </div>
            )}

            {/* CONTENT TAB — shows full curriculum inline */}
            {activeTab === 'content' && (
              <div className="content-tab">
                <div className="content-tab-header">
                  <span>{allLessons.length} lessons</span>
                  <span>·</span>
                  <span>{curriculum.reduce((a, s) => a + s.duration, '')} total</span>
                  <span>·</span>
                  <span>{completedCount} completed</span>
                </div>
                {curriculum.map((section, sIdx) => (
                  <div key={sIdx} className="curriculum-section-inline">
                    <button className="curriculum-section-header" onClick={() => toggleSection(sIdx)}>
                      <span className="curriculum-section-name">{section.section}</span>
                      <span className="curriculum-section-meta">{section.lessons.length} lessons · {section.duration}</span>
                      {section.expanded ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    {section.expanded && (
                      <div className="curriculum-lessons-list">
                        {section.lessons.map((lesson, lIdx) => (
                          <button
                            key={lIdx}
                            className={`curriculum-lesson-row ${activeLesson.title === lesson.title ? 'active' : ''} ${lesson.completed ? 'completed' : ''}`}
                            onClick={() => setActiveLesson(lesson)}
                          >
                            {getIcon(lesson.type, lesson.completed, activeLesson.title === lesson.title)}
                            <span className="lesson-row-title">{lesson.title}</span>
                            <span className="lesson-row-duration">{lesson.duration}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab === 'notes' && (
              <div className="notes-tab">
                <h3>Your Notes</h3>
                <p className="text-muted mb-4">Jot down key takeaways from this lesson.</p>
                <textarea
                  className="notes-textarea"
                  placeholder="Start typing your notes here..."
                  rows={10}
                />
                <button className="btn btn-primary btn-sm" onClick={() => toast.success('Notes saved!')}>Save Notes</button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Course Sidebar */}
        <aside className="course-sidebar">

          {/* Progress Card */}
          <div className="sidebar-progress-card">
            <div className="sidebar-progress-header">
              <span>Your Progress</span>
              <strong>{progress}%</strong>
            </div>
            <div className="sidebar-progress-bar">
              <div className="sidebar-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="sidebar-progress-label">{completedCount} of {allLessons.length} lessons complete</p>
          </div>

          {/* Course Curriculum */}
          <div className="sidebar-curriculum">
            <div className="sidebar-curriculum-title">Course Content</div>
            {curriculum.map((section, sIdx) => (
              <div key={sIdx} className="sidebar-section">
                <button className="sidebar-section-header" onClick={() => toggleSection(sIdx)}>
                  <span>{section.section}</span>
                  {section.expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                </button>
                {section.expanded && (
                  <div className="sidebar-lessons">
                    {section.lessons.map((lesson, lIdx) => {
                      const isActive = activeLesson.title === lesson.title;
                      return (
                        <button
                          key={lIdx}
                          className={`sidebar-lesson ${isActive ? 'active' : ''} ${lesson.completed ? 'done' : ''}`}
                          onClick={() => setActiveLesson(lesson)}
                        >
                          <span className="sidebar-lesson-icon">
                            {lesson.completed
                              ? <FiCheckCircle size={13} />
                              : lesson.type === 'video'
                                ? <FiPlayCircle size={13} />
                                : lesson.type === 'reading'
                                  ? <FiFileText size={13} />
                                  : lesson.type === 'assignment'
                                    ? <FiCode size={13} />
                                    : <FiHelpCircle size={13} />
                            }
                          </span>
                          <span className="sidebar-lesson-title">{lesson.title}</span>
                          <span className="sidebar-lesson-dur">{lesson.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Course Info Card */}
          <div className="sidebar-info-card">
            <h4>This course includes</h4>
            <ul className="sidebar-features">
              <li><FiVideo /> {allLessons.filter(l => l.type === 'video').length} video lessons</li>
              <li><FiCode /> {allLessons.filter(l => l.type === 'assignment').length} coding assignments</li>
              <li><FiHelpCircle /> {allLessons.filter(l => l.type === 'quiz').length} knowledge quizzes</li>
              <li><FiFileText /> {allLessons.filter(l => l.type === 'reading').length} reading articles</li>
              <li><FiAward /> Certificate of completion</li>
              <li><FiGlobe /> Lifetime access</li>
            </ul>
          </div>

        </aside>
      </div>

      {/* ── Course Header (below player) ── */}
      <div className="course-header-strip">
        <div className="course-header-strip-inner">
          <div className="course-header-left">
            <div className="course-breadcrumb">
              <Link to="/courses">Courses</Link>
              <span>/</span>
              <span>{course.category}</span>
              <span>/</span>
              <span>{course.title}</span>
            </div>
            <div className="course-header-meta">
              <span className="course-category-pill">{course.category}</span>
              <div className="course-rating-row">
                <FiStar style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                <strong>{course.rating}</strong>
                <span>({course.students} students)</span>
              </div>
              <span className="course-meta-sep">·</span>
              <span><FiClock /> {course.duration}</span>
              <span className="course-meta-sep">·</span>
              <span>By <strong>{course.instructor}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
