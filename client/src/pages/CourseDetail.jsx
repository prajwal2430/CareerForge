import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
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
      {
        title: 'What are Data Structures?', duration: '15:24', completed: true, type: 'video', youtubeId: 'bum_19loj9A', desc: 'Learn about linear and non-linear data structures and their real-world applications.',
        notes: `## 📚 What are Data Structures?\n\nData structures are ways of **organizing and storing data** in a computer so that it can be accessed and modified efficiently.\n\n### Types\n| Category | Examples |\n|---|---|\n| **Linear** | Array, Linked List, Stack, Queue |\n| **Non-Linear** | Tree, Graph, Heap |\n| **Hash-Based** | HashMap, HashSet |\n\n### Why They Matter\n- Choosing the right data structure can reduce time complexity from O(N²) → O(N log N)\n- Memory efficiency depends on picking the right container\n- Interviews test your ability to choose optimal structures\n\n### Key Takeaways\n- Arrays: fast index access O(1), slow insert O(N)\n- Linked List: fast insert O(1), slow access O(N)\n- Stack: LIFO — use for undo/backtracking\n- Queue: FIFO — use for BFS, scheduling`
      },
      {
        title: 'Time & Space Complexity (Big O)', duration: '28:10', completed: true, type: 'video', youtubeId: '__vX2sjlpXU', desc: 'Analyze and compare algorithm efficiency using Big O complexity models.',
        notes: `## ⏱️ Big O Notation\n\nBig O describes the **worst-case growth rate** of an algorithm as input size N grows.\n\n### Common Complexities (Best → Worst)\n| Notation | Name | Example |\n|---|---|---|\n| O(1) | Constant | Array index access |\n| O(log N) | Logarithmic | Binary search |\n| O(N) | Linear | Loop through array |\n| O(N log N) | Linearithmic | Merge sort |\n| O(N²) | Quadratic | Nested loops |\n| O(2ⁿ) | Exponential | Recursive subsets |\n\n### Space Complexity\n- Count the **extra memory** your algorithm uses (not input)\n- Recursion uses O(depth) stack space\n\n### 💡 Pro Tips\n- Drop constants: O(2N) → O(N)\n- Drop lower terms: O(N² + N) → O(N²)\n- Always analyze both time AND space`
      },
      {
        title: 'Recursion Deep Dive', duration: '22:00', completed: false, type: 'video', youtubeId: 'IJDJ0kBx2LM', desc: 'Master recursion and understand the call stack with animated examples.',
        notes: `## 🔄 Recursion\n\nA function that **calls itself** with a smaller input until it hits a base case.\n\n### Structure of Every Recursive Function\n\`\`\`\nfunction recurse(input) {\n  // 1. Base case — STOP condition\n  if (input <= 0) return;\n  // 2. Recursive case — smaller problem\n  recurse(input - 1);\n}\n\`\`\`\n\n### Call Stack Visualization\n- Each call gets its own **stack frame**\n- Stack unwinds from bottom up when base case is hit\n- Risk: **Stack Overflow** if base case is wrong\n\n### Key Patterns\n- **Factorial**: n! = n × (n-1)!\n- **Fibonacci**: fib(n) = fib(n-1) + fib(n-2)\n- **Tree DFS**: recurse left → process → recurse right\n\n### 💡 Memoization\nCache results of repeated calls to avoid exponential blowup.`
      },
    ]
  },
  {
    section: 'Section 2: Arrays & Strings', duration: '3h 45m', expanded: false,
    lessons: [
      {
        title: 'Arrays Fundamentals', duration: '30:00', completed: false, type: 'video', youtubeId: 'QJNwK2uJyGs', desc: 'Master array storage, insertion, deletion, and traversal.',
        notes: `## 📦 Arrays\n\nContiguous block of memory storing elements of the **same type**.\n\n### Operations & Complexities\n| Operation | Time |\n|---|---|\n| Access by index | O(1) |\n| Search (unsorted) | O(N) |\n| Insert at end | O(1) amortized |\n| Insert at index | O(N) |\n| Delete at index | O(N) |\n\n### Common Patterns\n- **Prefix Sum**: precompute cumulative sums for range queries\n- **Kadane's Algorithm**: max subarray in O(N)\n- **Dutch National Flag**: 3-way partition\n\n### 💡 Must-Know Problems\n- Two Sum (Hash Map)\n- Best Time to Buy & Sell Stock (sliding min)\n- Product of Array Except Self (prefix × suffix)`
      },
      {
        title: 'Two Pointers Technique', duration: '45:00', completed: false, type: 'video', youtubeId: 'On03HWe2tZM', desc: 'Optimize search patterns using dual boundary pointers.',
        notes: `## 👆👆 Two Pointers\n\nUse **two indices** moving toward each other (or in same direction) to avoid nested loops.\n\n### When to Use\n- Sorted array problems\n- Pair/triplet sum problems\n- Palindrome checks\n- Removing duplicates\n\n### Template\n\`\`\`\nlet left = 0, right = arr.length - 1;\nwhile (left < right) {\n  if (condition) return answer;\n  else if (needBigger) left++;\n  else right--;\n}\n\`\`\`\n\n### Problems to Practice\n- Valid Palindrome\n- Container With Most Water\n- 3Sum → sort + two pointers\n- Merge Sorted Arrays`
      },
      {
        title: 'Sliding Window Pattern', duration: '50:00', completed: false, type: 'video', youtubeId: 'MK-NZ4hN7rs', desc: 'Reduce O(N²) loops to linear runtime using sliding window.',
        notes: `## 🪟 Sliding Window\n\nMaintain a **window** of elements that moves across the array, avoiding re-computation.\n\n### Fixed Window\n\`\`\`\n// Max sum of k consecutive elements\nlet sum = arr.slice(0,k).reduce(...)\nfor (let i = k; i < n; i++) {\n  sum += arr[i] - arr[i-k]; // slide\n}\n\`\`\`\n\n### Variable Window\n- Expand right pointer until condition breaks\n- Shrink left pointer to restore condition\n- Track max/min window size\n\n### Classic Problems\n- Longest Substring Without Repeating Characters → O(N)\n- Minimum Window Substring\n- Max Consecutive Ones III\n- Fruit Into Baskets`
      },
      {
        title: 'String Manipulation Techniques', duration: '35:00', completed: false, type: 'video', youtubeId: 'X7LqMvFMfkU', desc: 'Substring search, anagram detection, and palindrome checking.',
        notes: `## 🔤 String Techniques\n\n### Key Facts\n- Strings are **immutable** in Java/Python → O(N) concatenation\n- Use StringBuilder/list for efficient string building\n\n### Frequency Count Pattern\n\`\`\`\nconst freq = {};\nfor (const ch of s) freq[ch] = (freq[ch] || 0) + 1;\n\`\`\`\n\n### Anagram Check\n- Sort both strings and compare: O(N log N)\n- Or compare frequency maps: O(N)\n\n### Palindrome\n- Two pointers from both ends\n- Or compare with reverse\n\n### Problems to Practice\n- Valid Anagram\n- Group Anagrams\n- Longest Palindromic Substring (DP or Expand Around Center)\n- KMP Algorithm for pattern matching`
      },
      {
        title: 'Arrays Practice — Two Sum', duration: '1:00:00', completed: false, type: 'assignment', problemId: 1, problemTitle: 'Two Sum', desc: 'Identify indices of two array elements summing to a target value.',
        notes: `## 💻 Assignment: Two Sum\n\n### Problem\nGiven array nums and integer target, return indices of two numbers that add up to target.\n\n### Brute Force: O(N²)\n\`\`\`\nfor i in range(n):\n  for j in range(i+1, n):\n    if nums[i] + nums[j] == target: return [i,j]\n\`\`\`\n\n### Optimal: HashMap O(N)\n\`\`\`\nmap = {}\nfor i, num in enumerate(nums):\n  complement = target - num\n  if complement in map:\n    return [map[complement], i]\n  map[num] = i\n\`\`\`\n\n### Key Insight\nFor each number, check if its **complement** (target - num) already exists in the map.`
      },
    ]
  },
  {
    section: 'Section 3: Linked Lists', duration: '2h 30m', expanded: false,
    lessons: [
      {
        title: 'Singly Linked Lists', duration: '40:00', completed: false, type: 'video', youtubeId: 'njTh_OwMljA', desc: 'Node allocations, next pointers, and traversal algorithms.',
        notes: `## 🔗 Singly Linked List\n\nEach node holds **data + pointer to next** node. Head points to first node, tail's next = null.\n\n### Node Structure\n\`\`\`\nclass Node {\n  constructor(val) {\n    this.val = val;\n    this.next = null;\n  }\n}\n\`\`\`\n\n### Operations\n| Operation | Time |\n|---|---|\n| Insert at head | O(1) |\n| Insert at tail | O(N) or O(1) with tail pointer |\n| Delete by value | O(N) |\n| Search | O(N) |\n\n### Common Tricks\n- **Dummy head node** avoids edge cases for deletion\n- Traverse: while (curr !== null) curr = curr.next`
      },
      {
        title: 'Doubly & Circular Linked Lists', duration: '50:00', completed: false, type: 'video', youtubeId: 'Ast5seuIAaE', desc: 'Traverse forwards and backwards using prev/next links.',
        notes: `## 🔗🔗 Doubly Linked List\n\nEach node has **prev + next** pointers enabling bidirectional traversal.\n\n### Use Cases\n- Browser history (back/forward)\n- LRU Cache implementation\n- Undo/Redo functionality\n\n### Circular Linked List\n- Tail's next points back to head\n- Used in Round Robin scheduling\n- Detection: Floyd's cycle algorithm\n\n### 💡 LRU Cache = Doubly LL + HashMap\n- O(1) get: look up in map\n- O(1) put: move node to front in LL`
      },
      {
        title: 'Fast & Slow Pointers', duration: '30:00', completed: false, type: 'video', youtubeId: 'gBTe7lFR3vc', desc: 'Hare and Tortoise model for cycles and midpoints.',
        notes: `## 🐢🐇 Fast & Slow Pointers (Floyd's Algorithm)\n\nTwo pointers move at **different speeds** to detect cycles or find midpoints.\n\n### Cycle Detection\n\`\`\`\nlet slow = head, fast = head;\nwhile (fast && fast.next) {\n  slow = slow.next;\n  fast = fast.next.next;\n  if (slow === fast) return true; // cycle!\n}\nreturn false;\n\`\`\`\n\n### Find Middle Node\n- When fast reaches end, slow is at middle\n- Used for Merge Sort on Linked Lists\n\n### Problems\n- Linked List Cycle\n- Happy Number\n- Find Middle of Linked List\n- Palindrome Linked List`
      },
      {
        title: 'Quiz: Linked Lists', duration: '10:00', completed: false, type: 'quiz', question: 'Time complexity to insert at the beginning of a Singly Linked List?', options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'], answerIdx: 0,
        notes: `## ❓ Quiz Notes: Linked Lists\n\n### Answer Explained\n**O(1)** — Insert at head only requires:\n1. Create new node\n2. Set newNode.next = head\n3. Update head = newNode\n\nNo traversal needed — constant time regardless of list length.\n\n### Other Complexities to Remember\n- Insert at tail (no tail pointer): O(N)\n- Delete by value: O(N) — must traverse to find node\n- Search: O(N)\n- Access by index: O(N) — unlike arrays which are O(1)`
      },
    ]
  },
  {
    section: 'Section 4: Stacks & Queues', duration: '2h', expanded: false,
    lessons: [
      {
        title: 'Stack: LIFO Principle & Applications', duration: '35:00', completed: false, type: 'video', youtubeId: 'wjI1WNcIntg', desc: 'Balanced brackets, function call stack, monotonic stacks.',
        notes: `## 📚 Stack (LIFO)\n\nLast In, First Out — like a stack of plates.\n\n### Operations: All O(1)\n- push(x) — add to top\n- pop() — remove from top\n- peek() — view top without removing\n- isEmpty() — check if empty\n\n### Applications\n- **Balanced Brackets**: push open, pop on close\n- **Function Call Stack**: each call frame pushed\n- **Undo/Redo**: store states\n- **Monotonic Stack**: Next Greater Element\n\n### Monotonic Stack Template\n\`\`\`\nconst stack = [];\nfor (let i = 0; i < arr.length; i++) {\n  while (stack.length && arr[stack.top()] < arr[i])\n    process(stack.pop());\n  stack.push(i);\n}\n\`\`\``
      },
      {
        title: 'Queue & Deque', duration: '40:00', completed: false, type: 'video', youtubeId: 'zp6pBNbUB2U', desc: 'BFS traversal, sliding window maximum, circular queue.',
        notes: `## 📬 Queue (FIFO)\n\nFirst In, First Out — like a line at a ticket counter.\n\n### Queue Operations: All O(1)\n- enqueue(x) — add to rear\n- dequeue() — remove from front\n- front() — peek front element\n\n### BFS Template\n\`\`\`\nconst queue = [start];\nwhile (queue.length) {\n  const node = queue.shift();\n  for (const neighbor of graph[node]) {\n    if (!visited.has(neighbor)) {\n      visited.add(neighbor);\n      queue.push(neighbor);\n    }\n  }\n}\n\`\`\`\n\n### Deque (Double-Ended Queue)\n- Push/pop from both ends O(1)\n- **Sliding Window Maximum**: maintain decreasing deque`
      },
      {
        title: 'Priority Queue & Heap', duration: '45:00', completed: false, type: 'video', youtubeId: 'HqPJF2L5h9U', desc: 'Min/max heaps, heapify, and kth largest element problems.',
        notes: `## 🏔️ Heap / Priority Queue\n\nA **complete binary tree** where parent is always ≤ (min-heap) or ≥ (max-heap) its children.\n\n### Complexities\n| Operation | Time |\n|---|---|\n| Insert | O(log N) |\n| Get min/max | O(1) |\n| Extract min/max | O(log N) |\n| Build heap | O(N) |\n\n### Top K Pattern\n- **K largest**: use min-heap of size K\n- **K smallest**: use max-heap of size K\n\n### Heap Sort\n1. Build max-heap: O(N)\n2. Extract max N times: O(N log N)\n3. Total: O(N log N), Space: O(1)`
      },
    ]
  },
  {
    section: 'Section 5: Trees & Graphs', duration: '4h', expanded: false,
    lessons: [
      {
        title: 'Binary Trees — Traversals', duration: '50:00', completed: false, type: 'video', youtubeId: 'fAAZixBzIAI', desc: 'Inorder, preorder, postorder DFS traversals.',
        notes: `## 🌳 Binary Tree Traversals\n\n### DFS Traversals\n| Name | Order | Use Case |\n|---|---|---|\n| **Inorder** | Left → Root → Right | BST sorted output |\n| **Preorder** | Root → Left → Right | Copy/serialize tree |\n| **Postorder** | Left → Right → Root | Delete tree, evaluate expression |\n\n### BFS (Level-Order)\n- Use a queue, process level by level\n- Output: [[1],[2,3],[4,5,6,7]]\n\n### Inorder (Recursive)\n\`\`\`\nfunction inorder(node) {\n  if (!node) return;\n  inorder(node.left);\n  result.push(node.val);\n  inorder(node.right);\n}\n\`\`\``
      },
      {
        title: 'Binary Search Trees (BST)', duration: '45:00', completed: false, type: 'video', youtubeId: 'pYT9F8_LFTM', desc: 'Insert, search, delete in O(log N) time.',
        notes: `## 🌲 Binary Search Tree\n\nLeft subtree < root < right subtree at every node.\n\n### Complexities (balanced)\n| Operation | Average | Worst (skewed) |\n|---|---|---|\n| Search | O(log N) | O(N) |\n| Insert | O(log N) | O(N) |\n| Delete | O(log N) | O(N) |\n\n### Key Properties\n- Inorder traversal gives **sorted** output\n- Successor: leftmost in right subtree\n- Predecessor: rightmost in left subtree\n\n### Self-Balancing BSTs\n- **AVL Tree**: strictly balanced\n- **Red-Black Tree**: used in Java TreeMap, C++ map`
      },
      {
        title: 'Graph BFS & DFS', duration: '55:00', completed: false, type: 'video', youtubeId: 'oDqjPvD54Ss', desc: 'Adjacency lists, BFS shortest path, DFS cycle detection.',
        notes: `## 🕸️ Graphs\n\n### Representations\n- **Adjacency List**: space O(V+E), preferred for sparse graphs\n- **Adjacency Matrix**: O(V²) space, fast edge lookup\n\n### BFS — Shortest Path (unweighted)\n\`\`\`\nqueue = [start]; dist = {start: 0};\nwhile queue not empty:\n  node = queue.dequeue()\n  for neighbor in graph[node]:\n    if neighbor not in dist:\n      dist[neighbor] = dist[node] + 1\n      queue.enqueue(neighbor)\n\`\`\`\n\n### DFS — Cycle Detection\n- Track visited set + recursion stack\n- If neighbor is in rec-stack → cycle found\n\n### Topological Sort\n- DFS with finish-time ordering (Kahn's BFS also works)`
      },
      {
        title: 'Dynamic Programming Intro', duration: '50:00', completed: false, type: 'video', youtubeId: 'oBt53YbR9Kk', desc: 'Memoization, tabulation, knapsack problems.',
        notes: `## ⚡ Dynamic Programming\n\nBreak problem into **overlapping subproblems**, store solutions to avoid recomputation.\n\n### Two Approaches\n**Top-Down (Memoization)**\n\`\`\`\nconst memo = {};\nfunction fib(n) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  return memo[n] = fib(n-1) + fib(n-2);\n}\n\`\`\`\n\n**Bottom-Up (Tabulation)**\n\`\`\`\nconst dp = Array(n+1).fill(0);\ndp[1] = 1;\nfor (let i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];\n\`\`\`\n\n### Classic DP Problems\n- 0/1 Knapsack\n- Longest Common Subsequence\n- Coin Change (unbounded knapsack)\n- Longest Increasing Subsequence`
      },
      {
        title: 'Quiz: Trees & Graphs', duration: '10:00', completed: false, type: 'quiz', question: 'Which traversal visits the root node first?', options: ['Inorder', 'Preorder', 'Postorder', 'BFS'], answerIdx: 1,
        notes: `## ❓ Quiz Notes: Trees & Graphs\n\n### Answer: Preorder\n**Root → Left → Right** — visits root FIRST.\n\n### Memory Aid\n- **Pre**order = **Pre**fix = root comes BEFORE children\n- **In**order = root comes IN the middle (Left-Root-Right)\n- **Post**order = root comes AFTER children\n\n### BFS vs DFS\n- **BFS** is best for shortest path (unweighted)\n- **DFS** is best for exhaustive search, cycle detection, topological sort\n- Both have time O(V+E) and space O(V)`
      },
    ]
  }
];

