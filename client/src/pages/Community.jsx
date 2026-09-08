import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, 
  FiHeart, 
  FiShare2, 
  FiMoreHorizontal, 
  FiPlus, 
  FiSend, 
  FiTag, 
  FiTrash2, 
  FiCheck,
  FiTrendingUp,
  FiAward,
  FiUser,
  FiSearch
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'learnhub_community_posts';

const INITIAL_POSTS = [
  {
    id: 'post-1',
    author: 'Priya Patel',
    role: 'SDE at Google',
    avatar: 'P',
    category: 'Interview Experiences',
    time: '2 hours ago',
    title: 'My Google Interview Experience (Off-campus 2024)',
    content: 'Just cleared Google L3 in Bangalore! Here is my detailed experience:\n\nRound 1 (Coding): Question was a variation of Longest Palindromic Substring. Used DP and optimized it with two pointers.\n\nRound 2 (DSA): Graph BFS traversal on a grid with obstacle removal.\n\nKey takeaway: Always speak your thought process aloud and write clean modular code!',
    tags: ['Interview Experience', 'Google', 'Offer', 'DSA'],
    likes: 245,
    liked: false,
    comments: [
      { id: 'c-1', author: 'Arun V.', time: '1 hour ago', content: 'Heartiest congratulations! Did they ask about time complexity proofs?' },
      { id: 'c-2', author: 'Priya Patel', time: '45 mins ago', content: 'Yes! Always state worst-case and average-case space & time.' }
    ]
  },
  {
    id: 'post-2',
    author: 'Rahul Sharma',
    role: 'Final Year Student',
    avatar: 'R',
    category: 'Doubt Resolution',
    time: '5 hours ago',
    title: 'Need help with System Design resources & LLD practice',
    content: 'Hi everyone, I am starting my system design preparation for upcoming campus drives. I have covered the basics of caching and load balancing, but I am confused about where to practice Low-Level Design (LLD / OOP design patterns). Any recommended repositories or guides?',
    tags: ['Question', 'System Design', 'LLD', 'Java'],
    likes: 18,
    liked: false,
    comments: [
      { id: 'c-3', author: 'Sneha Rao', time: '3 hours ago', content: "Check out Alex Xu's System Design book and head first design patterns for LLD!" }
    ]
  },
  {
    id: 'post-3',
    author: 'Devansh Verma',
    role: 'Full Stack Developer',
    avatar: 'D',
    category: 'Project Showcase',
    time: '1 day ago',
    title: 'Built an AI Mock Interviewer with real-time feedback 🚀',
    content: 'Over the weekend, I built a real-time AI mock interview app using React, WebRTC, and Gemini API. It evaluates speech clarity, keyword match, and behavioral answers. Would love for community members to test it out and share feedback!',
    tags: ['Project Showcase', 'AI', 'Web Dev', 'React'],
    likes: 89,
    liked: false,
    comments: [
      { id: 'c-4', author: 'Amit Kumar', time: '18 hours ago', content: 'Awesome concept! Is the code open-sourced on GitHub?' }
    ]
  }
];

const POPULAR_TAGS = [
  'Interview Experience',
  'Google',
  'Amazon',
  'Microsoft',
  'System Design',
  'DSA',
  'React',
  'Resume',
  'Project Showcase',
  'Question'
];

const CATEGORIES = [
  'All',
  'Interview Experiences',
  'Doubt Resolution',
  'Project Showcase',
  'General Discussion'
];

