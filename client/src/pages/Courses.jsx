import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_DATA } from '../data/mockData';
import CourseCard from '../components/courses/CourseCard';
import {
  Search, Play, Sparkles, Code2, Globe, Cpu, Database,
  BookOpen, Zap, ChevronRight, Award, Clock, Users, Star, SlidersHorizontal
} from 'lucide-react';

/* ── Category meta ─────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: 'All',
    label: 'All Courses',
    icon: Zap,
    gradient: 'from-teal-600 to-cyan-500',
    desc: 'Browse everything'
  },
  {
    id: 'DSA',
    label: 'Data Structures & Algorithms',
    icon: Code2,
    gradient: 'from-teal-600 to-teal-400',
    emoji: '🧠',
    desc: 'Master problem solving'
  },
  {
    id: 'Web Dev',
    label: 'Web Development',
    icon: Globe,
    gradient: 'from-cyan-500 to-teal-400',
    emoji: '🌐',
    desc: 'Build modern web apps'
  },
  {
    id: 'System Design',
    label: 'System Design',
    icon: Database,
    gradient: 'from-purple-600 to-indigo-500',
    emoji: '🏗️',
    desc: 'Scale to millions'
  },
  {
    id: 'Aptitude',
    label: 'Aptitude & Reasoning',
    icon: BookOpen,
    gradient: 'from-amber-600 to-orange-500',
    emoji: '📐',
    desc: 'Ace placement tests'
  },
  {
    id: 'AI/ML',
    label: 'AI & Machine Learning',
    icon: Cpu,
    gradient: 'from-violet-600 to-fuchsia-500',
    emoji: '🤖',
    desc: 'Build intelligent systems'
  },
  {
    id: 'DevOps',
    label: 'DevOps & Cloud',
    icon: Zap,
    gradient: 'from-rose-600 to-red-500',
    emoji: '⚙️',
    desc: 'Ship at scale'
  },
];

const FEATURED = [
  {
    id: 2,
    title: 'MERN Stack Masterclass',
    subtitle: 'Build 5 production apps from scratch',
    badge: '🏆 #1 Bestseller',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1800&auto=format&fit=crop',
    cta: '/courses/2',
    gradient: 'from-slate-950/95 via-slate-950/80 to-teal-500/20'
  },
  {
    id: 1,
    title: 'Complete DSA for Placements',
    subtitle: '300+ curated problems with video solutions',
    badge: '🔥 Top Rated',
    image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=1800&auto=format&fit=crop',
    cta: '/courses/1',
    gradient: 'from-slate-950/95 via-slate-950/80 to-cyan-500/20'
  },
  {
    id: 5,
    title: 'AI / Machine Learning Foundation',
    subtitle: 'By Andrew Ng — Learn ML from scratch',
    badge: '🤖 New & Hot',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1800&auto=format&fit=crop',
    cta: '/courses/5',
    gradient: 'from-slate-950/95 via-slate-950/80 to-violet-500/20'
  },
];

/* ── Stats ─────────────────────────────────────────────────────── */
const STATS = [
  { icon: '📚', value: '180+', label: 'Total Lessons' },
  { icon: '🎓', value: '18',   label: 'Expert Courses' },
  { icon: '⭐', value: '4.9',  label: 'Avg Rating' },
  { icon: '👥', value: '800k', label: 'Learners' },
];

