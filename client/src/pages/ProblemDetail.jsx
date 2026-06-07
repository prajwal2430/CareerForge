import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { FiChevronLeft, FiSettings, FiMaximize2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import CodeEditor from '../components/practice/CodeEditor';
import TestCasePanel from '../components/practice/TestCasePanel';
import Badge from '../components/ui/Badge';

const ProblemDetail = () => {
  const { id } = useParams();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};');
  const [isRunning, setIsRunning] = useState(false);
  const [testCases, setTestCases] = useState([
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', passed: null, actualOutput: null },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]', passed: null, actualOutput: null },
    { input: 'nums = [3,3], target = 6', output: '[0,1]', passed: null, actualOutput: null }
  ]);

  const markdownContent = `
Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.

### Example 1:

**Input:** \`nums = [2,7,11,15]\`, \`target = 9\`  
**Output:** \`[0,1]\`  
**Explanation:** Because \`nums[0] + nums[1] == 9\`, we return \`[0, 1]\`.

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
  `;

  const handleRunCode = () => {
    setIsRunning(true);
    toast('Running code...', { icon: '⚙️' });
    
    // Mock run logic
    setTimeout(() => {
      setIsRunning(false);
      const newTestCases = [...testCases];
      newTestCases[0] = { ...newTestCases[0], passed: true, actualOutput: '[0,1]' };
      newTestCases[1] = { ...newTestCases[1], passed: true, actualOutput: '[1,2]' };
      newTestCases[2] = { ...newTestCases[2], passed: false, actualOutput: '[1,1]' };
      setTestCases(newTestCases);
      toast.error('Wrong Answer on Test Case 3');
    }, 2000);
  };

  const handleSubmit = () => {
    setIsRunning(true);
    toast('Judging...', { icon: '⚖️' });
    
    setTimeout(() => {
      setIsRunning(false);
      toast.success('Accepted! Faster than 95.4% of submissions.');
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
            1. Two Sum <Badge variant="easy">Easy</Badge>
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
            <Badge variant="easy">Easy</Badge>
            <span className="text-xs bg-surface-2 text-text-muted px-2 py-1 rounded-full">Array</span>
            <span className="text-xs bg-surface-2 text-text-muted px-2 py-1 rounded-full">Hash Table</span>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-6">1. Two Sum</h1>
          
          <div className="markdown-body">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
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