const aptitudeCurriculum = [
  {
    section: 'Section 1: Quantitative Foundations', duration: '4h 15m', expanded: true,
    lessons: [
      {
        title: 'Intro to Quantitative Aptitude', duration: '20:00', completed: true, type: 'video', youtubeId: 'JZSPBtGERXs', desc: 'Placement exam formats, speed strategies, and arithmetic importance.',
        notes: `## 📐 Quantitative Aptitude Overview\n\n### Exam Pattern\n- **TCS**: 26 questions, 40 mins\n- **Infosys**: 16 questions, 25 mins\n- **Wipro**: 16 questions, 16 mins\n- **Capgemini**: 16 questions, 16 mins\n\n### Key Topics Covered\n1. Number Systems & HCF/LCM\n2. Percentages, Profit & Loss\n3. Time, Speed & Distance\n4. Time & Work\n5. Simple & Compound Interest\n6. Permutation & Combination\n7. Probability\n\n### 💡 Speed Strategy\n- Learn approximation techniques\n- Memorize squares (1–25), cubes (1–15)\n- Practice mental math daily`
      },
      {
        title: 'Speed Maths & Calculation Tricks', duration: '40:00', completed: true, type: 'video', youtubeId: 'kMBj2fp52tA', desc: 'Vedic math tricks, multiplication shortcuts, and division estimators.',
        notes: `## ⚡ Speed Maths Tricks\n\n### Multiplication Shortcuts\n**Multiply by 11**: 36 × 11 = 3(3+6)6 = 396\n\n**Squaring numbers ending in 5**:\n25² = (2×3) followed by 25 = 625\n\n**Multiply near 100**: 97 × 96 = (97-4)(96-3) with cross = 9312\n\n### Division Tricks\n- Divisible by 3: digit sum divisible by 3\n- Divisible by 9: digit sum divisible by 9\n- Divisible by 11: alternating digit sum = 0 or divisible by 11\n\n### Percentage Shortcuts\n- 10% = divide by 10\n- 5% = half of 10%\n- 15% = 10% + 5%\n- 25% = divide by 4`
      },
      {
        title: 'Number Systems & Properties', duration: '1:15:00', completed: false, type: 'video', youtubeId: 'WUvTyaaNkzM', desc: 'Prime numbers, divisibility, LCM/HCF, remainders.',
        notes: `## 🔢 Number Systems\n\n### HCF & LCM\n- **HCF** = Highest Common Factor (GCD)\n- **LCM** = Lowest Common Multiple\n- HCF × LCM = Product of two numbers\n\n### Finding HCF (Euclidean Algorithm)\n\`\`\`\nhcf(48, 18):\n  48 = 18×2 + 12\n  18 = 12×1 + 6\n  12 = 6×2 + 0\n  HCF = 6\n\`\`\`\n\n### Remainder Theorem\n- (a + b) mod m = ((a mod m) + (b mod m)) mod m\n- Useful for large power problems\n\n### Prime Numbers\n- 2 is the only even prime\n- To check primality: test divisors up to √N`
      },
      {
        title: 'Percentages, Profit & Loss', duration: '2:00:00', completed: false, type: 'video', youtubeId: 'aircAruvnKk', desc: 'Pricing, discount ratios, cost/sell margins.',
        notes: `## 💰 Percentages & Profit/Loss\n\n### Key Formulas\n- **Profit%** = (Profit / CP) × 100\n- **Loss%** = (Loss / CP) × 100\n- **SP** = CP × (100 + Profit%) / 100\n- **CP** = SP × 100 / (100 + Profit%)\n\n### Successive Discounts\nTwo discounts of a% and b%:\nNet discount = a + b − (ab/100)\n\n### Markup vs Discount\n- Marked Price: price before discount\n- Selling Price = MP × (1 − discount%/100)\n\n### 💡 Trick: Equal % Profit and Loss\nIf article sold at x% profit and another at x% loss:\nNet result = **Loss** of x²/100 %`
      },
    ]
  },
  {
    section: 'Section 2: Arithmetic Word Problems', duration: '6h 30m', expanded: false,
    lessons: [
      {
        title: 'Ratio & Proportion', duration: '45:00', completed: false, type: 'video', youtubeId: 'HAnw168huqA', desc: 'Proportion metrics, shares, mixtures.',
        notes: `## ⚖️ Ratio & Proportion\n\n### Key Concepts\n- Ratio a:b means a/b parts\n- If a:b = c:d → ad = bc (cross multiply)\n\n### Mixture Problems (Alligation)\n- Cheaper : Dearer = (Dearer − Mean) : (Mean − Cheaper)\n\n### Partnership\n- Profit ratio = Ratio of (Capital × Time)\n- If A: ₹5000 for 12 months, B: ₹8000 for 9 months\n- Ratio = 5000×12 : 8000×9 = 60000 : 72000 = 5:6\n\n### 💡 Shortcut for Ratio Problems\nWhen ratio changes: multiply/divide both sides by same number`
      },
      {
        title: 'Time, Speed and Distance', duration: '1:45:00', completed: false, type: 'video', youtubeId: 'Kas0tIxDvrg', desc: 'Relative speeds, train overtaking, river flow equations.',
        notes: `## 🚂 Time, Speed & Distance\n\n### Core Formula\n- **Distance** = Speed × Time\n- Speed (km/h to m/s): multiply by 5/18\n- Speed (m/s to km/h): multiply by 18/5\n\n### Train Problems\n- Crossing pole: distance = Length of train\n- Crossing platform: distance = Train + Platform\n- Two trains (same dir): relative speed = S1 − S2\n- Two trains (opp dir): relative speed = S1 + S2\n\n### Boat & Stream\n- Downstream: speed = Boat + Current\n- Upstream: speed = Boat − Current\n- Boat speed = (D + U) / 2\n- Current speed = (D − U) / 2`
      },
      {
        title: 'Practice Test — Palindrome Number', duration: '2:00:00', completed: false, type: 'assignment', problemId: 9, problemTitle: 'Palindrome Number', desc: 'Solidify quantitative reasoning with coding practice.',
        notes: `## 💻 Practice: Palindrome Number\n\n### Problem\nDetermine if an integer is a palindrome without converting to string.\n\n### Approach 1: Reverse half the number\n\`\`\`python\nif x < 0 or (x % 10 == 0 and x != 0): return False\nreversed_half = 0\nwhile x > reversed_half:\n    reversed_half = reversed_half * 10 + x % 10\n    x //= 10\nreturn x == reversed_half or x == reversed_half // 10\n\`\`\`\n\n### Why this works\n- Only reverse the second half\n- Compare with first half\n- Handle odd-digit numbers: x == reversed_half // 10`
      },
    ]
  },
  {
    section: 'Section 3: Logical Reasoning', duration: '5h', expanded: false,
    lessons: [
      {
        title: 'Syllogisms & Venn Diagrams', duration: '1:30:00', completed: false, type: 'video', youtubeId: 'RKHx8dYrfaA', desc: 'Evaluate logical validity using visual Venn intersections.',
        notes: `## 🔵 Syllogisms & Venn Diagrams\n\n### Types of Statements\n- **Universal Affirmative**: All A are B\n- **Universal Negative**: No A is B\n- **Particular Affirmative**: Some A are B\n- **Particular Negative**: Some A are not B\n\n### Venn Diagram Rules\n- "All A are B" → A circle inside B circle\n- "No A is B" → Completely separate circles\n- "Some A are B" → Partially overlapping circles\n\n### Conclusion Rules\n- All + All = All\n- All + Some = Some\n- Some + All = Some\n- Some + Some = No conclusion\n- All + No = No\n\n### 💡 Quick Test: Draw circles before answering`
      },
      {
        title: 'Quiz: Reasoning Ability', duration: '10:00', completed: false, type: 'quiz', question: 'If "STATION" is coded as "URCVMQP", what will be the code for "RAILWAY"?', options: ['TCKNXCA', 'TCKNXAC', 'TCLOYAB', 'SCKNYBD'], answerIdx: 0,
        notes: `## ❓ Quiz Notes: Coding-Decoding\n\n### Pattern Analysis\nSTATION → URCVMQP\n- S → U (+2)\n- T → R (−2)\n- A → C (+2)\n- T → V (−2) ... alternating +2, −2\n\n### Approach for Coding Problems\n1. Check letter shift (same shift or alternating)\n2. Check reverse coding\n3. Check position swap\n4. Check number-to-letter substitution\n\n### 💡 Common Patterns\n- +1 to each letter\n- Reverse the word then shift\n- Odd positions +1, even positions −1`
      },
    ]
  }
];

