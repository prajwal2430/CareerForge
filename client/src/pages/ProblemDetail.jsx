import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { FiChevronLeft, FiSettings, FiMaximize2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import CodeEditor from '../components/practice/CodeEditor';
import TestCasePanel from '../components/practice/TestCasePanel';
import Badge from '../components/ui/Badge';

const problemsData = {
  '1': {
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    code: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};',
    description: `
Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.

### Example 1:
**Input:** \`nums = [2,7,11,15]\`, \`target = 9\`  
**Output:** \`[0,1]\`  
**Explanation:** Because \`nums[0] + \`nums[1] == 9\`, we return \`[0, 1]\`.

### Example 2:
**Input:** \`nums = [3,2,4]\`, \`target = 6\`  
**Output:** \`[1,2]\`

### Example 3:
**Input:** \`nums = [3,3]\`, \`target = 6\`  
**Output:** \`[0,1]\`

### Constraints:
* \`2 <= nums.length <= 10^4\`
* \`-10^9 <= nums[i] <= 10^9\`
* \`-10^9 <= target <= 10^9\`
* **Only one valid answer exists.**
    `,
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', passed: null, actualOutput: null },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', passed: null, actualOutput: null },
      { input: 'nums = [3,3], target = 6', output: '[0,1]', passed: null, actualOutput: null }
    ]
  },
  '2': {
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    tags: ['Linked List', 'Math'],
    code: '/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nvar addTwoNumbers = function(l1, l2) {\n    \n};',
    description: `
You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

### Example 1:
**Input:** \`l1 = [2,4,3], l2 = [5,6,4]\`  
**Output:** \`[7,0,8]\`  
**Explanation:** 342 + 465 = 807.

### Example 2:
**Input:** \`l1 = [0], l2 = [0]\`  
**Output:** \`[0]\`
    `,
    testCases: [
      { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', passed: null, actualOutput: null },
      { input: 'l1 = [0], l2 = [0]', output: '[0]', passed: null, actualOutput: null }
    ]
  },
  '3': {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    code: '/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};',
    description: `
Given a string \`s\`, find the length of the longest substring without repeating characters.

### Example 1:
**Input:** \`s = "abcabcbb"\`  
**Output:** \`3\`  
**Explanation:** The answer is "abc", with the length of 3.

### Example 2:
**Input:** \`s = "bbbbb"\`  
**Output:** \`1\`  
**Explanation:** The answer is "b", with the length of 1.
    `,
    testCases: [
      { input: 's = "abcabcbb"', output: '3', passed: null, actualOutput: null },
      { input: 's = "bbbbb"', output: '1', passed: null, actualOutput: null }
    ]
  },
  '9': {
    title: 'Palindrome Number',
    difficulty: 'Easy',
    tags: ['Math'],
    code: '/**\n * @param {number} x\n * @return {boolean}\n */\nvar isPalindrome = function(x) {\n    \n};',
    description: `
Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.

An integer is a **palindrome** when it reads the same backward as forward. For example, 121 is palindrome while 123 is not.

### Example 1:
**Input:** \`x = 121\`  
**Output:** \`true\`  
**Explanation:** 121 reads as 121 from left to right and from right to left.

### Example 2:
**Input:** \`x = -121\`  
**Output:** \`false\`  
**Explanation:** From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.

### Example 3:
**Input:** \`x = 10\`  
**Output:** \`false\`  
**Explanation:** Reads 01 from right to left. Therefore it is not a palindrome.

### Constraints:
* \`-2^31 <= x <= 2^31 - 1\`
    `,
    testCases: [
      { input: 'x = 121', output: 'true', passed: null, actualOutput: null },
      { input: 'x = -121', output: 'false', passed: null, actualOutput: null },
      { input: 'x = 10', output: 'false', passed: null, actualOutput: null }
    ]
  }
};

