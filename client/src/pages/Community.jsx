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
  FiSearch,
  FiBriefcase,
  FiHelpCircle,
  FiCompass,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { getAuthorDetails } from '../utils/userHelper';

const STORAGE_KEY = 'learnhub_community_posts';

const INITIAL_POSTS = [
  {
    id: 'post-1',
    author: {
      name: 'Priya Patel',
      role: 'SDE at Google',
      avatar: 'P'
    },
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
    author: {
      name: 'Rahul Sharma',
      role: 'Final Year Student',
      avatar: 'R'
    },
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
    author: {
      name: 'Devansh Verma',
      role: 'Full Stack Developer',
      avatar: 'D'
    },
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

const CATEGORY_OPTIONS = [
  {
    id: 'Interview Experiences',
    label: 'Interview Experience',
    desc: 'Company interview rounds & tips',
    icon: FiBriefcase,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'Doubt Resolution',
    label: 'Doubt Resolution',
    desc: 'DSA, System Design & bugs',
    icon: FiHelpCircle,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'Project Showcase',
    label: 'Project Showcase',
    desc: 'Share your work & get feedback',
    icon: FiCompass,
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'General Discussion',
    label: 'Discussion',
    desc: 'Careers, tips & questions',
    icon: FiMessageSquare,
    color: 'from-purple-500 to-pink-500'
  }
];

const POPULAR_TAGS = [
  'Google',
  'Amazon',
  'Microsoft',
  'Interview Experience',
  'DSA',
  'System Design',
  'React',
  'Resume',
  'Offer',
  'Web Dev'
];

const CATEGORIES = [
  'All',
  'Interview Experiences',
  'Doubt Resolution',
  'Project Showcase',
  'General Discussion'
];

// Helper to normalize any post's author data
const normalizeAuthor = (post) => {
  let name = '';
  let role = 'Student';
  let avatar = 'U';

  if (typeof post.author === 'object' && post.author !== null) {
    name = post.author.name || post.author.fullName || post.author.username || '';
    role = post.author.role || post.author.headline || 'Student';
    avatar = post.author.avatar || (name ? name.charAt(0).toUpperCase() : 'U');
  } else if (typeof post.author === 'string') {
    name = post.author;
    role = post.role || 'Student';
    avatar = post.avatar || (name ? name.charAt(0).toUpperCase() : 'U');
  }

  // Self-heal previous bug where author was "Community Member" and role was actually the user's name
  if (name === 'Community Member' && role && !['Student', 'Software Engineer', 'Tech Aspirant', 'Community Admin', 'Learner'].includes(role)) {
    name = role;
    role = 'Student';
    avatar = name.charAt(0).toUpperCase();
  }

  if (!name || name.trim().length === 0) {
    name = 'Community Member';
  }

  return { name: name.trim(), role: role.trim(), avatar };
};

const Community = () => {
  const { user, updateUser } = useAuth();

  // Load posts from localStorage and sanitize author format
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize all loaded posts to clean author structure
          return parsed.map((p) => {
            const authorData = normalizeAuthor(p);
            return {
              ...p,
              author: authorData
            };
          });
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

  // Current authenticated author details
  const currentAuthorDetails = getAuthorDetails(user);

  // UI state
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [activeMenuPostId, setActiveMenuPostId] = useState(null);

  // Create Post Form State
  const [postAuthorName, setPostAuthorName] = useState('');
  const [newPostRole, setNewPostRole] = useState('Student');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Interview Experiences');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Interview Experience', 'Google']);
  const [customTagInput, setCustomTagInput] = useState('');

  // Sync author state when modal opens or user details change
  useEffect(() => {
    if (isCreateModalOpen) {
      const details = getAuthorDetails(user);
      const initialName = details.name !== 'Community Member' ? details.name : '';
      setPostAuthorName(initialName);
      setNewPostRole(details.role || 'Student');
    }
  }, [isCreateModalOpen, user]);

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

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((t) => t !== tagToRemove));
  };

  // Submit New Post
  const handleCreatePost = (e) => {
    e.preventDefault();

    const fallbackAuthor = getAuthorDetails(user);

    // Resolve Author Name with strict priority:
    // 1. Form input author name (if entered)
    // 2. user.name
    // 3. user.fullName
    // 4. user.username
    // 5. Fallback: "Community Member"
    let resolvedAuthorName = postAuthorName.trim();
    if (!resolvedAuthorName || resolvedAuthorName === 'Community Member') {
      resolvedAuthorName = user?.name || user?.fullName || user?.username || fallbackAuthor.name;
    }

    if (!resolvedAuthorName || !resolvedAuthorName.trim()) {
      toast.error('Please enter your name as the author.');
      return;
    }

    if (!newPostTitle.trim()) {
      toast.error('Please enter a descriptive post title.');
      return;
    }

    if (!newPostContent.trim()) {
      toast.error('Please provide some details in the post content.');
      return;
    }

    const resolvedRole = newPostRole.trim() || fallbackAuthor.role || 'Student';
    const resolvedAvatar = resolvedAuthorName.charAt(0).toUpperCase() || 'U';

    // If user entered their name and user state was guest, persist it
    if (resolvedAuthorName !== 'Community Member' && (!user || !user.name)) {
      if (updateUser) {
        updateUser({ name: resolvedAuthorName, role: resolvedRole });
      } else {
        try {
          const prevUser = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem('user', JSON.stringify({ ...prevUser, name: resolvedAuthorName, role: resolvedRole }));
        } catch (err) {
          console.error(err);
        }
      }
    }

    const createdPost = {
      id: `post-${Date.now()}`,
      author: {
        name: resolvedAuthorName,
        avatar: resolvedAvatar,
        role: resolvedRole
      },
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      category: newPostCategory,
      tags: selectedTags.length > 0 ? selectedTags : [newPostCategory],
      createdAt: new Date().toISOString(),
      time: 'Just now',
      likes: 0,
      liked: false,
      comments: [],
      isOwnPost: true
    };

    setPosts([createdPost, ...posts]);
    toast.success('Your post has been published!');

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

    const authorInfo = getAuthorDetails(user);
    const newComment = {
      id: `c-${Date.now()}`,
      author: authorInfo.name,
      avatar: authorInfo.avatar,
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
    const authorData = normalizeAuthor(post);
    const matchesCategory =
      activeCategory === 'All' ||
      post.category === activeCategory ||
      post.tags?.some((t) => t.toLowerCase() === activeCategory.toLowerCase());

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      post.title?.toLowerCase().includes(query) ||
      post.content?.toLowerCase().includes(query) ||
      authorData.name.toLowerCase().includes(query) ||
      post.tags?.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-16 max-w-6xl mx-auto px-3 sm:px-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Community Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Connect with tech peers, share interview breakdowns, ask doubts, and showcase projects.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold text-xs sm:text-sm shadow-xs active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
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
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]" size={17} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts by topic, company, tag, or author..."
                className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl bg-white border border-[#E7E5E4] text-xs sm:text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#78716C] hover:text-[#1C1917] px-2 py-0.5 rounded-md bg-[#FAFAF9] border border-[#E7E5E4]"
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
                    className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0F766E] text-white shadow-xs font-semibold'
                        : 'bg-white text-[#78716C] border border-[#E7E5E4] hover:text-[#0F766E] hover:bg-[#F0FDFA]'
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
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#E7E5E4] shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-[#F0FDFA] text-[#0F766E] mx-auto flex items-center justify-center mb-3 border border-[#CCFBF1]">
                <FiMessageSquare size={28} />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917] mb-1">
                No posts found
              </h3>
              <p className="text-sm text-[#78716C] max-w-sm mx-auto mb-5">
                {searchQuery
                  ? `No posts matching "${searchQuery}". Try a different keyword.`
                  : 'Be the first to share an interview experience or ask a question in this category!'}
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-medium transition-colors shadow-xs"
              >
                <FiPlus size={16} /> Create First Post
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isCommentsOpen = !!expandedComments[post.id];
              const isMenuOpen = activeMenuPostId === post.id;
              const commentsList = post.comments || [];

              // Cleanly extract author data matching the second post design
              const authorData = normalizeAuthor(post);
              const displayTime = post.time || 'Just now';

              return (
                <div
                  key={post.id}
                  id={post.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E7E5E4] shadow-[0_4px_12px_rgba(28,25,23,0.05)] hover:border-[#0F766E] transition-all relative"
                >
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-3.5">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] flex items-center justify-center font-bold text-white shadow-xs flex-shrink-0">
                        {authorData.avatar}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-[#1C1917] text-sm sm:text-base leading-tight">
                            {authorData.name}
                          </h4>
                          {post.category && (
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] font-medium">
                              {post.category}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#78716C] mt-0.5">
                          {authorData.role} • {displayTime}
                        </p>
                      </div>
                    </div>

                    {/* More Options Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuPostId(isMenuOpen ? null : post.id)}
                        className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAFAF9] transition-colors cursor-pointer"
                        aria-label="Post actions"
                      >
                        <FiMoreHorizontal size={18} />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-[#E7E5E4] rounded-xl shadow-lg z-20 py-1.5 text-xs">
                          <button
                            onClick={() => {
                              handleSharePost(post);
                              setActiveMenuPostId(null);
                            }}
                            className="w-full text-left px-3.5 py-2 text-[#44403C] hover:bg-[#F0FDFA] hover:text-[#0F766E] flex items-center gap-2 cursor-pointer"
                          >
                            <FiShare2 size={14} /> Copy Post Link
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                          >
                            <FiTrash2 size={14} /> Delete Post
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Title */}
                  <h3 className="text-base sm:text-lg font-bold text-[#1C1917] mb-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* Post Content */}
                  <div className="text-[#44403C] text-xs sm:text-sm mb-4 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSearchQuery(tag)}
                          className="cursor-pointer text-xs bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#CCFBF1] px-3 py-0.5 rounded-full font-medium transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center gap-6 pt-3.5 border-t border-[#E7E5E4] text-xs sm:text-sm">
                    {/* Like Button */}
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                        post.liked
                          ? 'text-[#F97360] hover:text-[#EA6250]'
                          : 'text-[#78716C] hover:text-[#F97360]'
                      }`}
                    >
                      <FiHeart
                        size={17}
                        className={post.liked ? 'fill-[#F97360] text-[#F97360]' : ''}
                      />
                      <span>{post.likes}</span>
                    </button>

                    {/* Comments Button */}
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-2 text-[#78716C] hover:text-[#0F766E] transition-colors font-medium cursor-pointer"
                    >
                      <FiMessageSquare size={17} />
                      <span>{commentsList.length} Comments</span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => handleSharePost(post)}
                      className="flex items-center gap-2 text-[#78716C] hover:text-[#0F766E] transition-colors font-medium ml-auto cursor-pointer"
                    >
                      <FiShare2 size={16} />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>

                  {/* Expandable Comments Section */}
                  {isCommentsOpen && (
                    <div className="mt-4 pt-4 border-t border-[#E7E5E4] space-y-3">
                      {/* Comments List */}
                      {commentsList.length > 0 && (
                        <div className="space-y-2.5 mb-3">
                          {commentsList.map((comment) => {
                            const cAuthor = typeof comment.author === 'object' ? comment.author?.name : comment.author;
                            return (
                              <div
                                key={comment.id}
                                className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl p-3 text-xs"
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-semibold text-[#1C1917]">
                                    {cAuthor}
                                  </span>
                                  <span className="text-[#A8A29E] text-[10px]">
                                    {comment.time}
                                  </span>
                                </div>
                                <p className="text-[#44403C]">
                                  {comment.content}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Add Comment Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a helpful response..."
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
                          className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#E7E5E4] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#0F766E]"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
          <div className="bg-[#F0FDFA] border border-[#CCFBF1] rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-base mb-1.5 flex items-center gap-2 text-[#0F766E]">
              <FiAward className="text-[#0F766E]" /> Share Your Story
            </h3>
            <p className="text-xs text-[#115E59] leading-relaxed mb-4">
              Recently interviewed or cracked an offer? Your guidance helps candidates prepare better!
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <FiPlus size={15} /> Write an Experience
            </button>
          </div>

          {/* Trending Topics */}
          <div className="bg-white border border-[#E7E5E4] rounded-2xl p-5 shadow-[0_4px_12px_rgba(28,25,23,0.05)]">
            <h3 className="font-bold text-sm text-[#1C1917] mb-3.5 pb-2.5 border-b border-[#E7E5E4] flex items-center gap-2">
              <FiTrendingUp className="text-[#0F766E]" /> Trending Topics
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
                  <p className="text-xs font-semibold text-[#475569] group-hover:text-[#2563EB] transition-colors">
                    #{item.tag}
                  </p>
                  <span className="text-[11px] text-[#94A3B8] group-hover:text-[#64748B]">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
            <h3 className="font-bold text-sm text-[#0F172A] mb-3.5 pb-2.5 border-b border-[#E2E8F0] flex items-center gap-2">
              <FiUser className="text-[#14B8A6]" /> Top Contributors
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Amit Kumar', rep: '15.4k rep', initial: 'A', bg: 'bg-[#F97316]' },
                { name: 'Sneha Rao', rep: '12.8k rep', initial: 'S', bg: 'bg-[#14B8A6]' },
                { name: 'Priya Patel', rep: '9.2k rep', initial: 'P', bg: 'bg-[#2563EB]' }
              ].map((contributor) => (
                <div key={contributor.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${contributor.bg} flex items-center justify-center font-bold text-white text-xs shadow-sm flex-shrink-0`}>
                    {contributor.initial}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A] leading-tight">
                      {contributor.name}
                    </p>
                    <p className="text-[11px] text-[#64748B]">{contributor.rep}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL CREATE POST MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create a Community Post"
        subtitle="Share your interview experience, questions, or projects with fellow developers"
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#172554] bg-white border border-[#E2E8F0] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-post-form"
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <FiSend size={13} />
              <span>Publish Post</span>
            </button>
          </>
        }
      >
        <form id="create-post-form" onSubmit={handleCreatePost} className="space-y-4">
          {/* Author Name and Role / Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Author Name <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-[#64748B]">Your display name</span>
              </div>
              <input
                type="text"
                required
                value={postAuthorName}
                onChange={(e) => setPostAuthorName(e.target.value)}
                placeholder="e.g., Prajwal Patil"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Role / Headline
                </label>
                <span className="text-[10px] text-[#64748B]">Subtitle under your name</span>
              </div>
              <input
                type="text"
                value={newPostRole}
                onChange={(e) => setNewPostRole(e.target.value)}
                placeholder="e.g., Student, SDE Intern @ Google, 4th Year CSE"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
              />
            </div>
          </div>

          {/* Category Selector Compact Grid */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const Icon = cat.icon;
                const isSelected = newPostCategory === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setNewPostCategory(cat.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-start gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] ring-1 ring-[#2563EB]/40 shadow-sm'
                        : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon size={15} className={isSelected ? 'text-[#2563EB]' : 'text-[#64748B]'} />
                      {isSelected && <FiCheck size={12} className="text-[#2563EB]" />}
                    </div>
                    <span className="text-xs font-semibold text-[#0F172A] leading-tight truncate w-full">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-[#64748B] leading-tight line-clamp-1">
                      {cat.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post Title */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Title <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-[#64748B]">
                {newPostTitle.length}/120
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={120}
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="e.g., How I cleared Amazon SDE-1 Coding & System Design rounds"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
            />
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <FiTag size={12} className="text-[#2563EB]" /> Tags & Topics
              </label>
              <span className="text-[10px] text-[#64748B]">Click to add / remove</span>
            </div>

            {/* Popular Tags Pills */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {POPULAR_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] shadow-sm font-semibold'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-slate-300 hover:text-[#0F172A]'
                    }`}
                  >
                    {isSelected && <FiCheck size={10} className="text-[#2563EB]" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Selected Tags Chips */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] mb-2">
                <span className="text-[10px] text-[#64748B] mr-1">Selected:</span>
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-[10px]"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500 ml-0.5 cursor-pointer"
                    >
                      <FiX size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Custom Tag Input */}
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={handleAddCustomTag}
              placeholder="Add custom tag (type and press Enter or comma)..."
              className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
            />
          </div>

          {/* Post Content */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Post Content <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-[#64748B]">
                Write questions, interview breakdown, or tips
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Detail your experience: What questions were asked? What preparation strategy helped? What would you suggest to other candidates?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 resize-none leading-relaxed"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Community;