const webDevCurriculum = [
  {
    section: 'Section 1: HTML & CSS Mastery', duration: '2h 30m', expanded: true,
    lessons: [
      {
        title: 'HTML5 Semantic Elements', duration: '30:00', completed: true, type: 'video', youtubeId: 'kUMe1FH4CHE', desc: 'Forms, tables, semantic HTML5 layout best practices.',
        notes: `## 🌐 HTML5 Semantic Elements\n\n### Why Semantics Matter\n- Improves **SEO** (search engines understand structure)\n- Better **accessibility** for screen readers\n- Cleaner, self-documenting code\n\n### Key Semantic Tags\n\`\`\`html\n<header>    <!-- site/page header -->\n<nav>       <!-- navigation links -->\n<main>      <!-- primary content -->\n<section>   <!-- thematic grouping -->\n<article>   <!-- standalone content -->\n<aside>     <!-- sidebar/related -->\n<footer>    <!-- page footer -->\n\`\`\`\n\n### Forms Best Practices\n- Always use <label> with htmlFor matching input id\n- Use type="email", type="number" for built-in validation\n- fieldset + legend for grouped inputs`
      },
      {
        title: 'CSS Flexbox & Grid', duration: '45:00', completed: true, type: 'video', youtubeId: 'tXIhdp5R7sc', desc: 'Responsive layout systems with Flexbox and CSS Grid.',
        notes: `## 🎨 Flexbox & CSS Grid\n\n### Flexbox (1D)\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: center;  /* main axis */\n  align-items: center;      /* cross axis */\n  gap: 16px;\n  flex-wrap: wrap;\n}\n.item { flex: 1; }         /* equal width */\n\`\`\`\n\n### CSS Grid (2D)\n\`\`\`css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: auto;\n  gap: 20px;\n}\n\`\`\`\n\n### When to Use Which\n- **Flexbox**: navigation bars, card rows, centering\n- **Grid**: page layouts, image galleries, dashboards`
      },
      {
        title: 'CSS Animations & Variables', duration: '35:00', completed: false, type: 'video', youtubeId: 'YszONjKpgg4', desc: 'Keyframe animations, transitions, and CSS custom properties.',
        notes: `## ✨ CSS Animations & Variables\n\n### Custom Properties (Variables)\n\`\`\`css\n:root {\n  --primary: #0D9488;\n  --radius: 12px;\n  --space-4: 16px;\n}\n.btn { background: var(--primary); border-radius: var(--radius); }\n\`\`\`\n\n### Transitions\n\`\`\`css\n.btn {\n  transition: all 0.3s ease;\n}\n.btn:hover { transform: translateY(-4px); }\n\`\`\`\n\n### Keyframe Animations\n\`\`\`css\n@keyframes fadeInUp {\n  from { opacity: 0; transform: translateY(20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n.element { animation: fadeInUp 0.5s ease forwards; }\n\`\`\``
      },
    ]
  },
  {
    section: 'Section 2: JavaScript & ES6+', duration: '3h 15m', expanded: false,
    lessons: [
      {
        title: 'ES6+ Javascript Fundamentals', duration: '35:00', completed: false, type: 'video', youtubeId: 'W6NZfCO5SIk', desc: 'Arrow functions, destructuring, async/await.',
        notes: `## ⚡ ES6+ Key Features\n\n### Arrow Functions\n\`\`\`js\n// ES5\nconst add = function(a, b) { return a + b; }\n// ES6\nconst add = (a, b) => a + b;\n\`\`\`\n\n### Destructuring\n\`\`\`js\nconst { name, age } = user;       // object\nconst [first, ...rest] = array;   // array\n\`\`\`\n\n### Spread & Rest\n\`\`\`js\nconst merged = { ...obj1, ...obj2 };\nfunction sum(...nums) { return nums.reduce((a,b)=>a+b,0); }\n\`\`\`\n\n### Optional Chaining & Nullish Coalescing\n\`\`\`js\nconst city = user?.address?.city ?? 'Unknown';\n\`\`\``
      },
      {
        title: 'Promises & Async/Await', duration: '40:00', completed: false, type: 'video', youtubeId: 'PoRJizFvM7s', desc: 'Callbacks, Promise chaining, and async error handling.',
        notes: `## 🔄 Async JavaScript\n\n### Callback Hell → Promises → Async/Await\n\n### Promise\n\`\`\`js\nfetch('/api/data')\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));\n\`\`\`\n\n### Async/Await (cleaner)\n\`\`\`js\nasync function getData() {\n  try {\n    const res = await fetch('/api/data');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n}\n\`\`\`\n\n### Promise.all — parallel requests\n\`\`\`js\nconst [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);\n\`\`\``
      },
      {
        title: 'DOM Manipulation & Events', duration: '45:00', completed: false, type: 'video', youtubeId: '5fb2aPlgoys', desc: 'Select, create, modify DOM elements and attach events.',
        notes: `## 🖱️ DOM Manipulation\n\n### Selecting Elements\n\`\`\`js\ndocument.getElementById('id');\ndocument.querySelector('.class');  // first match\ndocument.querySelectorAll('div');  // all matches\n\`\`\`\n\n### Modifying Elements\n\`\`\`js\nel.textContent = 'Hello';       // safe text\nel.innerHTML = '<b>Bold</b>';   // renders HTML\nel.style.color = 'teal';\nel.classList.add('active');\nel.classList.toggle('open');\n\`\`\`\n\n### Events\n\`\`\`js\nbtn.addEventListener('click', (e) => {\n  e.preventDefault();\n  console.log('clicked');\n});\n\`\`\`\n\n### Event Delegation\nAttach ONE listener to parent, handle children via e.target`
      },
      {
        title: 'Fetch API & REST Calls', duration: '35:00', completed: false, type: 'video', youtubeId: 'cuEtnrL9-H0', desc: 'GET/POST requests, JSON parsing, and error handling.',
        notes: `## 🌐 Fetch API\n\n### GET Request\n\`\`\`js\nconst res = await fetch('https://api.example.com/users');\nif (!res.ok) throw new Error('Failed: ' + res.status);\nconst users = await res.json();\n\`\`\`\n\n### POST Request\n\`\`\`js\nconst res = await fetch('/api/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Prajwal', age: 22 })\n});\n\`\`\`\n\n### HTTP Status Codes to Know\n- 200 OK, 201 Created\n- 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found\n- 500 Internal Server Error`
      },
    ]
  },
  {
    section: 'Section 3: React.js Deep Dive', duration: '4h', expanded: false,
    lessons: [
      {
        title: 'React.js Crash Course', duration: '1:10:00', completed: false, type: 'video', youtubeId: 'w7ejDZ8SWv8', desc: 'Components, props, state, and hooks.',
        notes: `## ⚛️ React Core Concepts\n\n### Component Types\n\`\`\`jsx\n// Functional (preferred)\nconst Button = ({ label, onClick }) => (\n  <button onClick={onClick}>{label}</button>\n);\n\`\`\`\n\n### State with useState\n\`\`\`jsx\nconst [count, setCount] = useState(0);\n<button onClick={() => setCount(c => c + 1)}>{count}</button>\n\`\`\`\n\n### Props\n- Parent to child data flow\n- Always read-only in child\n- Use callback props for child → parent communication\n\n### Virtual DOM\n- React diffs new vs old VDOM\n- Updates only changed real DOM nodes`
      },
      {
        title: 'useEffect, useContext & Custom Hooks', duration: '50:00', completed: false, type: 'video', youtubeId: 'TNhaISOUy6Q', desc: 'Side effects, global state management, and reusable logic.',
        notes: `## 🎣 React Hooks\n\n### useEffect\n\`\`\`jsx\nuseEffect(() => {\n  fetchData(); // runs after every render\n  return () => cleanup(); // cleanup\n}, [dependency]); // [] = only on mount\n\`\`\`\n\n### useContext — global state without prop drilling\n\`\`\`jsx\nconst ThemeContext = createContext('light');\nconst theme = useContext(ThemeContext);\n\`\`\`\n\n### Custom Hook Pattern\n\`\`\`jsx\nfunction useLocalStorage(key, init) {\n  const [value, setValue] = useState(\n    () => JSON.parse(localStorage.getItem(key)) ?? init\n  );\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n  return [value, setValue];\n}\n\`\`\``
      },
      {
        title: 'React Router & Navigation', duration: '35:00', completed: false, type: 'video', youtubeId: 'Ul3y1LXxzdU', desc: 'Client-side routing, dynamic routes, and protected routes.',
        notes: `## 🗺️ React Router v6\n\n### Setup\n\`\`\`jsx\n<BrowserRouter>\n  <Routes>\n    <Route path="/" element={<Home />} />\n    <Route path="/courses/:id" element={<CourseDetail />} />\n    <Route path="*" element={<NotFound />} />\n  </Routes>\n</BrowserRouter>\n\`\`\`\n\n### Navigation\n\`\`\`jsx\nconst navigate = useNavigate();\nnavigate('/courses/1');         // programmatic\n<Link to="/courses">Courses</Link>  // declarative\n\`\`\`\n\n### Dynamic Params\n\`\`\`jsx\nconst { id } = useParams(); // from :id in route\n\`\`\`\n\n### Protected Route Pattern\n\`\`\`jsx\nconst ProtectedRoute = ({ children }) =>\n  isLoggedIn ? children : <Navigate to="/login" />;\n\`\`\``
      },
      {
        title: 'Quiz: React Fundamentals', duration: '10:00', completed: false, type: 'quiz', question: 'Which hook is used to run side effects after render?', options: ['useState', 'useEffect', 'useRef', 'useMemo'], answerIdx: 1,
        notes: `## ❓ Quiz Notes: React Hooks\n\n### Answer: useEffect\nRuns **after the component renders** — used for: API calls, subscriptions, DOM side effects.\n\n### All Core Hooks Summary\n| Hook | Purpose |\n|---|---|\n| useState | Local component state |\n| useEffect | Side effects after render |\n| useRef | Mutable ref without re-render |\n| useMemo | Memoize expensive values |\n| useCallback | Memoize functions |\n| useContext | Consume context values |\n| useReducer | Complex state logic |`
      },
    ]
  },
  {
    section: 'Section 4: Node.js & REST APIs', duration: '4h', expanded: false,
    lessons: [
      {
        title: 'Node.js & Express Crash Course', duration: '1:15:00', completed: false, type: 'video', youtubeId: 'fBNz5xF-Kx4', desc: 'Route parameters, response bodies, middleware.',
        notes: `## 🟢 Node.js & Express\n\n### Basic Express Server\n\`\`\`js\nconst express = require('express');\nconst app = express();\napp.use(express.json()); // parse JSON body\n\napp.get('/users', (req, res) => {\n  res.json({ users: [] });\n});\n\napp.listen(3000);\n\`\`\`\n\n### Route Parameters\n\`\`\`js\napp.get('/users/:id', (req, res) => {\n  const { id } = req.params;\n  const { page } = req.query; // query string\n});\n\`\`\`\n\n### Middleware\n\`\`\`js\n// Custom middleware\napp.use((req, res, next) => {\n  console.log(req.method, req.url);\n  next(); // pass to next handler\n});\n\`\`\``
      },
      {
        title: 'MongoDB & Mongoose ODM', duration: '1:00:00', completed: false, type: 'video', youtubeId: '-56x56UppqQ', desc: 'CRUD operations, schemas, and data validation.',
        notes: `## 🍃 MongoDB & Mongoose\n\n### Mongoose Schema\n\`\`\`js\nconst userSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  email: { type: String, unique: true },\n  createdAt: { type: Date, default: Date.now }\n});\nconst User = mongoose.model('User', userSchema);\n\`\`\`\n\n### CRUD Operations\n\`\`\`js\nawait User.create({ name: 'Prajwal' });      // Create\nawait User.find({ age: { $gt: 18 } });      // Read\nawait User.findByIdAndUpdate(id, update);   // Update\nawait User.findByIdAndDelete(id);           // Delete\n\`\`\`\n\n### Relationships\n- Embed for 1:1 or small 1:N\n- Reference (populate) for large N:N`
      },
      {
        title: 'JWT Authentication', duration: '55:00', completed: false, type: 'video', youtubeId: 'mbsmsi7l3r4', desc: 'Sign, verify JWT tokens and implement secure auth flow.',
        notes: `## 🔐 JWT Authentication\n\n### JWT Structure\n\`\`\`\nHeader.Payload.Signature\n\`\`\`\n- **Header**: algorithm (HS256)\n- **Payload**: userId, role, expiry\n- **Signature**: HMAC of header+payload with secret\n\n### Sign Token\n\`\`\`js\nconst token = jwt.sign(\n  { userId: user._id, role: 'user' },\n  process.env.JWT_SECRET,\n  { expiresIn: '7d' }\n);\n\`\`\`\n\n### Verify Middleware\n\`\`\`js\nconst protect = (req, res, next) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  const decoded = jwt.verify(token, process.env.JWT_SECRET);\n  req.user = decoded;\n  next();\n};\n\`\`\``
      },
      {
        title: 'Quiz: REST & Routing', duration: '10:00', completed: false, type: 'quiz', question: 'Which HTTP method partially updates an existing resource?', options: ['GET', 'POST', 'PUT', 'PATCH'], answerIdx: 3,
        notes: `## ❓ Quiz Notes: HTTP Methods\n\n### Answer: PATCH\n**PATCH** → partial update. Only send changed fields.\n\n### All HTTP Methods\n| Method | Purpose | Body? |\n|---|---|---|\n| GET | Read resource | No |\n| POST | Create resource | Yes |\n| PUT | Replace entire resource | Yes |\n| PATCH | Partial update | Yes |\n| DELETE | Remove resource | No |\n\n### REST Conventions\n- GET /users → list all\n- GET /users/:id → get one\n- POST /users → create\n- PUT /users/:id → replace\n- PATCH /users/:id → update\n- DELETE /users/:id → delete`
      },
    ]
  },
  {
    section: 'Section 5: Deployment & Performance', duration: '2h', expanded: false,
    lessons: [
      {
        title: 'Deploy to Vercel & Railway', duration: '40:00', completed: false, type: 'video', youtubeId: 'mHnBZwHHBHE', desc: 'CI/CD pipelines for frontend and backend deployment.',
        notes: `## 🚀 Deployment\n\n### Frontend → Vercel\n1. Push code to GitHub\n2. Import repo in vercel.com\n3. Set build command: \`npm run build\`\n4. Set output dir: \`dist\` or \`build\`\n5. Add environment variables\n6. Auto-deploys on every git push\n\n### Backend → Railway\n1. Connect GitHub repo\n2. Set environment variables (PORT, MONGO_URI, JWT_SECRET)\n3. Railway auto-detects Node.js\n4. Set start command: \`node server.js\`\n\n### Environment Variables\n- Never commit .env to git\n- Use .env.example as template\n- Add CORS origin for production domain`
      },
      {
        title: 'Web Performance Optimization', duration: '45:00', completed: false, type: 'video', youtubeId: 'AQqFZ5t8uNc', desc: 'Lazy loading, code splitting, and Lighthouse audits.',
        notes: `## ⚡ Web Performance\n\n### Core Web Vitals\n- **LCP** (Largest Contentful Paint): < 2.5s\n- **FID** (First Input Delay): < 100ms\n- **CLS** (Cumulative Layout Shift): < 0.1\n\n### Code Splitting (React)\n\`\`\`jsx\nconst Dashboard = lazy(() => import('./Dashboard'));\n<Suspense fallback={<Spinner />}>\n  <Dashboard />\n</Suspense>\n\`\`\`\n\n### Image Optimization\n- Use WebP format (30% smaller)\n- Set explicit width/height to prevent CLS\n- Use loading="lazy" for below-fold images\n\n### Caching\n- Set Cache-Control headers\n- Use service workers for offline support`
      },
    ]
  }
];