const ProblemDetail = () => {
  const { id } = useParams();
  const problem = problemsData[id] || problemsData['1'];
  
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(problem.code);
  const [isRunning, setIsRunning] = useState(false);
  const [testCases, setTestCases] = useState(problem.testCases);

  // Sync state if URL parameter changes
  useEffect(() => {
    const updatedProblem = problemsData[id] || problemsData['1'];
    setCode(updatedProblem.code);
    setTestCases(updatedProblem.testCases);
  }, [id]);

  const handleRunCode = () => {
    setIsRunning(true);
    toast('Running code...', { icon: '⚙️' });
    
    // Mock run logic
    setTimeout(() => {
      setIsRunning(false);
      const newTestCases = [...testCases];
      newTestCases[0] = { ...newTestCases[0], passed: true, actualOutput: newTestCases[0].output };
      newTestCases[1] = { ...newTestCases[1], passed: true, actualOutput: newTestCases[1].output };
      newTestCases[2] = { ...newTestCases[2], passed: true, actualOutput: newTestCases[2].output };
      setTestCases(newTestCases);
      toast.success('All Test Cases Passed!');
    }, 2000);
  };

  const handleSubmit = () => {
    setIsRunning(true);
    toast('Judging...', { icon: '⚖️' });
    
    setTimeout(() => {
      setIsRunning(false);
      toast.success('Accepted! Faster than 97.2% of submissions.');
    }, 2500);
  };

  return (
    <div className="public-page min-h-screen bg-bg-primary">
      {/* Top Navbar specifically for practice */}
      <nav className="h-14 bg-surface-2 border-b border-glass-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/practice" className="text-text-secondary hover:text-white flex items-center gap-1 transition-colors">
            <FiChevronLeft /> Problem List
          </Link>
          <div className="h-6 w-px bg-glass-border"></div>
          <span className="font-bold text-text-primary flex items-center gap-2">
            {id}. {problem.title} <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-text-secondary hover:text-white p-2 rounded-md hover:bg-surface-3 transition-colors">
            <FiSettings />
          </button>
          <button className="text-text-secondary hover:text-white p-2 rounded-md hover:bg-surface-3 transition-colors">
            <FiMaximize2 />
          </button>
        </div>
      </nav>

      {/* Split Pane Layout */}
      <div className="split-pane">
        {/* Left Pane: Problem Description */}
        <div className="split-pane-left">
          <div className="mb-6 flex gap-2">
            <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
            {problem.tags.map((tag, tIdx) => (
              <span key={tIdx} className="text-xs bg-surface-2 text-text-muted px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-6">{id}. {problem.title}</h1>
          
          <div className="markdown-body">
            <ReactMarkdown>{problem.description}</ReactMarkdown>
          </div>

          <div className="mt-8 pt-8 border-t border-glass-border">
            <div className="flex items-center justify-between text-sm text-text-muted mb-4">
              <span>Accepted: 14.5M</span>
              <span>Submissions: 28.3M</span>
              <span>Acceptance Rate: 51.2%</span>
            </div>
            <div className="flex gap-2">
              <span className="text-xs text-text-muted">Companies:</span>
              <span className="text-xs font-semibold text-color-warning">Amazon</span>
              <span className="text-xs font-semibold text-accent-secondary">Google</span>
              <span className="text-xs font-semibold text-text-primary">Apple</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor and Test Cases */}
        <div className="split-pane-right">
          <div className="h-10 bg-surface-2 flex items-center justify-between px-4 border-b border-glass-border">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-bg-input border border-glass-border text-sm rounded-md px-2 py-1 text-text-secondary outline-none focus:border-accent-primary"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python 3</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <button className="text-text-secondary hover:text-white text-sm flex items-center gap-1 transition-colors">
              Auto <FiSettings />
            </button>
          </div>
          
          <CodeEditor 
            language={language}
            code={code}
            onChange={(value) => setCode(value)}
          />

          <TestCasePanel 
            testCases={testCases}
            onRun={handleRunCode}
            onSubmit={handleSubmit}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
