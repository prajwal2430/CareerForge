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
    gradient: 'from-[#0F766E] to-[#14B8A6]',
    desc: 'Browse everything'
  },
  {
    id: 'DSA',
    label: 'Data Structures & Algorithms',
    icon: Code2,
    gradient: 'from-[#0F766E] to-[#14B8A6]',
    emoji: '🧠',
    desc: 'Master problem solving'
  },
  {
    id: 'Web Dev',
    label: 'Web Development',
    icon: Globe,
    gradient: 'from-[#0F766E] to-[#14B8A6]',
    emoji: '🌐',
    desc: 'Build modern web apps'
  },
  {
    id: 'System Design',
    label: 'System Design',
    icon: Database,
    gradient: 'from-[#0F766E] to-[#14B8A6]',
    emoji: '🏗️',
    desc: 'Scale to millions'
  },
  {
    id: 'Aptitude',
    label: 'Aptitude & Reasoning',
    icon: BookOpen,
    gradient: 'from-[#0F766E] to-[#14B8A6]',
    emoji: '📐',
    desc: 'Ace placement tests'
  },
  {
    id: 'AI/ML',
    label: 'AI & Machine Learning',
    icon: Cpu,
    gradient: 'from-[#0F766E] to-[#14B8A6]',
    emoji: '🤖',
    desc: 'Build intelligent systems'
  },
  {
    id: 'DevOps',
    label: 'DevOps & Cloud',
    icon: Zap,
    gradient: 'from-[#0F766E] to-[#14B8A6]',
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
    gradient: 'from-[#1C1917]/95 via-[#1C1917]/80 to-[#0F766E]/20'
  },
  {
    id: 1,
    title: 'Complete DSA for Placements',
    subtitle: '300+ curated problems with video solutions',
    badge: '🔥 Top Rated',
    image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=1800&auto=format&fit=crop',
    cta: '/courses/1',
    gradient: 'from-[#1C1917]/95 via-[#1C1917]/80 to-[#0F766E]/20'
  },
  {
    id: 5,
    title: 'AI / Machine Learning Foundation',
    subtitle: 'By Andrew Ng — Learn ML from scratch',
    badge: '🤖 New & Hot',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1800&auto=format&fit=crop',
    cta: '/courses/5',
    gradient: 'from-[#1C1917]/95 via-[#1C1917]/80 to-[#0F766E]/20'
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
    <div className="pb-16 space-y-8 max-w-[1400px] mx-auto">

      {/* ── Featured Hero Carousel ── */}
      <div className="relative h-[380px] rounded-3xl overflow-hidden shadow-sm border border-[#E7E5E4]">
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

        {/* Hero Content Overlay */}
        <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end h-full max-w-2xl text-white">
          <motion.div
            key={`content-${feat.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-[#0F766E]/60 text-[#CCFBF1] border border-[#0F766E]/40 mb-3 backdrop-blur-md">
              {feat.badge}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display leading-tight mb-2">
              {feat.title}
            </h1>
            <p className="text-stone-300 text-sm md:text-base mb-6">
              {feat.subtitle}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(feat.cta)}
                className="bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl px-6 py-3 font-bold text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Play size={15} fill="white" /> Start Watching
              </button>
              <button
                onClick={() => navigate(feat.cta)}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl px-6 py-3 font-semibold text-sm hover:bg-white/15 transition-all cursor-pointer"
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
              className={`h-2 rounded-full transition-all duration-300 ${i === featuredIdx ? 'w-6 bg-[#0F766E]' : 'w-2 bg-white/35'}`}
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
            className="bg-white border border-[#E7E5E4] rounded-2xl p-5 flex items-center gap-4 shadow-xs"
          >
            <span className="text-3xl">{s.icon}</span>
            <div>
              <div className="text-xl font-bold text-[#1C1917] font-display leading-tight">{s.value}</div>
              <div className="text-xs font-medium text-[#78716C] mt-1">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
          <input
            type="text"
            placeholder="Search courses or instructors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2.5 text-sm rounded-xl
              bg-white
              border border-[#E7E5E4]
              text-[#1C1917]
              placeholder:text-[#A8A29E]
              focus:outline-none focus:ring-2 focus:ring-[#0F766E]/15 focus:border-[#0F766E]
              transition-all shadow-xs
            "
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal size={14} className="text-[#78716C]" />
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="
              w-full sm:w-44 px-3 py-2.5 text-sm rounded-xl
              bg-white
              border border-[#E7E5E4]
              text-[#1C1917]
              focus:outline-none focus:ring-2 focus:ring-[#0F766E]/15 focus:border-[#0F766E]
              cursor-pointer shadow-xs
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
                border transition-all duration-200 flex-shrink-0 cursor-pointer
                ${active
                  ? 'bg-[#0F766E] text-white border-transparent shadow-xs'
                  : 'bg-white border-[#E7E5E4] text-[#78716C] hover:text-[#0F766E] hover:border-[#CCFBF1]'
                }
              `}
            >
              <Icon size={14} className={active ? 'text-white' : 'text-[#78716C]'} />
              <span>{cat.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-[#FAFAF9] border border-[#E7E5E4] text-[#78716C]'}`}>
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
                <h2 className="text-xl font-bold text-[#1C1917] font-display">
                  {selectedCategory === 'All' ? 'All Courses' : catMeta.label}
                </h2>
              </div>
              <p className="text-xs text-[#78716C] mt-1 ml-3">
                {filteredCourses.length} courses {searchQuery ? `matching "${searchQuery}"` : 'available'}
              </p>
            </div>
            {levelFilter !== 'All' && (
              <button
                onClick={() => setLevelFilter('All')}
                className="text-xs bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] px-3.5 py-1.5 rounded-full hover:bg-[#CCFBF1] transition-colors cursor-pointer"
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
            <div className="text-center py-16 bg-white border border-[#E7E5E4] rounded-3xl">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-[#1C1917] font-semibold">No courses found</h3>
              <p className="text-[#78716C] text-sm mt-1">Try adjusting your search or filters</p>
              <button
                onClick={() => { setSearchQuery(''); setLevelFilter('All'); }}
                className="mt-4 bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] px-5 py-2 rounded-full font-bold text-xs hover:bg-[#CCFBF1] transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* ── Browse by Category ── */}
          {selectedCategory === 'All' && filteredCourses.length > 0 && (
            <div className="pt-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#0F766E] to-[#14B8A6]" />
                <div>
                  <h3 className="text-lg font-bold text-[#1C1917] font-display">Browse by Category</h3>
                  <p className="text-xs text-[#78716C] mt-0.5">Click a track to explore its courses</p>
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
                        bg-white border border-[#E7E5E4]
                        hover:border-[#0F766E] transition-all duration-200 shadow-xs
                      "
                    >
                      <div className={`h-1 bg-gradient-to-r ${cat.gradient}`} />
                      <div className="p-5 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-[#0F766E] shadow-sm`}>
                          <Icon size={20} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#1C1917] text-sm truncate">{cat.label}</h4>
                          <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1]">
                            {catCourses.length} Courses
                          </span>
                        </div>
                        <ChevronRight size={16} className="text-[#A8A29E]" />
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