const systemDesignCurriculum = [
  {
    section: 'Section 1: Scaling & Load Balancing', duration: '4h 30m', expanded: true,
    lessons: [
      {
        title: 'System Design Fundamentals', duration: '1:10:00', completed: true, type: 'video', youtubeId: 'xpDnVSmNFX0', desc: 'CPU/RAM bottlenecks vs horizontal node clusters.',
        notes: `## 🏗️ System Design Fundamentals\n\n### Key Requirements\n- **Functional**: what the system does\n- **Non-Functional**: scalability, availability, latency\n\n### Scaling Types\n| Type | How | When |\n|---|---|---|\n| **Vertical** | Bigger machine | Simpler, limited |\n| **Horizontal** | More machines | Complex, unlimited |\n\n### Availability\n- 99.9% = 8.7 hours downtime/year\n- 99.99% = 52 minutes/year\n- 99.999% = 5 minutes/year\n\n### Latency Numbers to Know\n- L1 cache: 1ns\n- RAM: 100ns\n- SSD: 100μs\n- Network (same DC): 1ms\n- Network (across world): 150ms`
      },
      {
        title: 'Load Balancers Explained', duration: '1:45:00', completed: false, type: 'video', youtubeId: 'K0Ta65OqQkY', desc: 'Round-robin, IP hash, least connections, Nginx configs.',
        notes: `## ⚖️ Load Balancers\n\nDistribute incoming traffic across multiple server instances.\n\n### Algorithms\n- **Round Robin**: rotate requests evenly\n- **Weighted Round Robin**: more traffic to stronger servers\n- **Least Connections**: route to least busy server\n- **IP Hash**: same client → same server (session affinity)\n\n### Layer 4 vs Layer 7\n- **L4** (Transport): routes by IP/port, fast\n- **L7** (Application): routes by URL/headers, smarter\n\n### Health Checks\n- Regularly ping servers\n- Remove unhealthy servers from rotation\n\n### 💡 Single Point of Failure\nUse **active-passive** or **active-active** LB pairs for HA`
      },
      {
        title: 'Reading: CAP Theorem', duration: '35:00', completed: false, type: 'video', youtubeId: 'r2Ep2ERYAVE', desc: 'Consistency, Availability, Partition Tolerance tradeoffs.',
        notes: `## 📐 CAP Theorem\n\nA distributed system can guarantee **at most 2 of 3**:\n\n### The Three Properties\n- **C**onsistency: every read returns most recent write\n- **A**vailability: every request gets a non-error response\n- **P**artition Tolerance: system works despite network splits\n\n### In Practice\n- Network partitions **always happen** → must choose CP or AP\n- **CP Systems**: MongoDB, HBase, Redis (sacrifice availability)\n- **AP Systems**: Cassandra, CouchDB (sacrifice consistency)\n- **CA Systems**: only in single-node (no partition tolerance)\n\n### BASE vs ACID\n- **ACID**: Atomic, Consistent, Isolated, Durable (SQL)\n- **BASE**: Basically Available, Soft state, Eventually consistent (NoSQL)`
      },
    ]
  },
  {
    section: 'Section 2: Database Partitioning & Cache', duration: '5h 15m', expanded: false,
    lessons: [
      {
        title: 'Sharding & Replication Models', duration: '2:00:00', completed: false, type: 'video', youtubeId: '5faMjKuB9bc', desc: 'Hash/range partitioning, multi-leader replication.',
        notes: `## 💾 Sharding & Replication\n\n### Sharding (Horizontal Partitioning)\nSplit data across multiple DB servers.\n\n**Strategies:**\n- **Hash Sharding**: hash(userId) % N_shards\n- **Range Sharding**: A-M on shard1, N-Z on shard2\n- **Directory Sharding**: lookup table maps keys to shards\n\n### Replication\n| Model | Description |\n|---|---|\n| **Single Leader** | All writes to primary, reads from replicas |\n| **Multi-Leader** | Multiple primaries (conflict resolution needed) |\n| **Leaderless** | Any node accepts writes (Dynamo-style) |\n\n### Replication Lag\n- Async replication: fast but stale reads possible\n- Sync replication: consistent but slow`
      },
      {
        title: 'Caching Assignment', duration: '2:15:00', completed: false, type: 'assignment', problemId: 3, problemTitle: 'Longest Substring Without Repeating Characters', desc: 'Sliding window algorithm representing sub-cache keys.',
        notes: `## 💻 Caching Concepts\n\n### Cache Strategies\n- **Cache-Aside (Lazy)**: app checks cache → miss → load from DB → populate cache\n- **Write-Through**: write to cache and DB simultaneously\n- **Write-Behind**: write to cache, async flush to DB\n- **Read-Through**: cache handles DB reads automatically\n\n### Cache Eviction Policies\n- **LRU** (Least Recently Used) — most common\n- **LFU** (Least Frequently Used)\n- **FIFO** (First In First Out)\n- **TTL** (Time To Live)\n\n### Redis Data Structures\n- String, Hash, List, Set, Sorted Set\n- Use Sorted Set for leaderboards\n- Use Hash for user session storage`
      },
      {
        title: 'Quiz: Caching & Partitioning', duration: '10:00', completed: false, type: 'quiz', question: 'What eviction strategy discards least recently used items?', options: ['FIFO', 'LRU', 'LFU', 'MRU'], answerIdx: 1,
        notes: `## ❓ Quiz Notes: Cache Eviction\n\n### Answer: LRU\n**LRU** = Least Recently Used — evicts the item that was accessed **longest ago**.\n\n### LRU Implementation\n- **HashMap + Doubly Linked List** → all operations O(1)\n- LinkedHashMap in Java implements LRU natively\n\n### When to Use Which\n| Policy | Best For |\n|---|---|\n| LRU | General web caching, sessions |\n| LFU | Content that doesn't age (popular videos) |\n| FIFO | Simple queue-based eviction |\n| TTL | Time-sensitive data (OTPs, tokens) |`
      },
    ]
  }
];