/* ── Component ─────────────────────────────────────────────────── */
const Courses = () => {
  const { courses } = MOCK_DATA;
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const autoRef = useRef(null);

  // Featured carousel auto-advance
  useEffect(() => {
    autoRef.current = setInterval(() => setFeaturedIdx(i => (i + 1) % FEATURED.length), 4500);
    return () => clearInterval(autoRef.current);
  }, []);

  const resetTimer = (nextIdx) => {
    clearInterval(autoRef.current);
    setFeaturedIdx(nextIdx);
    autoRef.current = setInterval(() => setFeaturedIdx(i => (i + 1) % FEATURED.length), 4500);
  };

  // Filtered courses
  const filteredCourses = courses.filter(c => {
    const matchCat   = selectedCategory === 'All' || c.category === selectedCategory;
    const matchLevel = levelFilter === 'All' || c.level === levelFilter;
    const matchSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchLevel && matchSearch;
  });

  const catMeta = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];
  const feat = FEATURED[featuredIdx];

  return (
    <div className="pb-16 space-y-8">

      {/* ── Featured Hero Carousel ── */}
      <div className="relative h-[380px] rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={feat.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img src={feat.image} alt={feat.title} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r ${feat.gradient}`} />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-12">
          <motion.div key={feat.id + 'b'} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-yellow-400 font-bold text-xs mb-4">
              {feat.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3 max-w-xl font-display">{feat.title}</h1>
            <p className="text-white/70 text-sm sm:text-base mb-6 max-w-lg font-medium">{feat.subtitle}</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(feat.cta)}
                className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-full px-6 py-3 font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-500/30 hover:opacity-95 transition-opacity"
              >
                <Play size={15} fill="white" /> Start Watching
              </button>
              <button
                onClick={() => navigate(feat.cta)}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full px-6 py-3 font-semibold text-sm hover:bg-white/15 transition-all"
              >
                More Info
              </button>
            </div>
          </motion.div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-6 right-8 z-20 flex gap-2">
          {FEATURED.map((_, i) => (
            <button
              key={i}
              onClick={() => resetTimer(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === featuredIdx ? 'w-6 bg-teal-500' : 'w-2 bg-white/35'}`}
            />
          ))}
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border-none border border-border rounded-2xl p-5 flex items-center gap-4 shadow-card"
          >
            <span className="text-3xl">{s.icon}</span>
            <div>
              <div className="text-xl font-bold text-text-main font-display leading-tight">{s.value}</div>
              <div className="text-xs font-medium text-slate-400 dark:text-text-muted mt-1">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-muted" />
          <input
            type="text"
            placeholder="Search courses or instructors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2.5 text-sm rounded-xl
              bg-card border-none
              border border-gray-200 dark:border-slate-800
              text-slate-950 dark:text-slate-50
              placeholder:text-slate-400 dark:placeholder:text-text-muted
              focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500
              transition-all shadow-sm
            "
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal size={14} className="text-slate-400 dark:text-text-muted" />
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="
              w-full sm:w-44 px-3 py-2.5 text-sm rounded-xl
              bg-card border-none
              border border-gray-200 dark:border-slate-800
              text-slate-950 dark:text-slate-50
              focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500
              cursor-pointer shadow-sm
            "
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => {
          const count = cat.id === 'All' ? courses.length : courses.filter(c => c.category === cat.id).length;
          const active = selectedCategory === cat.id;
          const Icon = cat.icon;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold
                border transition-all duration-200 flex-shrink-0
                ${active
                  ? `bg-gradient-to-r ${cat.gradient} text-white border-transparent shadow-lg shadow-teal-500/10`
                  : 'bg-card border-none border-gray-200 dark:border-slate-800 text-text-muted dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400'
                }
              `}
            >
              <Icon size={14} className={active ? 'text-white' : 'text-slate-400'} />
              <span>{cat.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ── Section Header ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${catMeta.gradient}`} />
                <h2 className="text-xl font-bold text-text-main font-display">
                  {selectedCategory === 'All' ? 'All Courses' : catMeta.label}
                </h2>
              </div>
              <p className="text-xs text-slate-400 dark:text-text-muted mt-1 ml-3">
                {filteredCourses.length} courses {searchQuery ? `matching "${searchQuery}"` : 'available'}
              </p>
            </div>
            {levelFilter !== 'All' && (
              <button
                onClick={() => setLevelFilter('All')}
                className="text-xs bg-teal-50 dark:bg-teal-900/25 border border-teal-100 dark:border-teal-900/50 text-teal-700 dark:text-teal-400 px-3.5 py-1.5 rounded-full hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors"
              >
                ✕ Clear "{levelFilter}" filter
              </button>
            )}
          </div>

          {/* ── Course Grid ── */}
          {filteredCourses.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <CourseCard course={course} onClick={() => navigate(`/courses/${course.id}`)} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-card border-none border border-border rounded-3xl">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-slate-950 dark:text-white font-semibold">No courses found</h3>
              <p className="text-slate-400 dark:text-text-muted text-sm mt-1">Try adjusting your search or filters</p>
              <button
                onClick={() => { setSearchQuery(''); setLevelFilter('All'); }}
                className="mt-4 bg-teal-50 dark:bg-teal-900/25 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50 px-5 py-2 rounded-full font-bold text-xs hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* ── Browse by Category ── */}
          {selectedCategory === 'All' && filteredCourses.length > 0 && (
            <div className="pt-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-teal-500 to-cyan-500" />
                <div>
                  <h3 className="text-lg font-bold text-text-main font-display">Browse by Category</h3>
                  <p className="text-xs text-slate-400 dark:text-text-muted mt-0.5">Click a track to explore its courses</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {CATEGORIES.filter(c => c.id !== 'All').map((cat) => {
                  const catCourses = courses.filter(c => c.category === cat.id);
                  const Icon = cat.icon;
                  return (
                    <motion.div
                      key={cat.id}
                      whileHover={{ y: -4, shadow: 'md' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="
                        cursor-pointer rounded-2xl overflow-hidden flex flex-col
                        bg-card border-none border border-border
                        hover:border-teal-200 dark:hover:border-teal-800 transition-all duration-200 shadow-sm
                      "
                    >
                      <div className={`h-1 bg-gradient-to-r ${cat.gradient}`} />
                      <div className="p-5 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br ${cat.gradient} shadow-md`}>
                          <Icon size={20} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-text-main text-sm truncate">{cat.label}</h4>
                          <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border border-teal-100/50 dark:border-teal-900/50">
                            {catCourses.length} Courses
                          </span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Courses;
