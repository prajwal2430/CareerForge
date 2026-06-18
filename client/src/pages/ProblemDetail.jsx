import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { FiChevronLeft, FiSettings, FiMaximize2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { PROBLEMS } from '../data/problemsData';
import CodeEditor from '../components/practice/CodeEditor';
import TestCasePanel from '../components/practice/TestCasePanel';
import Badge from '../components/ui/Badge';

<<<<<<< Updated upstream
const problemsData = {
  '1': {
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    code: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};',
    description: `
Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.
=======
const ProblemDetail = () => {
  const { id } = useParams();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testCases, setTestCases] = useState([]);

  // Find the problem
  const problem = PROBLEMS.find(p => p.id.toString() === id);
>>>>>>> Stashed changes

  // Sync starter code and test cases when problem or language changes
  useEffect(() => {
    if (problem) {
      const starter = problem.starterCode[language] || '';
      setCode(starter);

      const tcs = problem.testCases.map(tc => ({
        ...tc,
        passed: null,
        actualOutput: null
      }));
      setTestCases(tcs);
    }
  }, [id, language, problem]);

<<<<<<< Updated upstream
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
=======
  if (!problem) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg-primary)'
        }}
      >
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Problem Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
          The coding problem you are looking for does not exist or has been removed.
        </p>
        <Link to="/practice" className="btn btn-primary" style={{ borderRadius: '20px' }}>
          Back to Practice List
        </Link>
      </div>
    );
  }
>>>>>>> Stashed changes

  const handleRunCode = () => {
    setIsRunning(true);
    toast('Running code...', { icon: '⚙️' });
    
    // Mock run logic
    setTimeout(() => {
      setIsRunning(false);
<<<<<<< Updated upstream
      const newTestCases = [...testCases];
      newTestCases[0] = { ...newTestCases[0], passed: true, actualOutput: newTestCases[0].output };
      newTestCases[1] = { ...newTestCases[1], passed: true, actualOutput: newTestCases[1].output };
      newTestCases[2] = { ...newTestCases[2], passed: true, actualOutput: newTestCases[2].output };
      setTestCases(newTestCases);
      toast.success('All Test Cases Passed!');
    }, 2000);
=======
      const newTestCases = testCases.map((tc) => {
        const isPassed = Math.random() > 0.15; // 85% pass rate for mock run
        return {
          ...tc,
          passed: isPassed,
          actualOutput: isPassed ? tc.output : `Err: Expected ${tc.output}`
        };
      });
      setTestCases(newTestCases);
      const passedCount = newTestCases.filter(c => c.passed).length;
      if (passedCount === newTestCases.length) {
        toast.success(`Passed all ${newTestCases.length} test cases!`);
      } else {
        toast.error(`Failed ${newTestCases.length - passedCount} test cases.`);
      }
    }, 1500);
>>>>>>> Stashed changes
  };

  const handleSubmit = () => {
    setIsRunning(true);
    toast('Judging...', { icon: '⚖️' });
    
    setTimeout(() => {
      setIsRunning(false);
<<<<<<< Updated upstream
      toast.success('Accepted! Faster than 97.2% of submissions.');
    }, 2500);
=======
      problem.status = 'solved';
      toast.success('Accepted! Faster than 92.4% of submissions.');
    }, 2000);
>>>>>>> Stashed changes
  };

  return (
    <div className="public-page min-h-screen bg-bg-primary">
      {/* Top Navbar specifically for practice */}
      <nav className="h-14 bg-surface-2 border-b border-glass-border flex items-center justify-between px-4" style={{ background: 'var(--bg-secondary)', height: '3.5rem' }}>
        <div className="flex items-center gap-4">
          <Link to="/practice" className="text-text-secondary hover:text-white flex items-center gap-1 transition-colors" style={{ color: 'var(--text-secondary)' }}>
            <FiChevronLeft /> Problem List
          </Link>
<<<<<<< Updated upstream
          <div className="h-6 w-px bg-glass-border"></div>
          <span className="font-bold text-text-primary flex items-center gap-2">
            {id}. {problem.title} <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
=======
          <div className="h-6 w-px bg-glass-border" style={{ width: '1px', height: '1.5rem', background: 'var(--glass-border)' }}></div>
          <span className="font-bold text-text-primary flex items-center gap-2" style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {problem.id}. {problem.title} <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
>>>>>>> Stashed changes
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-text-secondary hover:text-white p-2 rounded-md hover:bg-surface-3 transition-colors" style={{ background: 'none', color: 'var(--text-secondary)' }}>
            <FiSettings />
          </button>
          <button className="text-text-secondary hover:text-white p-2 rounded-md hover:bg-surface-3 transition-colors" style={{ background: 'none', color: 'var(--text-secondary)' }}>
            <FiMaximize2 />
          </button>
        </div>
      </nav>

      {/* Split Pane Layout */}
      <div className="split-pane">
        {/* Left Pane: Problem Description */}
        <div className="split-pane-left">
<<<<<<< Updated upstream
          <div className="mb-6 flex gap-2">
            <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
            {problem.tags.map((tag, tIdx) => (
              <span key={tIdx} className="text-xs bg-surface-2 text-text-muted px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-6">{id}. {problem.title}</h1>
          
          <div className="markdown-body">
            <ReactMarkdown>{problem.description}</ReactMarkdown>
=======
          <div className="mb-6 flex gap-2" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
            {problem.tags.map(tag => (
              <span key={tag} className="text-xs bg-surface-2 text-text-muted px-2 py-1 rounded-full" style={{ fontSize: '0.75rem', background: 'var(--bg-input)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '12px' }}>
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-6" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>
            {problem.id}. {problem.title}
          </h1>
          
          <div className="markdown-body">
            <ReactMarkdown>{problem.description}</ReactMarkdown>

            {problem.examples && problem.examples.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>Examples</h3>
                {problem.examples.map((example, idx) => (
                  <div key={idx} style={{ marginBottom: '1rem', background: 'var(--bg-input)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Example {idx + 1}:</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                      <strong>Input:</strong> {example.input}<br />
                      <strong>Output:</strong> {example.output}
                      {example.explanation && (
                        <>
                          <br /><strong>Explanation:</strong> {example.explanation}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {problem.constraints && problem.constraints.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Constraints</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                  {problem.constraints.map((constraint, idx) => (
                    <li key={idx} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}
>>>>>>> Stashed changes
          </div>

          <div className="mt-8 pt-8 border-t border-glass-border" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
            <div className="flex items-center justify-between text-sm text-text-muted mb-4" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              <span>Course: <strong>{problem.courseTitle}</strong></span>
              <span>Acceptance Rate: {problem.acceptance}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="text-xs text-text-muted" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tags:</span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {problem.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.75rem', background: 'var(--bg-input)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '12px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor and Test Cases */}
        <div className="split-pane-right">
          <div className="h-10 bg-surface-2 flex items-center justify-between px-4 border-b border-glass-border" style={{ background: 'var(--bg-secondary)', height: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem', borderBottom: '1px solid var(--glass-border)' }}>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-bg-input border border-glass-border text-sm rounded-md px-2 py-1 text-text-secondary outline-none focus:border-accent-primary"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--glass-border)',
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                padding: '2px 8px',
                outline: 'none'
              }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python 3</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <button className="text-text-secondary hover:text-white text-sm flex items-center gap-1 transition-colors" style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
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