const aimlCurriculum = [
  {
    section: 'Section 1: Python & Math Foundations', duration: '3h', expanded: true,
    lessons: [
      {
        title: 'Python for Machine Learning', duration: '50:00', completed: true, type: 'video', youtubeId: '_uQrJ0TkZlc', desc: 'Python essentials, list comprehensions, and OOP for ML.',
        notes: `## 🐍 Python for ML\n\n### List Comprehensions\n\`\`\`python\nsquares = [x**2 for x in range(10)]\nevens   = [x for x in range(20) if x % 2 == 0]\n\`\`\`\n\n### Lambda & Map/Filter\n\`\`\`python\ndouble = lambda x: x * 2\ndoubled = list(map(double, [1,2,3]))\nevens   = list(filter(lambda x: x%2==0, [1,2,3,4]))\n\`\`\`\n\n### Classes for ML\n\`\`\`python\nclass LinearRegression:\n    def __init__(self): self.weights = None\n    def fit(self, X, y): pass\n    def predict(self, X): pass\n\`\`\`\n\n### Essential Libraries\n- **NumPy**: numerical arrays\n- **Pandas**: data frames\n- **Matplotlib/Seaborn**: visualization\n- **Scikit-learn**: ML algorithms`
      },
      {
        title: 'Linear Algebra for ML', duration: '45:00', completed: true, type: 'video', youtubeId: 'JnTa9X1j55I', desc: 'Vectors, matrices, dot products, and eigenvalues explained.',
        notes: `## 📐 Linear Algebra for ML\n\n### Vectors & Matrices\n\`\`\`python\nimport numpy as np\nv = np.array([1, 2, 3])        # vector\nA = np.array([[1,2],[3,4]])     # matrix\n\`\`\`\n\n### Key Operations\n- **Dot Product**: similarity between vectors\n- **Matrix Multiply**: linear transformations\n- **Transpose**: A.T — swap rows/cols\n- **Inverse**: A⁻¹ — solve linear systems\n\n### Why It Matters\n- Neural networks = matrix multiplications\n- PCA uses eigenvalues/eigenvectors\n- Distance metrics use vector norms\n\n### Norms\n- L1 (Manhattan): |x₁| + |x₂| + ...\n- L2 (Euclidean): √(x₁² + x₂² + ...)`
      },
      {
        title: 'Statistics & Probability', duration: '55:00', completed: false, type: 'video', youtubeId: 'xxpc-HPKN28', desc: 'Mean, variance, Bayes theorem, distributions for ML.',
        notes: `## 📊 Statistics for ML\n\n### Descriptive Stats\n- **Mean**: average value\n- **Median**: middle value (robust to outliers)\n- **Variance**: σ² = avg of squared deviations\n- **Std Dev**: σ = √variance\n\n### Key Distributions\n| Distribution | Use Case |\n|---|---|\n| **Normal/Gaussian** | Most natural phenomena |\n| **Bernoulli** | Binary outcomes |\n| **Binomial** | N binary trials |\n| **Poisson** | Count of events in time window |\n\n### Bayes' Theorem\n\`\`\`\nP(A|B) = P(B|A) × P(A) / P(B)\n\`\`\`\n- Used in Naive Bayes classifier\n- Posterior = Likelihood × Prior / Evidence`
      },
    ]
  },
  {
    section: 'Section 2: Data Processing with NumPy & Pandas', duration: '2h 30m', expanded: false,
    lessons: [
      {
        title: 'NumPy Arrays & Operations', duration: '40:00', completed: false, type: 'video', youtubeId: 'QUT1VHiLmmI', desc: 'Array creation, slicing, broadcasting for numerical computing.',
        notes: `## 🔢 NumPy\n\n### Array Creation\n\`\`\`python\nnp.zeros((3,4))           # 3×4 zeros\nnp.ones((2,3))            # 3×4 ones\nnp.linspace(0,1,100)      # 100 points 0→1\nnp.random.randn(5,5)      # normal distribution\n\`\`\`\n\n### Slicing\n\`\`\`python\narr[1:3, :]       # rows 1-2, all cols\narr[:, 0]         # all rows, col 0\narr[arr > 5]      # boolean mask\n\`\`\`\n\n### Broadcasting\n- Operations between different-shaped arrays\n- (3,1) + (1,4) → (3,4) automatically\n\n### Vectorization\n- Always prefer np operations over Python loops\n- 100× faster due to C-level optimizations`
      },
      {
        title: 'Pandas DataFrames', duration: '50:00', completed: false, type: 'video', youtubeId: 'vmEHCJofslg', desc: 'Load, clean, transform, and analyze tabular data.',
        notes: `## 🐼 Pandas\n\n### Loading Data\n\`\`\`python\ndf = pd.read_csv('data.csv')\ndf.head()           # first 5 rows\ndf.info()           # dtypes & nulls\ndf.describe()       # statistics\n\`\`\`\n\n### Cleaning\n\`\`\`python\ndf.dropna()                        # drop null rows\ndf.fillna(df.mean())               # fill with mean\ndf.drop_duplicates()\ndf['col'].astype(int)              # convert dtype\n\`\`\`\n\n### Transforming\n\`\`\`python\ndf['age_group'] = df['age'].apply(lambda x: 'adult' if x >= 18 else 'minor')\ndf.groupby('city')['sales'].sum()  # group by\npd.get_dummies(df['category'])     # one-hot encode\n\`\`\``
      },
      {
        title: 'Data Visualization with Matplotlib', duration: '40:00', completed: false, type: 'video', youtubeId: 'OZOOLe2imFo', desc: 'Histograms, scatter plots, correlation heatmaps.',
        notes: `## 📈 Matplotlib & Seaborn\n\n### Basic Plots\n\`\`\`python\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\nplt.plot(x, y)              # line plot\nplt.scatter(x, y)           # scatter\nplt.hist(data, bins=30)     # histogram\nplt.bar(categories, values) # bar chart\n\`\`\`\n\n### Seaborn (prettier defaults)\n\`\`\`python\nsns.heatmap(df.corr(), annot=True, cmap='coolwarm')\nsns.boxplot(x='category', y='value', data=df)\nsns.pairplot(df)  # all pairs\n\`\`\`\n\n### Subplots\n\`\`\`python\nfig, axes = plt.subplots(1, 2, figsize=(12,5))\naxes[0].plot(x1, y1)\naxes[1].scatter(x2, y2)\n\`\`\``
      },
    ]
  },
  {
    section: 'Section 3: Classical Machine Learning', duration: '4h', expanded: false,
    lessons: [
      {
        title: 'Linear & Logistic Regression', duration: '55:00', completed: false, type: 'video', youtubeId: 'nk2CQITm_eo', desc: 'Gradient descent, cost functions, and regularization.',
        notes: `## 📉 Regression Models\n\n### Linear Regression\n- Predict continuous value: y = wx + b\n- Loss: MSE = (1/N) Σ (ŷ − y)²\n- Minimize with Gradient Descent: w -= lr × dL/dw\n\n### Logistic Regression\n- Binary classification (0 or 1)\n- Output: sigmoid(wx + b) → probability\n- Loss: Binary Cross-Entropy\n\n### Gradient Descent\n\`\`\`\nfor epoch in range(epochs):\n    predictions = model(X)\n    loss = compute_loss(predictions, y)\n    gradients = compute_gradients(loss)\n    weights -= learning_rate * gradients\n\`\`\`\n\n### Regularization\n- **L1 (Lasso)**: sparse weights, feature selection\n- **L2 (Ridge)**: smaller weights, prevents overfitting`
      },
      {
        title: 'Decision Trees & Random Forests', duration: '50:00', completed: false, type: 'video', youtubeId: 'jVh5NA9ERDA', desc: 'Entropy, information gain, ensemble methods.',
        notes: `## 🌳 Decision Trees & Ensembles\n\n### Decision Tree\n- Split data by feature that maximizes **Information Gain**\n- IG = Entropy(parent) − weighted avg Entropy(children)\n- Entropy = −Σ p(x) log₂ p(x)\n\n### Overfitting Prevention\n- max_depth: limit tree depth\n- min_samples_split: don't split tiny nodes\n- Pruning: remove branches with low gain\n\n### Random Forest\n- Train N trees on **random subsets** of data\n- Each tree votes → majority wins\n- Reduces variance (overfitting) of single tree\n\n### Gradient Boosting\n- Trees trained **sequentially**\n- Each new tree corrects errors of previous\n- XGBoost, LightGBM are top implementations`
      },
      {
        title: 'Support Vector Machines', duration: '45:00', completed: false, type: 'video', youtubeId: 'efR1C6CvhmE', desc: 'Hyperplanes, kernels, and SVM for classification.',
        notes: `## 🎯 Support Vector Machines\n\n### Core Idea\nFind the **hyperplane** that maximizes the margin between two classes.\n\n### Support Vectors\n- Data points closest to the decision boundary\n- Only these points define the hyperplane\n\n### Kernel Trick\nMap data to higher dimensions without computing it directly:\n- **Linear**: no transformation\n- **Polynomial**: curved boundaries\n- **RBF (Gaussian)**: circular boundaries, most powerful\n\n### When to Use SVM\n- High-dimensional data (text classification)\n- When classes are separable\n- Small to medium datasets (slow on large N)`
      },
      {
        title: 'Model Evaluation & Cross Validation', duration: '40:00', completed: false, type: 'video', youtubeId: 'fSytzGwwBVw', desc: 'Precision, recall, F1, confusion matrix, k-fold CV.',
        notes: `## 📊 Model Evaluation\n\n### Confusion Matrix\n|  | Predicted +ve | Predicted −ve |\n|---|---|---|\n| Actual +ve | TP | FN |\n| Actual −ve | FP | TN |\n\n### Metrics\n- **Accuracy** = (TP+TN) / Total\n- **Precision** = TP / (TP+FP) — of all predicted +ve, how many correct\n- **Recall** = TP / (TP+FN) — of all actual +ve, how many found\n- **F1** = 2 × Precision × Recall / (Precision + Recall)\n\n### Cross Validation (k-fold)\n- Split data into k folds\n- Train on k-1, test on 1, rotate k times\n- Average score → unbiased estimate\n\n### Bias-Variance Tradeoff\n- High bias = underfitting (simple model)\n- High variance = overfitting (complex model)`
      },
      {
        title: 'Quiz: Classical ML', duration: '10:00', completed: false, type: 'quiz', question: 'Which algorithm minimizes sum of squared residuals?', options: ['Logistic Regression', 'Linear Regression', 'SVM', 'KNN'], answerIdx: 1,
        notes: `## ❓ Quiz Notes: ML Algorithms\n\n### Answer: Linear Regression\nMinimizes **MSE** (Mean Squared Error) = (1/N) Σ (ŷ − y)² using gradient descent.\n\n### Algorithm Cheatsheet\n| Algorithm | Type | Loss Function |\n|---|---|---|\n| Linear Regression | Regression | MSE |\n| Logistic Regression | Classification | Binary Cross-Entropy |\n| SVM | Classification | Hinge Loss |\n| Decision Tree | Both | Gini / Entropy |\n| KNN | Both | Distance metric |\n| Neural Network | Both | Varies |`
      },
    ]
  },
  {
    section: 'Section 4: Deep Learning & Neural Networks', duration: '5h', expanded: false,
    lessons: [
      {
        title: 'Neural Networks from Scratch', duration: '1:10:00', completed: false, type: 'video', youtubeId: 'aircAruvnKk', desc: 'Perceptrons, activation functions, backpropagation.',
        notes: `## 🧠 Neural Networks\n\n### Architecture\n- Input Layer → Hidden Layers → Output Layer\n- Each connection has a **weight**\n- Each neuron has a **bias**\n\n### Activation Functions\n| Function | Formula | Use Case |\n|---|---|---|\n| ReLU | max(0, x) | Hidden layers |\n| Sigmoid | 1/(1+e⁻ˣ) | Binary output |\n| Softmax | eˣ/Σeˣ | Multi-class |\n| Tanh | (eˣ−e⁻ˣ)/(eˣ+e⁻ˣ) | RNNs |\n\n### Backpropagation\n1. Forward pass → compute output\n2. Compute loss\n3. Backward pass → compute gradients (chain rule)\n4. Update weights: w -= lr × ∂L/∂w`
      },
      {
        title: 'TensorFlow & Keras Crash Course', duration: '55:00', completed: false, type: 'video', youtubeId: 'tPYj3fFJGjk', desc: 'Build, compile, and train your first deep neural network.',
        notes: `## ⚡ Keras / TensorFlow\n\n### Build a Model\n\`\`\`python\nmodel = tf.keras.Sequential([\n    tf.keras.layers.Dense(128, activation='relu', input_shape=(features,)),\n    tf.keras.layers.Dropout(0.2),\n    tf.keras.layers.Dense(64, activation='relu'),\n    tf.keras.layers.Dense(1, activation='sigmoid')\n])\n\`\`\`\n\n### Compile & Train\n\`\`\`python\nmodel.compile(\n    optimizer='adam',\n    loss='binary_crossentropy',\n    metrics=['accuracy']\n)\nmodel.fit(X_train, y_train, epochs=20, validation_split=0.2)\n\`\`\`\n\n### Callbacks\n- EarlyStopping: stop when val_loss stops improving\n- ModelCheckpoint: save best weights`
      },
      {
        title: 'Convolutional Neural Networks (CNN)', duration: '1:00:00', completed: false, type: 'video', youtubeId: 'QzY57FaENXg', desc: 'Image classification using CNNs, pooling, batch norm.',
        notes: `## 🖼️ CNNs for Image Recognition\n\n### CNN Architecture\n**Input → Conv → ReLU → Pool → ... → Flatten → Dense → Output**\n\n### Convolution Layer\n- Applies **filters** (kernels) to detect features\n- Each filter learns a different pattern (edges, curves)\n- Output size = (N - F + 2P) / S + 1\n\n### Pooling Layer\n- **Max Pool**: take maximum in each region → keeps strongest feature\n- Reduces spatial dimensions, retains important features\n\n### Batch Normalization\n- Normalize activations within each mini-batch\n- Allows higher learning rates, faster convergence\n\n### Famous Architectures\n- LeNet, AlexNet, VGG, ResNet, MobileNet`
      },
      {
        title: 'Transfer Learning', duration: '45:00', completed: false, type: 'video', youtubeId: 'LsdxvjLWkIY', desc: 'Fine-tune pretrained models like ResNet and MobileNet.',
        notes: `## 🔄 Transfer Learning\n\n### Concept\nUse a model trained on large dataset (ImageNet) as a starting point for your smaller task.\n\n### Two Strategies\n**Feature Extraction** — freeze pretrained layers, train only new head:\n\`\`\`python\nbase = tf.keras.applications.MobileNetV2(include_top=False)\nbase.trainable = False\nmodel = Sequential([base, GlobalAvgPool2D(), Dense(10, 'softmax')])\n\`\`\`\n\n**Fine-Tuning** — unfreeze some top layers and train together:\n\`\`\`python\nbase.trainable = True\nfor layer in base.layers[:-20]:  # freeze first 80%\n    layer.trainable = False\n\`\`\`\n\n### Best Pretrained Models\n- **MobileNetV2**: mobile/embedded (small, fast)\n- **ResNet50**: general purpose\n- **EfficientNet**: best accuracy/efficiency ratio`
      },
    ]
  },
  {
    section: 'Section 5: NLP & Final Project', duration: '3h', expanded: false,
    lessons: [
      {
        title: 'NLP with NLTK & Transformers', duration: '1:00:00', completed: false, type: 'video', youtubeId: 'X2vAabgKiWM', desc: 'Tokenization, sentiment analysis, and BERT.',
        notes: `## 💬 Natural Language Processing\n\n### Text Preprocessing Pipeline\n1. Tokenization (split text into words/sentences)\n2. Lowercase conversion\n3. Remove punctuation/stop words\n4. Stemming/Lemmatization\n5. Vectorization (TF-IDF, Word2Vec, BERT)\n\n### TF-IDF\n- TF = word frequency in document\n- IDF = inverse document frequency (penalizes common words)\n- TF-IDF = TF × IDF → importance score\n\n### BERT (Transformers)\n- Pretrained on massive text corpus\n- Fine-tune for classification, NER, QA\n\`\`\`python\nfrom transformers import pipeline\nnlp = pipeline('sentiment-analysis')\nresult = nlp('I love this course!')\n\`\`\``
      },
      {
        title: 'Build a Sentiment Classifier', duration: '1:20:00', completed: false, type: 'video', youtubeId: 'D9bpqUjIa9k', desc: 'End-to-end NLP pipeline with deployment.',
        notes: `## 🚀 End-to-End NLP Project\n\n### Project: Movie Review Sentiment Classifier\n\n### Step 1: Dataset\n\`\`\`python\nimport pandas as pd\ndf = pd.read_csv('imdb_reviews.csv')\n# Columns: review (text), sentiment (positive/negative)\n\`\`\`\n\n### Step 2: Preprocess + Vectorize\n\`\`\`python\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nvec = TfidfVectorizer(max_features=10000, ngram_range=(1,2))\nX = vec.fit_transform(df['review'])\n\`\`\`\n\n### Step 3: Train & Evaluate\n\`\`\`python\nfrom sklearn.linear_model import LogisticRegression\nmodel = LogisticRegression(max_iter=500)\nmodel.fit(X_train, y_train)\nprint(accuracy_score(y_test, model.predict(X_test)))\n\`\`\`\n\n### Step 4: Deploy with Flask API\n\`\`\`python\n@app.route('/predict', methods=['POST'])\ndef predict():\n    text = request.json['text']\n    pred = model.predict(vec.transform([text]))\n    return {'sentiment': pred[0]}\n\`\`\``
      },
    ]
  }
];

