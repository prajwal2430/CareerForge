export const PROBLEMS = [
  // ==================== COURSE 1: DSA (IDs 1-10) ====================
  {
    id: 1,
    courseId: 1,
    courseTitle: 'Complete DSA for Placements',
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptance: '52.3%',
    status: 'solved',
    tags: ['Array', 'Hash Table'],
    companies: ['google', 'amazon', 'microsoft'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    starterCode: {
      javascript: `var twoSum = function(nums, target) {\n    // Write your code here\n};`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[0];\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};`
    },
    testCases: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }]
  },
  {
    id: 2,
    courseId: 1,
    courseTitle: 'Complete DSA for Placements',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    acceptance: '41.8%',
    status: 'unsolved',
    tags: ['Linked List', 'Math'],
    companies: ['amazon', 'microsoft'],
    description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.`,
    examples: [
      { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', explanation: '342 + 465 = 807.' }
    ],
    constraints: ['0 <= Node.val <= 9', 'The list represents a number that does not have leading zeros.'],
    starterCode: {
      javascript: `var addTwoNumbers = function(l1, l2) {\n    \n};`,
      python: `class Solution:\n    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n        pass`
    },
    testCases: [{ input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]' }]
  },
  {
    id: 3,
    courseId: 1,
    courseTitle: 'Complete DSA for Placements',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    acceptance: '34.5%',
    status: 'attempted',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    companies: ['google', 'amazon'],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [{ input: 's = "abcabcbb"', output: '3' }],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    starterCode: {
      javascript: `var lengthOfLongestSubstring = function(s) {\n    \n};`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass`
    },
    testCases: [{ input: 's = "abcabcbb"', output: '3' }]
  },
  {
    id: 4,
    courseId: 1,
    courseTitle: 'Complete DSA for Placements',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    acceptance: '39.4%',
    status: 'unsolved',
    tags: ['Array', 'Binary Search'],
    companies: ['google'],
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays. The overall run time complexity should be \`O(log (m+n))\`.`,
    examples: [{ input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000' }],
    constraints: ['0 <= m, n <= 1000'],
    starterCode: {
      javascript: `var findMedianSortedArrays = function(nums1, nums2) {\n    \n};`,
      python: `class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        pass`
    },
    testCases: [{ input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000' }]
  },
  {
    id: 5,
    courseId: 1,
    courseTitle: 'Complete DSA for Placements',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    acceptance: '33.7%',
    status: 'solved',
    tags: ['String', 'Dynamic Programming'],
    companies: ['google', 'amazon', 'microsoft'],
    description: `Given a string \`s\`, return *the longest palindromic substring* in \`s\`.`,
    examples: [{ input: 's = "babad"', output: '"bab"' }],
    constraints: ['1 <= s.length <= 1000'],
    starterCode: {
      javascript: `var longestPalindrome = function(s) {\n    \n};`,
      python: `class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        pass`
    },
    testCases: [{ input: 's = "babad"', output: '"bab"' }]
  },
  {
    id: 6,
    courseId: 1,
    courseTitle: 'Complete DSA for Placements',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    acceptance: '40.2%',
    status: 'unsolved',
    tags: ['String', 'Stack'],
    companies: ['google', 'amazon', 'microsoft'],
    description: `Determine if the input string \`s\` containing characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\` is valid.`,
    examples: [{ input: 's = "()"', output: 'true' }],
    constraints: ['1 <= s.length <= 10^4'],
    starterCode: {
      javascript: `var isValid = function(s) {\n    \n};`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass`
    },
    testCases: [{ input: 's = "()"', output: 'true' }]
  },
  {
    id: 7,
    courseId: 1,
    courseTitle: 'Complete DSA for Placements',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    acceptance: '63.5%',
    status: 'solved',
    tags: ['Linked List', 'Recursion'],
    companies: ['amazon', 'microsoft'],
    description: `Merge two sorted linked lists list1 and list2 and return it as a sorted list.`,
    examples: [{ input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' }],
    constraints: ['The number of nodes in both lists is in range [0, 50].'],
    starterCode: {
      javascript: `var mergeTwoLists = function(list1, list2) {\n    \n};`,
      python: `class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        pass`
    },
    testCases: [{ input: 'list1 = [1,2], list2 = [3]', output: '[1,2,3]' }]
  },
  {
    id: 8,
    courseId: 1,
    courseTitle: 'Complete DSA for Placements',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    acceptance: '74.1%',
    status: 'solved',
    tags: ['Linked List', 'Recursion'],
    companies: ['google', 'amazon', 'microsoft'],
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }],
    constraints: ['The number of nodes in the list is in the range [0, 5000].'],
    starterCode: {
      javascript: `var reverseList = function(head) {\n    \n};`,
      python: `class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass`
    },
    testCases: [{ input: 'head = [1,2]', output: '[2,1]' }]
  },
  {
    id: 9,
    courseId: 1,
    courseTitle: 'Complete DSA for Placements',
    title: '3Sum',
    difficulty: 'Medium',
    acceptance: '33.2%',
    status: 'unsolved',
    tags: ['Array', 'Two Pointers'],
    companies: ['google', 'amazon'],
    description: `Given an integer array nums, return all triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.`,
    examples: [{ input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' }],
    constraints: ['3 <= nums.length <= 3000'],
    starterCode: {
      javascript: `var threeSum = function(nums) {\n    \n};`,
      python: `class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        pass`
    },
    testCases: [{ input: 'nums = [-1,0,1]', output: '[[-1,0,1]]' }]
  },
  {
    id: 10,
    courseId: 1,
    courseTitle: 'Complete DSA for Placements',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    acceptance: '52.7%',
    status: 'unsolved',
    tags: ['Math', 'Dynamic Programming'],
    companies: ['google', 'microsoft'],
    description: `It takes \`n\` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [{ input: 'n = 3', output: '3' }],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      javascript: `var climbStairs = function(n) {\n    \n};`,
      python: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass`
    },
    testCases: [{ input: 'n = 4', output: '5' }]
  },

  // ==================== COURSE 2: WEB DEV (IDs 11-20) ====================
  {
    id: 11,
    courseId: 2,
    courseTitle: 'MERN Stack Masterclass',
    title: 'Build a Counter Component',
    difficulty: 'Easy',
    acceptance: '78.5%',
    status: 'solved',
    tags: ['React', 'JavaScript', 'State Management'],
    companies: ['amazon', 'microsoft'],
    description: `Create a functional React component named \`Counter\` that implements a simple counter interface with Increment, Decrement (cannot go below 0), and Reset buttons.`,
    examples: [{ input: 'Click "Increment" twice', output: 'State Display: 2' }],
    constraints: ['Must use React useState hook.'],
    starterCode: {
      javascript: `import React, { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <span data-testid="count">{count}</span>\n      {/* Add buttons here */}\n    </div>\n  );\n}`
    },
    testCases: [{ input: 'Initial Render', output: 'count = 0' }]
  },
  {
    id: 12,
    courseId: 2,
    courseTitle: 'MERN Stack Masterclass',
    title: 'Fetch and Render User List',
    difficulty: 'Medium',
    acceptance: '64.2%',
    status: 'unsolved',
    tags: ['React', 'API Request', 'Hooks'],
    companies: ['google', 'amazon'],
    description: `Implement a component \`UserList\` that loads user profiles from a mock API (\`/api/users\`) on mount and renders them in a list. Include loading and error states.`,
    examples: [{ input: 'Mount component', output: 'Renders list of users after loading state' }],
    constraints: ['Must fetch inside useEffect.'],
    starterCode: {
      javascript: `import React, { useState, useEffect } from 'react';\n\nexport default function UserList() {\n  // Implement logic\n}`
    },
    testCases: [{ input: 'Initial state', output: 'Renders loading spinner' }]
  },
  {
    id: 13,
    courseId: 2,
    courseTitle: 'MERN Stack Masterclass',
    title: 'Debounce Function',
    difficulty: 'Medium',
    acceptance: '58.9%',
    status: 'attempted',
    tags: ['JavaScript', 'Utilities', 'Performance'],
    companies: ['google', 'microsoft'],
    description: `Write an implementation of a \`debounce\` function which delays the execution of the original function until after a specific delay.`,
    examples: [{ input: 'debounce(func, 200)', output: 'Returns wrapped function' }],
    constraints: ['Must clean up timers.'],
    starterCode: {
      javascript: `function debounce(func, delay) {\n  let timeoutId;\n  return function (...args) {\n    // Code here\n  };\n}`
    },
    testCases: [{ input: 'Rapid triggers within delay', output: 'Original function invoked once' }]
  },
  {
    id: 14,
    courseId: 2,
    courseTitle: 'MERN Stack Masterclass',
    title: 'Build a Todo List',
    difficulty: 'Medium',
    acceptance: '71.2%',
    status: 'unsolved',
    tags: ['React', 'JavaScript'],
    companies: ['amazon'],
    description: `Build an interactive React component named \`TodoList\` that manages a simple todo list. Users can add a todo, toggle check states, and delete items.`,
    examples: [{ input: 'Add item', output: 'Item is added to list' }],
    constraints: ['Must use React state arrays properly.'],
    starterCode: {
      javascript: `import React, { useState } from 'react';\n\nexport default function TodoList() {\n  // Complete implementation\n}`
    },
    testCases: [{ input: 'Add new item', output: 'List size increments by 1' }]
  },
  {
    id: 15,
    courseId: 2,
    courseTitle: 'MERN Stack Masterclass',
    title: 'Custom hook: useLocalStorage',
    difficulty: 'Medium',
    acceptance: '65.8%',
    status: 'unsolved',
    tags: ['React', 'Hooks', 'Web API'],
    companies: ['google'],
    description: `Implement a React hook \`useLocalStorage(key, initialValue)\` that acts like \`useState\` but persists the state in window localStorage.`,
    examples: [{ input: 'useLocalStorage("key", "val")', output: 'Restores value from storage if exists' }],
    constraints: ['Must handle serialization.'],
    starterCode: {
      javascript: `import { useState } from 'react';\n\nexport default function useLocalStorage(key, initialValue) {\n  \n}`
    },
    testCases: [{ input: 'Set state via hook', output: 'Stores value inside local storage' }]
  },
  {
    id: 16,
    courseId: 2,
    courseTitle: 'MERN Stack Masterclass',
    title: 'Express JWT Auth Middleware',
    difficulty: 'Medium',
    acceptance: '61.4%',
    status: 'unsolved',
    tags: ['Node.js', 'Express', 'JWT'],
    companies: ['amazon', 'microsoft'],
    description: `Create an Express authentication middleware function \`authenticateToken(req, res, next)\` that extracts a Bearer token from the Authorization header and verifies it.`,
    examples: [{ input: 'No Auth Header', output: 'Sends 401 Unauthorized status' }],
    constraints: ['Verify token using jwt.verify.'],
    starterCode: {
      javascript: `const jwt = require('jsonwebtoken');\n\nfunction authenticateToken(req, res, next) {\n  \n}`
    },
    testCases: [{ input: 'Request with invalid token', output: 'res.status = 403' }]
  },
  {
    id: 17,
    courseId: 2,
    courseTitle: 'MERN Stack Masterclass',
    title: 'React Form Validator',
    difficulty: 'Easy',
    acceptance: '82.3%',
    status: 'unsolved',
    tags: ['React', 'Forms'],
    companies: ['microsoft'],
    description: `Build a basic React form component that validates User Registration fields (Username >= 3 chars, Email has '@', Password >= 6 chars).`,
    examples: [{ input: 'Submit with empty email', output: 'Shows validation error message' }],
    constraints: ['Controlled component form fields.'],
    starterCode: {
      javascript: `import React, { useState } from 'react';\n\nexport default function RegistrationForm() {\n  \n}`
    },
    testCases: [{ input: 'Submitting invalid inputs', output: 'Displays specific field error messages' }]
  },
  {
    id: 18,
    courseId: 2,
    courseTitle: 'MERN Stack Masterclass',
    title: 'Throttle Function',
    difficulty: 'Medium',
    acceptance: '55.4%',
    status: 'unsolved',
    tags: ['JavaScript', 'Utilities'],
    companies: ['google'],
    description: `Write a \`throttle\` function that limits execution of a target function to at most once per \`limit\` milliseconds.`,
    examples: [{ input: 'throttle(func, 100)', output: 'Executes func at most once every 100ms' }],
    constraints: ['Must execute with correct context and arguments.'],
    starterCode: {
      javascript: `function throttle(func, limit) {\n  let inThrottle;\n  return function(...args) {\n    \n  }\n}`
    },
    testCases: [{ input: 'Multiple trigger calls', output: 'Limits execution frequency' }]
  },
  {
    id: 19,
    courseId: 2,
    courseTitle: 'MERN Stack Masterclass',
    title: 'Simple Event Emitter',
    difficulty: 'Medium',
    acceptance: '49.1%',
    status: 'unsolved',
    tags: ['JavaScript', 'OOJS'],
    companies: ['google', 'amazon'],
    description: `Create an \`EventEmitter\` class containing \`subscribe(eventName, callback)\` and \`emit(eventName, args)\` methods. \`subscribe\` should return an object with an \`unsubscribe()\` method.`,
    examples: [{ input: 'emitter.subscribe("event", cb); emitter.emit("event");', output: 'Invokes callback function' }],
    constraints: ['Avoid global memory leaks; handle unsubscribe correctly.'],
    starterCode: {
      javascript: `class EventEmitter {\n  subscribe(eventName, callback) {\n    \n  }\n  emit(eventName, ...args) {\n    \n  }\n}`
    },
    testCases: [{ input: 'Multiple subscriptions', output: 'Fires all active callbacks' }]
  },
  {
    id: 20,
    courseId: 2,
    courseTitle: 'MERN Stack Masterclass',
    title: 'CSS Flexbox Centering',
    difficulty: 'Easy',
    acceptance: '89.2%',
    status: 'unsolved',
    tags: ['HTML', 'CSS'],
    companies: ['microsoft', 'amazon'],
    description: `Provide a CSS rule configuration to perfectly center a child element vertically and horizontally within its parent container using Flexbox.`,
    examples: [{ input: 'Flex rules', output: 'display: flex, align-items: center, justify-content: center' }],
    constraints: ['Must use CSS Flexbox.'],
    starterCode: {
      javascript: `/* Fill in CSS rule template */\n.parent {\n  display: flex;\n  \n}`
    },
    testCases: [{ input: 'Render checks', output: 'Element centers perfectly' }]
  },

  // ==================== COURSE 3: SYSTEM DESIGN (IDs 21-30) ====================
  {
    id: 21,
    courseId: 3,
    courseTitle: 'System Design Interview',
    title: 'Design a URL Shortener (TinyURL)',
    difficulty: 'Medium',
    acceptance: '48.1%',
    status: 'unsolved',
    tags: ['System Design', 'Database Design'],
    companies: ['google', 'amazon', 'microsoft'],
    description: `Design a high-scale service like TinyURL that translates long URLs into short alias links. Detail the API spec, DB schema, and hashing algorithm.`,
    examples: [{ input: 'Base62 conversion explanation', output: '62^7 keys provides plenty scale' }],
    constraints: ['Read-to-Write ratio is 100:1.'],
    starterCode: {
      javascript: `/* Write your architectural proposal */\n### 1. Database Schema\n### 2. High Level Design`
    },
    testCases: [{ input: 'System Scalability', output: 'Redirection caching configured' }]
  },
  {
    id: 22,
    courseId: 3,
    courseTitle: 'System Design Interview',
    title: 'Design a Rate Limiter',
    difficulty: 'Hard',
    acceptance: '32.4%',
    status: 'unsolved',
    tags: ['System Design', 'API Gateway'],
    companies: ['google', 'amazon'],
    description: `Design a Rate Limiter to throttle user requests and prevent abuse. Compare Token Bucket and Sliding Window algorithms and detail distributed caching architectures (Redis).`,
    examples: [{ input: 'Select Token Bucket', output: 'Allows bursts' }],
    constraints: ['Latency overhead < 5ms.'],
    starterCode: {
      javascript: `/* System Design rate limiter writeup */`
    },
    testCases: [{ input: 'Redis integration check', output: 'Lua script synchronization' }]
  },
  {
    id: 23,
    courseId: 3,
    courseTitle: 'System Design Interview',
    title: 'Design a Distributed Cache',
    difficulty: 'Hard',
    acceptance: '38.4%',
    status: 'unsolved',
    tags: ['System Design', 'Caching'],
    companies: ['google', 'microsoft'],
    description: `Design a highly scalable, distributed in-memory cache system (like Redis Cluster or Memcached). Detail consistent hashing, partitioning, replication, and LRU eviction policies.`,
    examples: [{ input: 'Consistent Hashing ring', output: 'Redistributes only 1/N keys' }],
    constraints: ['1M+ reads/sec.'],
    starterCode: {
      javascript: `/* Distributed Cache specifications */`
    },
    testCases: [{ input: 'Eviction performance', output: 'O(1) updates' }]
  },
  {
    id: 24,
    courseId: 3,
    courseTitle: 'System Design Interview',
    title: 'Design Messenger Chat Backend',
    difficulty: 'Hard',
    acceptance: '31.2%',
    status: 'unsolved',
    tags: ['System Design', 'WebSockets'],
    companies: ['google', 'amazon'],
    description: `Design a real-time messaging application architecture similar to WhatsApp or Messenger. Detail connection gateways, HBase/Cassandra storage schemas, and presence tracking.`,
    examples: [{ input: 'WebSocket handling', output: 'Stateful connections' }],
    constraints: ['Instant message delivery under 200ms.'],
    starterCode: {
      javascript: `/* Messaging architecture writeup */`
    },
    testCases: [{ input: 'Scale tests', output: 'Multi-region sockets verified' }]
  },
  {
    id: 25,
    courseId: 3,
    courseTitle: 'System Design Interview',
    title: 'Design a Notification System',
    difficulty: 'Medium',
    acceptance: '45.7%',
    status: 'unsolved',
    tags: ['System Design', 'Message Queues'],
    companies: ['amazon', 'microsoft'],
    description: `Design a scalable microservice system that dispatches push, SMS, and Email notifications to millions of users daily. Detail broker queues, prioritization, and de-duplication.`,
    examples: [{ input: 'Message Brokers', output: 'Kafka clusters for email and SMS queues' }],
    constraints: ['At-least-once delivery guarantee.'],
    starterCode: {
      javascript: `/* Notification design proposal */`
    },
    testCases: [{ input: 'Deduplication lookup', output: 'Idempotent worker execution' }]
  },
  {
    id: 26,
    courseId: 3,
    courseTitle: 'System Design Interview',
    title: 'Design a Web Crawler',
    difficulty: 'Medium',
    acceptance: '42.1%',
    status: 'unsolved',
    tags: ['System Design', 'Crawl Manager'],
    companies: ['google'],
    description: `Design a scalable distributed web crawler that traverses the web to index pages. Detail URL Frontier queues, politeness policies (robots.txt), and de-duplication filters.`,
    examples: [{ input: 'Politeness management', output: 'Queue delay per domain server' }],
    constraints: ['Handles billions of pages.'],
    starterCode: {
      javascript: `/* Web Crawler Design proposal */`
    },
    testCases: [{ input: 'Bloom Filters check', output: 'Fast unique URL checks' }]
  },
  {
    id: 27,
    courseId: 3,
    courseTitle: 'System Design Interview',
    title: 'Design YouTube Video Streaming',
    difficulty: 'Hard',
    acceptance: '28.9%',
    status: 'unsolved',
    tags: ['System Design', 'CDN'],
    companies: ['google', 'amazon'],
    description: `Design a highly available video streaming service like YouTube. Explain video encoding pipelines, segmenting, adaptive bitrate streaming, and Content Delivery Networks (CDNs).`,
    examples: [{ input: 'Video file segmenting', output: 'DASH or HLS chunks segmenting' }],
    constraints: ['Sub-second start times globally.'],
    starterCode: {
      javascript: `/* Video streaming architecture */`
    },
    testCases: [{ input: 'CDN edge performance', output: '99% cache hit rate' }]
  },
  {
    id: 28,
    courseId: 3,
    courseTitle: 'System Design Interview',
    title: 'Design a Key-Value Store',
    difficulty: 'Hard',
    acceptance: '35.6%',
    status: 'unsolved',
    tags: ['System Design', 'Storage'],
    companies: ['amazon', 'microsoft'],
    description: `Design a highly available distributed Key-Value store (similar to DynamoDB). Detail consistent hashing, quorum consensus, conflict resolution (vector clocks), and gossip protocols.`,
    examples: [{ input: 'Sloppy Quorum', output: 'Ensures high write availability' }],
    constraints: ['Configurable consistency.'],
    starterCode: {
      javascript: `/* KV Store proposal template */`
    },
    testCases: [{ input: 'Gossip protocol sync', output: 'Eventual consistency validation' }]
  },
  {
    id: 29,
    courseId: 3,
    courseTitle: 'System Design Interview',
    title: 'Design a Unique ID Generator',
    difficulty: 'Medium',
    acceptance: '51.3%',
    status: 'unsolved',
    tags: ['System Design', 'UUID'],
    companies: ['google', 'microsoft'],
    description: `Design a distributed unique ID generator system (like Twitter Snowflake). Generate unique 64-bit IDs that are roughly chronological and scale across multi-region servers.`,
    examples: [{ input: 'Snowflake design layout', output: 'Timestamp + Machine ID + Sequence ID' }],
    constraints: ['Capable of generating 10,000+ IDs per second per machine.'],
    starterCode: {
      javascript: `/* Unique ID generation algorithm design */`
    },
    testCases: [{ input: 'Sequence overflow checks', output: 'Thread-safety lock verified' }]
  },
  {
    id: 30,
    courseId: 3,
    courseTitle: 'System Design Interview',
    title: 'Design an API Gateway',
    difficulty: 'Medium',
    acceptance: '46.8%',
    status: 'unsolved',
    tags: ['System Design', 'API Gateway'],
    companies: ['amazon', 'microsoft'],
    description: `Design an API Gateway layer for microservices. Highlight routing, load balancing, SSL termination, authentication, rate limiting, and request logging.`,
    examples: [{ input: 'API Gateway placement', output: 'Interposed between client and reverse proxies' }],
    constraints: ['High throughput with minimum reverse proxy latency.'],
    starterCode: {
      javascript: `/* API Gateway Design spec sheet */`
    },
    testCases: [{ input: 'Rate limit intercept', output: 'Intercept block returns 429' }]
  },

  // ==================== COURSE 4: AI / MACHINE LEARNING (IDs 31-40) ====================
  {
    id: 31,
    courseId: 4,
    courseTitle: 'AI & Machine Learning Foundations',
    title: 'Linear Regression Prediction',
    difficulty: 'Easy',
    acceptance: '75.4%',
    status: 'unsolved',
    tags: ['Python', 'Math', 'ML Algorithms'],
    companies: ['google'],
    description: `Implement a function \`predict(X, w, b)\` in Python that computes the prediction for multiple samples under a linear regression model: \`y = Xw + b\`.`,
    examples: [{ input: 'X = [[1, 2]], w = [0.5, 0.2], b = 0.1', output: '[1.0]' }],
    constraints: ['X shape is (m, n), w shape is (n,), b is scalar.'],
    starterCode: {
      python: `import numpy as np\n\ndef predict(X: np.ndarray, w: np.ndarray, b: float) -> np.ndarray:\n    # Write python code here\n    pass`,
      javascript: `function predict(X, w, b) {\n  // JS numerical matrix multiply fallback\n}`
    },
    testCases: [{ input: 'X=[[1]], w=[2], b=1', output: '[3]' }]
  },
  {
    id: 32,
    courseId: 4,
    courseTitle: 'AI & Machine Learning Foundations',
    title: 'Sigmoid Activation Function',
    difficulty: 'Easy',
    acceptance: '84.1%',
    status: 'solved',
    tags: ['Python', 'Math', 'Neural Networks'],
    companies: ['google', 'microsoft'],
    description: `Implement the sigmoid activation function: \`g(z) = 1 / (1 + e^-z)\`. The function should support scalar inputs and NumPy arrays.`,
    examples: [{ input: 'z = 0', output: '0.5' }],
    constraints: ['Input can be an array of any size.'],
    starterCode: {
      python: `import numpy as np\n\ndef sigmoid(z):\n    pass`
    },
    testCases: [{ input: 'z = 0', output: '0.5' }]
  },
  {
    id: 33,
    courseId: 4,
    courseTitle: 'AI & Machine Learning Foundations',
    title: 'Compute Precision and Recall',
    difficulty: 'Easy',
    acceptance: '70.8%',
    status: 'unsolved',
    tags: ['Python', 'Evaluation Metrics'],
    companies: ['google', 'amazon'],
    description: `Given arrays of true labels and predicted labels (binary classification), write a function to calculate the precision and recall scores.`,
    examples: [{ input: 'y_true = [1, 0, 1], y_pred = [1, 0, 0]', output: 'Precision: 1.0, Recall: 0.5' }],
    constraints: ['Avoid division by zero; return 0.0 if denominator is 0.'],
    starterCode: {
      python: `def get_precision_recall(y_true, y_pred):\n    # Return tuple (precision, recall)\n    pass`
    },
    testCases: [{ input: 'y_true=[1, 1], y_pred=[1, 0]', output: '(1.0, 0.5)' }]
  },
  {
    id: 34,
    courseId: 4,
    courseTitle: 'AI & Machine Learning Foundations',
    title: 'K-Means Centroid Updates',
    difficulty: 'Medium',
    acceptance: '59.3%',
    status: 'unsolved',
    tags: ['Python', 'Clustering'],
    companies: ['amazon', 'microsoft'],
    description: `Implement the update step of K-Means clustering. Given a dataset \`X\` and cluster assignments for each point, compute the new centroids as the mean of points assigned to each cluster.`,
    examples: [{ input: 'X = [[1, 2], [3, 4]], assignments = [0, 0]', output: '[[2.0, 3.0]]' }],
    constraints: ['Assignments vector matches X length.'],
    starterCode: {
      python: `import numpy as np\n\ndef update_centroids(X, assignments, K):\n    pass`
    },
    testCases: [{ input: 'X=[[1,1]], assignments=[0]', output: '[[1.0, 1.0]]' }]
  },
  {
    id: 35,
    courseId: 4,
    courseTitle: 'AI & Machine Learning Foundations',
    title: 'Mean Squared Error (MSE)',
    difficulty: 'Easy',
    acceptance: '81.2%',
    status: 'unsolved',
    tags: ['Python', 'Math'],
    companies: ['google'],
    description: `Write a function to calculate the Mean Squared Error (MSE) loss between true targets and model predictions: \`MSE = (1/n) * sum((y_true - y_pred)^2)\`.`,
    examples: [{ input: 'y_true = [1, 2], y_pred = [1.5, 2.5]', output: '0.25' }],
    constraints: ['y_true and y_pred have same size.'],
    starterCode: {
      python: `def calculate_mse(y_true, y_pred):\n    pass`
    },
    testCases: [{ input: 'y_true=[1], y_pred=[2]', output: '1.0' }]
  },
  {
    id: 36,
    courseId: 4,
    courseTitle: 'AI & Machine Learning Foundations',
    title: 'Neural Net Forward Propagation',
    difficulty: 'Medium',
    acceptance: '53.6%',
    status: 'unsolved',
    tags: ['Python', 'Deep Learning'],
    companies: ['google', 'microsoft'],
    description: `Write a forward propagation method for a single hidden layer neural network: \`A1 = sigmoid(X * W1 + b1)\`, \`A2 = softmax(A1 * W2 + b2)\`.`,
    examples: [{ input: 'Inputs and weights arrays', output: 'Softmax predictions probability array' }],
    constraints: ['Ensure correct matrix multiplication dot layouts.'],
    starterCode: {
      python: `import numpy as np\n\ndef forward_prop(X, W1, b1, W2, b2):\n    pass`
    },
    testCases: [{ input: 'Simple inputs', output: 'Sum of probabilities = 1.0' }]
  },
  {
    id: 37,
    courseId: 4,
    courseTitle: 'AI & Machine Learning Foundations',
    title: 'Tokenization & Vocabulary',
    difficulty: 'Easy',
    acceptance: '76.8%',
    status: 'unsolved',
    tags: ['Python', 'NLP'],
    companies: ['google', 'amazon'],
    description: `Implement a basic tokenizer and vocabulary builder that tokenizes clean words from list of sentences and returns a token-to-index dictionary sorted alphabetically.`,
    examples: [{ input: '["Hello World", "World"]', output: '{"hello": 0, "world": 1}' }],
    constraints: ['Case-insensitive; ignore punctuation.'],
    starterCode: {
      python: `def build_vocabulary(sentences):\n    pass`
    },
    testCases: [{ input: '["A B", "B"]', output: '{"a": 0, "b": 1}' }]
  },
  {
    id: 38,
    courseId: 4,
    courseTitle: 'AI & Machine Learning Foundations',
    title: 'Train-Test Dataset Split',
    difficulty: 'Easy',
    acceptance: '72.4%',
    status: 'unsolved',
    tags: ['Python', 'Preprocessing'],
    companies: ['microsoft'],
    description: `Write a custom helper function to split inputs \`X\` and labels \`y\` into training and testing sets based on a specified test ratio, maintaining correspondence.`,
    examples: [{ input: 'X, y, ratio=0.2', output: 'Returns X_train, X_test, y_train, y_test' }],
    constraints: ['Perform split along sample axis.'],
    starterCode: {
      python: `def train_test_split(X, y, test_ratio=0.2, shuffle=True):\n    pass`
    },
    testCases: [{ input: '10 items, ratio 0.2', output: 'Train count = 8, Test count = 2' }]
  },
  {
    id: 39,
    courseId: 4,
    courseTitle: 'AI & Machine Learning Foundations',
    title: 'Z-score Feature Normalization',
    difficulty: 'Easy',
    acceptance: '79.1%',
    status: 'unsolved',
    tags: ['Python', 'Preprocessing'],
    companies: ['amazon'],
    description: `Normalize data features using Z-score scaling: \`X_norm = (X - mean) / std\`. Return the normalized matrix, mean vector, and standard deviation vector.`,
    examples: [{ input: 'X = [[1, 2], [3, 4]]', output: 'Mean is [2, 3]' }],
    constraints: ['Compute mean and standard deviation along column axis.'],
    starterCode: {
      python: `import numpy as np\n\ndef z_normalize(X):\n    pass`
    },
    testCases: [{ input: 'X = [[2], [4]]', output: 'Mean = [3], Std = [1]' }]
  },
  {
    id: 40,
    courseId: 4,
    courseTitle: 'AI & Machine Learning Foundations',
    title: 'Compute Cosine Similarity',
    difficulty: 'Medium',
    acceptance: '68.2%',
    status: 'unsolved',
    tags: ['Python', 'Math', 'NLP'],
    companies: ['google', 'amazon', 'microsoft'],
    description: `Compute the cosine similarity between two non-zero vectors \`A\` and \`B\`: \`similarity = (A • B) / (||A|| * ||B||)\`.`,
    examples: [{ input: 'A = [1, 2], B = [1, 2]', output: '1.0' }],
    constraints: ['Vectors will not be zero vectors.'],
    starterCode: {
      python: `import numpy as np\n\ndef cosine_similarity(A, B):\n    pass`
    },
    testCases: [{ input: 'A=[1, 0], B=[0, 1]', output: '0.0' }]
  },

  // ==================== COURSE 5: DEVOPS (IDs 41-50) ====================
  {
    id: 41,
    courseId: 5,
    courseTitle: 'DevOps & Cloud Engineering Bootcamp',
    title: 'Dockerfile for Node.js Application',
    difficulty: 'Easy',
    acceptance: '79.3%',
    status: 'unsolved',
    tags: ['Docker', 'Containers'],
    companies: ['amazon'],
    description: `Write a Dockerfile that containerizes a standard Express/Node.js web application. Set base image node:18-alpine, copy package list, install dependencies, copy source, expose port 3000, and run npm start.`,
    examples: [{ input: 'Empty template', output: 'Completed Dockerfile specifications' }],
    constraints: ['Optimize image size by copying package.json before source code.'],
    starterCode: {
      javascript: `# Dockerfile\nFROM node:18-alpine\n# Write commands here`
    },
    testCases: [{ input: 'Build Dockerfile', output: 'Successfully builds Node image' }]
  },
  {
    id: 42,
    courseId: 5,
    courseTitle: 'DevOps & Cloud Engineering Bootcamp',
    title: 'Nginx Reverse Proxy Config',
    difficulty: 'Medium',
    acceptance: '64.5%',
    status: 'unsolved',
    tags: ['Nginx', 'Configuration'],
    companies: ['amazon', 'microsoft'],
    description: `Write an Nginx configuration snippet that sets up a reverse proxy. Forward incoming requests on port 80 to an upstream application server running at \`http://localhost:5000\`. Include standard proxy headers.`,
    examples: [{ input: 'Nginx template config block', output: 'location / block with proxy_pass configured' }],
    constraints: ['Set Host header and X-Real-IP.'],
    starterCode: {
      javascript: `server {\n  listen 80;\n  server_name localhost;\n\n  location / {\n    # Proxy settings here\n  }\n}`
    },
    testCases: [{ input: 'Nginx -t validation test', output: 'syntax is ok' }]
  },
  {
    id: 43,
    courseId: 5,
    courseTitle: 'DevOps & Cloud Engineering Bootcamp',
    title: 'GitHub Actions CI Pipeline',
    difficulty: 'Easy',
    acceptance: '73.4%',
    status: 'unsolved',
    tags: ['CI/CD', 'GitHub Actions'],
    companies: ['google', 'microsoft'],
    description: `Write a GitHub Actions CI pipeline configuration in YAML format. The pipeline should trigger on pull request to \`main\`, install node modules, and run test suites.`,
    examples: [{ input: 'Push triggers', output: 'YAML on: pull_request' }],
    constraints: ['Must run on ubuntu-latest environment.'],
    starterCode: {
      javascript: `name: Node CI\non:\n  pull_request:\n    branches: [ main ]\njobs:\n  # Write jobs here`
    },
    testCases: [{ input: 'Verify syntax', output: 'GitHub validator passed' }]
  },
  {
    id: 44,
    courseId: 5,
    courseTitle: 'DevOps & Cloud Engineering Bootcamp',
    title: 'Kubernetes Deployment YAML',
    difficulty: 'Medium',
    acceptance: '58.1%',
    status: 'unsolved',
    tags: ['Kubernetes', 'IaC'],
    companies: ['google', 'amazon'],
    description: `Write a Kubernetes Deployment manifest YAML file for an application named \`web-app\`. Create 3 replicas, using image \`web-app:v1\`, exposing port 80.`,
    examples: [{ input: 'Kubernetes specs', output: 'Deployment apiVersion: apps/v1' }],
    constraints: ['Include selector labels matching pod template labels.'],
    starterCode: {
      javascript: `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app-deployment\nspec:\n  # Complete specifications`
    },
    testCases: [{ input: 'kubectl dry-run checks', output: 'deployment created successfully (dry-run)' }]
  },
  {
    id: 45,
    courseId: 5,
    courseTitle: 'DevOps & Cloud Engineering Bootcamp',
    title: 'Terraform AWS S3 Bucket',
    difficulty: 'Easy',
    acceptance: '78.9%',
    status: 'unsolved',
    tags: ['Terraform', 'IaC'],
    companies: ['amazon', 'microsoft'],
    description: `Write a Terraform configuration script (\`main.tf\`) that declares a private AWS S3 bucket resource. Name the bucket dynamically and enable versioning.`,
    examples: [{ input: 'Bucket resource template', output: 'resource "aws_s3_bucket" code blocks' }],
    constraints: ['Configure bucket as private.'],
    starterCode: {
      javascript: `provider "aws" {\n  region = "us-east-1"\n}\n\n# Add S3 bucket resource here`
    },
    testCases: [{ input: 'terraform plan validation', output: 'Plan: 1 to add' }]
  },
  {
    id: 46,
    courseId: 5,
    courseTitle: 'DevOps & Cloud Engineering Bootcamp',
    title: 'Bash Script: Log Rotation',
    difficulty: 'Medium',
    acceptance: '62.7%',
    status: 'unsolved',
    tags: ['Bash', 'Linux'],
    companies: ['microsoft'],
    description: `Write a bash script that checks the size of a log file (\`/var/log/app.log\`). If the size exceeds 10MB, compress the log (gzip), rename it with a timestamp, and create a fresh log file.`,
    examples: [{ input: 'Execute bash script', output: 'Creates app.log.1.gz if size exceeds threshold' }],
    constraints: ['File operations must handle permission errors.'],
    starterCode: {
      javascript: `#!/bin/bash\nLOG_FILE="/var/log/app.log"\n# Write file rotation script`
    },
    testCases: [{ input: 'Test run with mock 15MB file', output: 'Creates rotated gzip file, size = 0 for app.log' }]
  },
  {
    id: 47,
    courseId: 5,
    courseTitle: 'DevOps & Cloud Engineering Bootcamp',
    title: 'Docker Compose Setup',
    difficulty: 'Medium',
    acceptance: '66.4%',
    status: 'unsolved',
    tags: ['Docker Compose', 'Containers'],
    companies: ['google'],
    description: `Create a \`docker-compose.yml\` configuration connecting a Node.js frontend service to a MongoDB database. Configure environment database URI and network mappings.`,
    examples: [{ input: 'Services mapping', output: 'services: web, db blocks' }],
    constraints: ['Ensure container startup order; web depends on db.'],
    starterCode: {
      javascript: `version: '3.8'\nservices:\n  # Node and MongoDB specifications`
    },
    testCases: [{ input: 'docker-compose up configurations', output: 'Frontend connects to DB' }]
  },
  {
    id: 48,
    courseId: 5,
    courseTitle: 'DevOps & Cloud Engineering Bootcamp',
    title: 'Prometheus Metrics Setup',
    difficulty: 'Medium',
    acceptance: '52.3%',
    status: 'unsolved',
    tags: ['Monitoring', 'Prometheus'],
    companies: ['google', 'amazon'],
    description: `Write instructions or a middleware block that exports default API system metrics (CPU, Memory, Request latency) to a \`/metrics\` endpoint scrapeable by Prometheus.`,
    examples: [{ input: 'Endpoint request', output: 'Returns Prometheus text exposition format metrics' }],
    constraints: ['Sub-second latency checks.'],
    starterCode: {
      javascript: `const express = require('express');\nconst client = require('prom-client');\nconst app = express();\n// Configure scrape metrics client`
    },
    testCases: [{ input: 'GET /metrics scrape', output: 'Status code = 200, parses correctly' }]
  },
  {
    id: 49,
    courseId: 5,
    courseTitle: 'DevOps & Cloud Engineering Bootcamp',
    title: 'Ansible Apache Installation',
    difficulty: 'Easy',
    acceptance: '71.5%',
    status: 'unsolved',
    tags: ['Ansible', 'IaC'],
    companies: ['microsoft'],
    description: `Write an Ansible playbook task that installs the Apache web server package (\`httpd\` or \`apache2\`) on target nodes and ensures the service is started and enabled on boot.`,
    examples: [{ input: 'Playbook tasks template', output: 'apt: name=apache2 state=present task' }],
    constraints: ['Must run with sudo privileges (become: yes).'],
    starterCode: {
      javascript: `- name: Install and start Apache\n  hosts: webservers\n  become: yes\n  tasks:\n    # Playbook tasks here`
    },
    testCases: [{ input: 'ansible-playbook syntax-check', output: 'Syntax passes' }]
  },
  {
    id: 50,
    courseId: 5,
    courseTitle: 'DevOps & Cloud Engineering Bootcamp',
    title: 'SSH Key Configuration',
    difficulty: 'Easy',
    acceptance: '85.4%',
    status: 'unsolved',
    tags: ['Security', 'Linux'],
    companies: ['amazon', 'microsoft'],
    description: `Detail the precise commands required to generate a secure SSH keypair (ED25519) on a client machine and transfer the public key to a remote host to enable passwordless logins.`,
    examples: [{ input: 'Key generation command', output: 'ssh-keygen -t ed25519' }],
    constraints: ['File permissions of ~/.ssh must remain secure.'],
    starterCode: {
      javascript: `# Write terminal commands\n$ ssh-keygen -t ed25519 ...`
    },
    testCases: [{ input: 'ssh login validation', output: 'Connects without password prompt' }]
  }
];