const Community = () => {
  const { user } = useAuth();

  // Load posts from localStorage or initialize with defaults
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading community posts from localStorage:', err);
    }
    return INITIAL_POSTS;
  });

  // Save to localStorage whenever posts change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (err) {
      console.error('Error saving community posts to localStorage:', err);
    }
  }, [posts]);

  // UI state
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [activeMenuPostId, setActiveMenuPostId] = useState(null);

  // Create Post Form State
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Interview Experiences');
  const [newPostRole, setNewPostRole] = useState(user?.role === 'admin' ? 'Community Admin' : 'Student & Aspiring Dev');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Interview Experience']);
  const [customTagInput, setCustomTagInput] = useState('');

  // Handle Tag Selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && customTagInput.trim()) {
      e.preventDefault();
      const cleanTag = customTagInput.replace(/,/g, '').trim();
      if (cleanTag && !selectedTags.includes(cleanTag)) {
        setSelectedTags([...selectedTags, cleanTag]);
      }
      setCustomTagInput('');
    }
  };

  // Submit New Post
  const handleCreatePost = (e) => {
    e.preventDefault();

    if (!newPostTitle.trim()) {
      toast.error('Please enter a title for your post.');
      return;
    }

    if (!newPostContent.trim()) {
      toast.error('Please write some content for your post.');
      return;
    }

    const postAuthorName = user?.name || 'Community Member';
    const postAvatar = postAuthorName.charAt(0).toUpperCase() || 'U';

    const createdPost = {
      id: `post-${Date.now()}`,
      author: postAuthorName,
      role: newPostRole.trim() || 'Learner',
      avatar: postAvatar,
      category: newPostCategory,
      time: 'Just now',
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      tags: selectedTags.length > 0 ? selectedTags : [newPostCategory],
      likes: 0,
      liked: false,
      comments: [],
      isOwnPost: true
    };

    setPosts([createdPost, ...posts]);
    toast.success('Post published to Community!');

    // Reset Form & Close Modal
    setNewPostTitle('');
    setNewPostContent('');
    setSelectedTags(['Interview Experience']);
    setCustomTagInput('');
    setIsCreateModalOpen(false);
  };

  // Toggle Like
  const handleToggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isNowLiked = !post.liked;
          return {
            ...post,
            liked: isNowLiked,
            likes: isNowLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
          };
        }
        return post;
      })
    );
  };

  // Toggle Comments view
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Add Comment
  const handleAddComment = (postId) => {
    const commentText = (commentInputs[postId] || '').trim();
    if (!commentText) return;

    const authorName = user?.name || 'You';
    const newComment = {
      id: `c-${Date.now()}`,
      author: authorName,
      time: 'Just now',
      content: commentText
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), newComment]
          };
        }
        return post;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    toast.success('Comment added!');
  };

  // Delete Post
  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setActiveMenuPostId(null);
    toast.success('Post removed');
  };

  // Share Post
  const handleSharePost = (post) => {
    const url = `${window.location.origin}/community#${post.id}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      toast.success('Post link copied to clipboard!');
    } else {
      toast.success('Sharing: ' + post.title);
    }
  };

  // Filter posts based on category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' ||
      post.category === activeCategory ||
      post.tags?.some((t) => t.toLowerCase() === activeCategory.toLowerCase());

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      post.title?.toLowerCase().includes(query) ||
      post.content?.toLowerCase().includes(query) ||
      post.author?.toLowerCase().includes(query) ||
      post.tags?.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-16 max-w-6xl mx-auto px-2 sm:px-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Community
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect with peers, share interview breakdowns, ask technical doubts, and showcase projects.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-sm shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 active:scale-95 transition-all self-start sm:self-auto"
        >
          <FiPlus size={18} strokeWidth={2.5} />
          <span>Create Post</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Feed Column */}
        <div className="flex-1 space-y-6">
          {/* Search & Filter Bar */}
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts by topic, company, tag, or author..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs sm:text-sm">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/25'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center mb-3">
                <FiMessageSquare size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                No posts found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
                {searchQuery
                  ? `No posts matching "${searchQuery}". Try a different keyword.`
                  : 'Be the first to share an interview experience or ask a question in this category!'}
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors"
              >
                <FiPlus size={16} /> Create First Post
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isCommentsOpen = !!expandedComments[post.id];
              const isMenuOpen = activeMenuPostId === post.id;
              const commentsList = post.comments || [];

              return (
                <div
                  key={post.id}
                  id={post.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative"
                >
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-3.5">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0">
                        {post.avatar || (post.author ? post.author.charAt(0).toUpperCase() : 'U')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                            {post.author}
                          </p>
                          {post.category && (
                            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                              {post.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {post.role} • {post.time}
                        </p>
                      </div>
                    </div>

                    {/* More Options Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuPostId(isMenuOpen ? null : post.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Post actions"
                      >
                        <FiMoreHorizontal size={18} />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-20 py-1.5 text-xs">
                          <button
                            onClick={() => {
                              handleSharePost(post);
                              setActiveMenuPostId(null);
                            }}
                            className="w-full text-left px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                          >
                            <FiShare2 size={14} /> Copy Post Link
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                          >
                            <FiTrash2 size={14} /> Delete Post
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* Post Content */}
                  <div className="text-slate-700 dark:text-slate-300 text-sm mb-4 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSearchQuery(tag)}
                          className="cursor-pointer text-xs bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40 px-2.5 py-0.5 rounded-full font-medium transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center gap-6 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-sm">
                    {/* Like Button */}
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-2 font-medium transition-colors ${
                        post.liked
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <FiHeart
                        size={17}
                        className={post.liked ? 'fill-red-500 text-red-500' : ''}
                      />
                      <span>{post.likes}</span>
                    </button>

                    {/* Comments Button */}
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
                    >
                      <FiMessageSquare size={17} />
                      <span>{commentsList.length} Comments</span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => handleSharePost(post)}
                      className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium ml-auto"
                    >
                      <FiShare2 size={16} />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>

                  {/* Expandable Comments Section */}
                  {isCommentsOpen && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      {/* Comments List */}
                      {commentsList.length > 0 && (
                        <div className="space-y-2.5 mb-3">
                          {commentsList.map((comment) => (
                            <div
                              key={comment.id}
                              className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {comment.author}
                                </span>
                                <span className="text-slate-400 text-[10px]">
                                  {comment.time}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300">
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a helpful response or comment..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs({
                              ...commentInputs,
                              [post.id]: e.target.value
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <FiSend size={13} />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Create Post Prompt Card */}
          <div className="bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent dark:from-teal-950/30 dark:via-cyan-950/10 border border-teal-200/50 dark:border-teal-800/50 rounded-2xl p-5 text-slate-900 dark:text-white">
            <h3 className="font-bold text-base mb-1.5 flex items-center gap-2 text-teal-800 dark:text-teal-300">
              <FiAward className="text-teal-600 dark:text-teal-400" /> Share Your Story
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Recently interviewed or cracked an offer? Your guidance helps hundreds of candidates on LearnHub prepare better!
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <FiPlus size={15} /> Write an Experience
            </button>
          </div>

          {/* Trending Topics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <FiTrendingUp className="text-teal-600 dark:text-teal-400" /> Trending Topics
            </h3>
            <div className="space-y-3.5">
              {[
                { tag: 'GoogleOffCampus', count: '1.2k posts' },
                { tag: 'SystemDesign', count: '850 posts' },
                { tag: 'ReactInterview', count: '540 posts' },
                { tag: 'AmazonSDE1', count: '420 posts' }
              ].map((item) => (
                <div
                  key={item.tag}
                  onClick={() => setSearchQuery(item.tag)}
                  className="cursor-pointer group flex justify-between items-center"
                >
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    #{item.tag}
                  </p>
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <FiUser className="text-teal-600 dark:text-teal-400" /> Top Contributors
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Amit Kumar', rep: '15.4k rep', initial: 'A', bg: 'from-amber-500 to-orange-500' },
                { name: 'Sneha Rao', rep: '12.8k rep', initial: 'S', bg: 'from-teal-500 to-emerald-500' },
                { name: 'Priya Patel', rep: '9.2k rep', initial: 'P', bg: 'from-cyan-500 to-blue-500' }
              ].map((contributor) => (
                <div key={contributor.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${contributor.bg} flex items-center justify-center font-bold text-white text-xs shadow-sm flex-shrink-0`}>
                    {contributor.initial}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {contributor.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{contributor.rep}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE POST MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create a Community Post"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          {/* Post Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                'Interview Experiences',
                'Doubt Resolution',
                'Project Showcase',
                'General Discussion'
              ].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setNewPostCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    newPostCategory === cat
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="e.g., How I prepared for Amazon SDE-1 Coding & System Design rounds"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
            />
          </div>

          {/* Author Headline / Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Your Headline / Role
            </label>
            <input
              type="text"
              value={newPostRole}
              onChange={(e) => setNewPostRole(e.target.value)}
              placeholder="e.g., SDE Intern @ Uber, 3rd Year CSE Student"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
            />
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FiTag size={13} /> Tags & Topics
              </label>
              <span className="text-[11px] text-slate-400">Click to add or type custom</span>
            </div>

            {/* Quick Popular Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {POPULAR_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <FiCheck size={11} />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Input */}
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={handleAddCustomTag}
              placeholder="Type custom tag and press Enter..."
              className="w-full px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Write out your interview round breakdown, technical questions, preparation tips, or project details..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 resize-none leading-relaxed"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 active:scale-95 transition-all"
            >
              <FiSend size={14} />
              <span>Publish Post</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Community;