const devopsCurriculum = [
  {
    section: 'Section 1: Linux & Shell Scripting', duration: '2h', expanded: true,
    lessons: [
      {
        title: 'Linux Command Line Essentials', duration: '40:00', completed: true, type: 'video', youtubeId: 'ZtqBQ68cfJc', desc: 'Filesystem navigation, permissions, pipes, and grep.',
        notes: `## 🐧 Linux Command Line\n\n### Navigation\n\`\`\`bash\npwd          # print working directory\nls -la       # list with hidden files + permissions\ncd /var/log  # change directory\nmkdir -p a/b # create nested dirs\nrm -rf dir   # delete directory\n\`\`\`\n\n### File Permissions\n\`\`\`bash\n# rwxr-xr-- = owner:rwx group:r-x others:r--\nchmod 755 script.sh   # rwxr-xr-x\nchown user:group file\n\`\`\`\n\n### Power Commands\n\`\`\`bash\ngrep -r "error" /var/log    # recursive search\nfind / -name "*.conf"       # find files\nps aux | grep node          # find processes\ntail -f /var/log/nginx.log  # live log watch\n\`\`\``
      },
      {
        title: 'Shell Scripting Basics', duration: '50:00', completed: true, type: 'video', youtubeId: 'v-F3YLd6oMw', desc: 'Variables, loops, functions, and cron jobs.',
        notes: `## 📜 Shell Scripting\n\n### Script Structure\n\`\`\`bash\n#!/bin/bash          # shebang — use bash\nset -e               # exit on any error\n\nNAME="LearnHub"      # variable (no spaces!)\necho "Hello $NAME"\n\`\`\`\n\n### Conditionals\n\`\`\`bash\nif [ -f "file.txt" ]; then\n  echo "File exists"\nelif [ -d "dir" ]; then\n  echo "Directory exists"\nfi\n\`\`\`\n\n### Loops\n\`\`\`bash\nfor i in 1 2 3; do echo $i; done\nfor file in *.txt; do cat $file; done\n\`\`\`\n\n### Cron Jobs\n\`\`\`bash\n# crontab -e\n# Min Hour Day Month Weekday Command\n0 2 * * * /scripts/backup.sh  # daily at 2am\n\`\`\``
      },
      {
        title: 'SSH & Remote Server Management', duration: '30:00', completed: false, type: 'video', youtubeId: 'hQWRp-FdTpc', desc: 'Secure shell, key-based authentication, SCP transfers.',
        notes: `## 🔐 SSH & Remote Management\n\n### SSH Key Setup\n\`\`\`bash\nssh-keygen -t rsa -b 4096 -C "email@example.com"\nssh-copy-id user@server-ip   # copy public key\nssh user@server-ip            # connect\n\`\`\`\n\n### ~/.ssh/config\n\`\`\`\nHost myserver\n  HostName 192.168.1.100\n  User ubuntu\n  IdentityFile ~/.ssh/id_rsa\n\`\`\`\n\nNow just: \`ssh myserver\`\n\n### SCP (Secure Copy)\n\`\`\`bash\nscp file.txt user@server:/home/user/\nscp -r ./project user@server:/var/www/\n\`\`\`\n\n### Screen / tmux\n- Keep processes running after SSH disconnect\n- screen -S session-name`
      },
    ]
  },
  {
    section: 'Section 2: Docker & Containers', duration: '3h', expanded: false,
    lessons: [
      {
        title: 'What is Docker & Containerization?', duration: '30:00', completed: false, type: 'video', youtubeId: '3c-iM_9K4FA', desc: 'Core concept of containerization and runtime virtualization.',
        notes: `## 🐳 Docker Fundamentals\n\n### VM vs Container\n| | VM | Container |\n|---|---|---|\n| OS | Full OS per VM | Shared host OS kernel |\n| Size | GBs | MBs |\n| Start time | Minutes | Seconds |\n| Isolation | Strong | Good |\n\n### Docker Architecture\n- **Image**: read-only template (like a class)\n- **Container**: running instance of image (like an object)\n- **Registry**: store and share images (Docker Hub)\n\n### Essential Commands\n\`\`\`bash\ndocker pull nginx           # download image\ndocker run -p 8080:80 nginx # run container\ndocker ps                   # list running containers\ndocker stop container-id\ndocker images\n\`\`\``
      },
      {
        title: 'Writing Dockerfiles', duration: '45:00', completed: false, type: 'video', youtubeId: 'RqTEHSBrYjc', desc: 'Build reproducible system images from scratch.',
        notes: `## 📄 Dockerfile\n\n### Node.js App Dockerfile\n\`\`\`dockerfile\nFROM node:18-alpine          # base image\nWORKDIR /app                 # set working dir\nCOPY package*.json ./        # copy package files first\nRUN npm ci --only=production # install deps\nCOPY . .                     # copy source\nEXPOSE 3000                  # document port\nCMD ["node", "server.js"]    # start command\n\`\`\`\n\n### Build & Run\n\`\`\`bash\ndocker build -t myapp:1.0 .\ndocker run -p 3000:3000 --env-file .env myapp:1.0\n\`\`\`\n\n### Best Practices\n- Use alpine base images (smaller)\n- Copy package.json first → better layer caching\n- Use .dockerignore to exclude node_modules\n- Never run as root in production`
      },
      {
        title: 'Docker Compose & Multi-Container Apps', duration: '50:00', completed: false, type: 'video', youtubeId: 'SXwC9fSwct8', desc: 'Orchestrate frontend, backend, and DB together.',
        notes: `## 🎼 Docker Compose\n\nDefine and run **multi-container** applications with a single YAML file.\n\n### docker-compose.yml\n\`\`\`yaml\nversion: '3.8'\nservices:\n  backend:\n    build: ./backend\n    ports: ['3000:3000']\n    environment:\n      - MONGO_URI=mongodb://mongo:27017/db\n    depends_on: [mongo]\n\n  frontend:\n    build: ./frontend\n    ports: ['5173:5173']\n\n  mongo:\n    image: mongo:6\n    volumes:\n      - mongo-data:/data/db\n\nvolumes:\n  mongo-data:\n\`\`\`\n\n### Commands\n\`\`\`bash\ndocker-compose up -d     # start all services\ndocker-compose logs -f   # follow logs\ndocker-compose down      # stop and remove\n\`\`\``
      },
      {
        title: 'Docker Networking & Volumes', duration: '35:00', completed: false, type: 'video', youtubeId: 'OU6xOM0SE58', desc: 'Persistent storage, bridge networks, and container comms.',
        notes: `## 🌐 Docker Networking & Volumes\n\n### Network Types\n- **bridge** (default): containers on same host can communicate\n- **host**: container shares host network stack\n- **overlay**: multi-host networking (Swarm/K8s)\n\n### Container Communication\n- Containers in same Compose network → use service name as hostname\n- backend can reach mongo at: \`mongodb://mongo:27017\`\n\n### Volumes (Persistent Data)\n\`\`\`bash\n# Named volume\ndocker volume create mydata\ndocker run -v mydata:/data mongo\n\n# Bind mount (dev)\ndocker run -v $(pwd):/app node\n\`\`\`\n\n### Why Volumes?\n- Container data is lost when container stops\n- Volumes persist between container restarts`
      },
    ]
  },
  {
    section: 'Section 3: CI/CD Pipelines', duration: '3h', expanded: false,
    lessons: [
      {
        title: 'Git Branching Strategies', duration: '35:00', completed: false, type: 'video', youtubeId: 'e2IbNHi4uCI', desc: 'GitFlow, trunk-based development, and pull request workflows.',
        notes: `## 🌿 Git Branching Strategies\n\n### GitFlow\n- **main**: production-ready code\n- **develop**: integration branch\n- **feature/xxx**: new features\n- **hotfix/xxx**: urgent production fixes\n- **release/xxx**: release preparation\n\n### Trunk-Based Development\n- Single main branch\n- Short-lived feature branches (< 2 days)\n- Feature flags for incomplete features\n- Preferred by Google, Facebook\n\n### Pull Request Workflow\n1. Create feature branch from main\n2. Push changes, open PR\n3. Code review + automated tests\n4. Squash merge to main\n5. Auto-deploy to production`
      },
      {
        title: 'GitHub Actions CI/CD', duration: '55:00', completed: false, type: 'video', youtubeId: 'R8_veQiYBjI', desc: 'Build, test, and deploy pipelines with Actions YAML.',
        notes: `## ⚙️ GitHub Actions\n\n### Basic Workflow\n\`\`\`yaml\nname: CI/CD Pipeline\non:\n  push:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: actions/setup-node@v3\n        with: { node-version: '18' }\n      - run: npm ci\n      - run: npm test\n\n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: docker build -t myapp .\n      - run: docker push myregistry/myapp:latest\n\`\`\`\n\n### Key Concepts\n- **Triggers**: push, pull_request, schedule\n- **Jobs**: parallel units of work\n- **Steps**: sequential commands\n- **Secrets**: encrypted env vars`
      },
      {
        title: 'Jenkins Pipelines', duration: '50:00', completed: false, type: 'video', youtubeId: 'FX322RVNGj4', desc: 'Jenkinsfile DSL, stages, artifacts, and webhooks.',
        notes: `## 🔧 Jenkins Pipeline\n\n### Declarative Jenkinsfile\n\`\`\`groovy\npipeline {\n  agent any\n  stages {\n    stage('Build') {\n      steps {\n        sh 'npm ci'\n        sh 'npm run build'\n      }\n    }\n    stage('Test') {\n      steps { sh 'npm test' }\n      post { always { junit 'test-results/*.xml' } }\n    }\n    stage('Deploy') {\n      when { branch 'main' }\n      steps { sh './deploy.sh' }\n    }\n  }\n}\n\`\`\`\n\n### Key Jenkins Concepts\n- **Master/Agent**: distribute builds across nodes\n- **Artifacts**: store build outputs\n- **Webhooks**: GitHub triggers build on push\n- **Blue Ocean**: modern Jenkins UI`
      },
      {
        title: 'Quiz: CI/CD Concepts', duration: '10:00', completed: false, type: 'quiz', question: 'Which tool natively integrates CI/CD into GitHub repositories?', options: ['Jenkins', 'Travis CI', 'GitHub Actions', 'CircleCI'], answerIdx: 2,
        notes: `## ❓ Quiz Notes: CI/CD Tools\n\n### Answer: GitHub Actions\n**GitHub Actions** is built directly into GitHub — no external service needed.\n\n### Comparison\n| Tool | Hosting | Free Tier | Best For |\n|---|---|---|---|\n| **GitHub Actions** | GitHub | 2000 min/month | GitHub repos |\n| **Jenkins** | Self-hosted | Free | Enterprise, complex pipelines |\n| **Travis CI** | Cloud | Limited | Open source |\n| **CircleCI** | Cloud | 6000 min/month | Fast builds |\n| **GitLab CI** | GitLab | Unlimited | GitLab users |`
      },
    ]
  },
  {
    section: 'Section 4: Kubernetes & Cloud', duration: '4h', expanded: false,
    lessons: [
      {
        title: 'Kubernetes Architecture', duration: '50:00', completed: false, type: 'video', youtubeId: 'X48VuDVv0do', desc: 'Pods, nodes, services, deployments, and namespaces.',
        notes: `## ☸️ Kubernetes Architecture\n\n### Control Plane (Master)\n- **API Server**: all communication goes through here\n- **etcd**: distributed key-value store (cluster state)\n- **Scheduler**: assigns pods to nodes\n- **Controller Manager**: watches and reconciles state\n\n### Worker Nodes\n- **kubelet**: agent on each node, manages pods\n- **kube-proxy**: handles networking and load balancing\n- **Container Runtime**: Docker, containerd\n\n### Key Objects\n\`\`\`yaml\nPod:        smallest deployable unit (1+ containers)\nDeployment: manages pod replicas + rolling updates\nService:    stable endpoint to access pods\nIngress:    HTTP routing / load balancer\nConfigMap:  inject config as env vars or files\nSecret:     sensitive data (base64 encoded)\n\`\`\``
      },
      {
        title: 'kubectl & Helm Charts', duration: '55:00', completed: false, type: 'video', youtubeId: 'PmPVoOccMoE', desc: 'Deploy and manage apps using kubectl and Helm.',
        notes: `## 🛠️ kubectl & Helm\n\n### Essential kubectl Commands\n\`\`\`bash\nkubectl get pods -n production\nkubectl describe pod myapp-xxx\nkubectl logs myapp-xxx -f\nkubectl exec -it myapp-xxx -- /bin/sh\nkubectl apply -f deployment.yaml\nkubectl rollout undo deployment/myapp\n\`\`\`\n\n### Deployment YAML\n\`\`\`yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata: { name: myapp }\nspec:\n  replicas: 3\n  selector: { matchLabels: { app: myapp } }\n  template:\n    metadata: { labels: { app: myapp } }\n    spec:\n      containers:\n      - name: myapp\n        image: myapp:1.0\n        ports: [{ containerPort: 3000 }]\n\`\`\`\n\n### Helm\n- Package manager for K8s\n- helm install, helm upgrade, helm rollback`
      },
      {
        title: 'AWS EC2, S3 & IAM', duration: '1:00:00', completed: false, type: 'video', youtubeId: 'SQHPdBcth4Y', desc: 'Launch instances, manage storage, and configure policies.',
        notes: `## ☁️ AWS Core Services\n\n### EC2 (Elastic Compute Cloud)\n- Virtual machines in the cloud\n- Instance types: t2.micro (free tier), t3.medium, m5.large\n- Key pair for SSH access\n- Security Groups = virtual firewall\n\n### S3 (Simple Storage Service)\n\`\`\`\nBucket → Folders → Objects (files)\nMax object size: 5TB\nAuto-scales, 99.999999999% durability\n\`\`\`\n- Use cases: static website hosting, backups, ML datasets\n\n### IAM (Identity & Access Management)\n- Users, Groups, Roles, Policies\n- **Principle of Least Privilege**: grant minimum needed permissions\n- Policies = JSON documents defining permissions\n- Never use root account for daily tasks`
      },
      {
        title: 'Terraform Infrastructure as Code', duration: '55:00', completed: false, type: 'video', youtubeId: 'SLB_c_ayRMo', desc: 'Provision cloud resources declaratively with HCL.',
        notes: `## 🏗️ Terraform\n\nDefine and provision cloud infrastructure using **declarative HCL** config files.\n\n### Basic AWS EC2 with Terraform\n\`\`\`hcl\nprovider "aws" {\n  region = "us-east-1"\n}\n\nresource "aws_instance" "web" {\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t2.micro"\n  tags = { Name = "LearnHub-Server" }\n}\n\noutput "public_ip" {\n  value = aws_instance.web.public_ip\n}\n\`\`\`\n\n### Terraform Workflow\n\`\`\`bash\nterraform init    # download providers\nterraform plan    # preview changes\nterraform apply   # create/update resources\nterraform destroy # tear down\n\`\`\`\n\n### State File\n- Tracks current infrastructure\n- Store remotely in S3 + DynamoDB for teams`
      },
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
    if (course.category === 'AI/ML') return aimlCurriculum;
    if (course.category === 'DevOps') return devopsCurriculum;
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
    'dsa-thumb': 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=800&auto=format&fit=crop',
    'dsa2-thumb': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop',
    'dsa3-thumb': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop',
    'mern-thumb': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    'next-thumb': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop',
    'react-thumb': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    'sd-thumb': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    'sd2-thumb': 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop',
    'sd3-thumb': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    'apti-thumb': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    'verbal-thumb': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
    'di-thumb': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    'aiml-thumb': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    'dl-thumb': 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=800&auto=format&fit=crop',
    'nlp-thumb': 'https://images.unsplash.com/photo-1686191128892-3b37add4c844?q=80&w=800&auto=format&fit=crop',
    'devops-thumb': 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format&fit=crop',
    'k8s-thumb': 'https://images.unsplash.com/photo-1667372393913-59292cffe9e3?q=80&w=800&auto=format&fit=crop',
    'aws-thumb': 'https://images.unsplash.com/photo-1667372393913-59292cffe9e3?q=80&w=800&auto=format&fit=crop',
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
                  <div className="meta-item"><FiStar style={{ color: '#F97360', fill: '#F97360' }} /><span><strong>{course.rating}</strong> average rating</span></div>
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
                {/* Topic-specific notes from curriculum */}
                {activeLesson.notes ? (
                  <div className="lesson-notes-content">
                    <div className="lesson-notes-header">
                      <FiFileText size={18} />
                      <h3>Notes — {activeLesson.title}</h3>
                    </div>
                    <div className="lesson-notes-markdown">
                      <ReactMarkdown>{activeLesson.notes}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="lesson-notes-empty">
                    <FiFileText size={36} />
                    <h4>No notes available</h4>
                    <p>Notes haven't been added for this lesson yet.</p>
                  </div>
                )}

                {/* Personal notes area */}
                <div className="personal-notes-section">
                  <h4>📝 Your Personal Notes</h4>
                  <p className="text-muted">Jot down key takeaways from this lesson.</p>
                  <textarea
                    className="notes-textarea"
                    placeholder="Start typing your notes here..."
                    rows={6}
                  />
                  <button className="btn btn-primary btn-sm" onClick={() => toast.success('Notes saved!')}>Save Notes</button>
                </div>
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
                <FiStar style={{ color: '#F97360', fill: '#F97360' }} />
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
