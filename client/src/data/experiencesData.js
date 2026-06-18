export const INTERVIEW_EXPERIENCES = [
  // ==================== GOOGLE ====================
  {
    id: 1,
    companyId: 'google',
    title: 'Software Engineer L4 (Backend) Experience',
    author: 'Aman Sharma',
    role: 'Software Engineer (L4)',
    date: 'April 2026',
    verdict: 'Accepted',
    difficulty: 'Hard',
    summary: 'Applied through referral. Had 1 Phone Screen, 3 Coding rounds, and 1 Googleyness (Behavioral) round. Focus was heavily on Graphs, Dynamic Programming, and clean, readable code.',
    rounds: [
      { name: 'Phone Screen', detail: 'Given a variation of "Longest Substring Without Repeating Characters". Optimized it to O(N) using sliding window and hash map.' },
      { name: 'Coding Round 1 (Graphs)', detail: 'Asked a topological sort problem about library dependencies. Wrote clean DFS recursion, handled cycles, and discussed space complexity.' },
      { name: 'Coding Round 2 (DP)', detail: 'A tough 2D dynamic programming question about pathfinding with constraints. Ended up writing a Memoized DFS solution which they liked.' },
      { name: 'Coding Round 3 (Design/Coding)', detail: 'Design an in-memory scheduler. Focused on lock-free concurrency in Java and scheduling efficiency.' },
      { name: 'Googleyness & Leadership', detail: 'Standard situational questions: handling conflicts with product managers, prioritizing tasks, and mentor experience.' }
    ],
    tips: 'Do not jump straight to coding. Speak out your thoughts, analyze time/space bounds, and verify edge cases first.'
  },
  {
    id: 2,
    companyId: 'google',
    title: 'Software Engineer L3 (New Grad) Experience',
    author: 'Nehal Patel',
    role: 'Software Engineer (L3)',
    date: 'June 2026',
    verdict: 'Accepted',
    difficulty: 'Medium',
    summary: 'On-campus recruitment drive. 2 online coding rounds followed by 3 virtual technical rounds.',
    rounds: [
      { name: 'Online Assessment', detail: 'Solved two coding questions: one array manipulation and one dynamic programming (Staircase variation).' },
      { name: 'Technical Round 1', detail: 'Binary tree traversals. Wrote tree node structures and implemented iterative post-order traversal.' },
      { name: 'Technical Round 2', detail: 'HashMap and Array question. Similar to "Two Sum" but scaled to finding triplets that sum to a target.' }
    ],
    tips: 'Master recursion and trees. Google interviewers love writing code cleanly and discussing time complexity bounds.'
  },

  // ==================== AMAZON ====================
  {
    id: 3,
    companyId: 'amazon',
    title: 'SDE-2 (AWS) Virtual Onsite Experience',
    author: 'Vikram Roy',
    role: 'SDE-2 (Cloud Core)',
    date: 'March 2026',
    verdict: 'Accepted',
    difficulty: 'Medium',
    summary: 'Recruiter reached out via LinkedIn. Process comprised of 1 Online Assessment (Coding + Work Simulation) and 4 Onsite rounds. Every round had 15-20 minutes dedicated to Amazon Leadership Principles.',
    rounds: [
      { name: 'Online Assessment', detail: '2 Coding questions (LRU Cache and a priority queue task) + Work Simulation. Got full test cases.' },
      { name: 'Onsite 1 (Coding & LP)', detail: 'System Coding: Implement a rate limiter. Implemented token bucket. Leadership principle: Customer Obsession.' },
      { name: 'Onsite 2 (System Design & LP)', detail: 'Design YouTube Video Streaming. Focused on CDN, S3 storage, transcoders, and database scaling. LP: Bias for Action.' },
      { name: 'Onsite 3 (Coding & LP)', detail: 'Linked List manipulations (Add Two Numbers variation). LP: Ownership.' },
      { name: 'Onsite 4 (Bar Raiser)', detail: 'Graph BFS (Router networks). Followed by in-depth questions on past project challenges. LP: Dive Deep.' }
    ],
    tips: 'Amazon places 50% weight on Leadership Principles. Prepare STAR stories for every LP, especially Ownership and Customer Obsession.'
  },
  {
    id: 4,
    companyId: 'amazon',
    title: 'SDE-1 Off-Campus Experience',
    author: 'Aditi Rao',
    role: 'SDE-1',
    date: 'May 2026',
    verdict: 'Rejected (Made to final round)',
    difficulty: 'Medium',
    summary: 'Applied online. 1 OA followed by 3 rounds of technical interviews.',
    rounds: [
      { name: 'Technical Round 1', detail: 'Valid Parentheses and Merge Sorted Lists. Solved both using Stack and two pointers quickly.' },
      { name: 'Technical Round 2', detail: 'Given a grid, find shortest path avoiding obstacles. Solved using BFS.' },
      { name: 'Technical Round 3', detail: 'Design an online bookstore. Got confused with DB indexing and schema design.' }
    ],
    tips: 'Spend time on database normalization and OOP design concepts even for SDE-1 roles.'
  },

  // ==================== MICROSOFT ====================
  {
    id: 5,
    companyId: 'microsoft',
    title: 'SDE-2 (Azure Core) Interview Experience',
    author: 'Rajiv Mehta',
    role: 'SDE-2 (Azure)',
    date: 'May 2026',
    verdict: 'Accepted',
    difficulty: 'Medium',
    summary: 'Applied via Career Portal. 1 Codility screen, 1 Design round, 2 Coding rounds, and 1 Manager round. Azure teams focus heavily on OS fundamentals, threading, and distributed design.',
    rounds: [
      { name: 'Online Screen', detail: 'Three algorithm questions (Arrays, Math, Strings). Succeeded in passing all test cases.' },
      { name: 'Design Round (System Design)', detail: 'Design a Distributed Cache. Explained consistent hashing, hash ring node joins, and replication configurations.' },
      { name: 'Coding Round 1', detail: 'Implement a thread-safe Queue. Discussed mutexes, conditional variables, and lock-free lists.' },
      { name: 'Coding Round 2', detail: 'Valid Parentheses and Binary Search tree balancing. Solved efficiently.' },
      { name: 'Managerial Round', detail: 'Discussed past cloud projects, architectural tradeoffs, cost optimizations, and why I wanted to join Azure.' }
    ],
    tips: 'Azure interviewers expect solid understanding of concurrency, threads, locking, and basic operating systems concepts.'
  },
  {
    id: 6,
    companyId: 'microsoft',
    title: 'Software Engineer (New Grad) Experience',
    author: 'Sneha Reddy',
    role: 'Software Engineer',
    date: 'January 2026',
    verdict: 'Accepted',
    difficulty: 'Easy',
    summary: 'Interviewed during college placements. 1 Coding test, 3 rounds of technical and behavioral interviews.',
    rounds: [
      { name: 'Technical 1', detail: 'Reverse Linked List and binary search questions. Completed successfully.' },
      { name: 'Technical 2', detail: 'Implement a Trie structure for autocomplete suggestions. Walked through insert and search processes.' },
      { name: 'Technical 3', detail: 'Resume walk-through. In-depth questions about my React and Node.js projects.' }
    ],
    tips: 'Be very strong with fundamental Data Structures (Trees, Tries, Arrays, Strings).'
  }
];
