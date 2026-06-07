import React, { useState } from 'react';
import { FiCheck, FiX, FiPlay } from 'react-icons/fi';

const TestCasePanel = ({ testCases, onRun, onSubmit, isRunning }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="test-panel">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface-2 border-b border-glass-border">
        <div className="flex gap-4">
          <button className="text-sm font-semibold text-text-primary border-b-2 border-accent-primary px-1 py-1">
            Test Cases
          </button>
          <button className="text-sm font-medium text-text-muted hover:text-text-primary px-1 py-1 transition-colors">
            Test Result
          </button>
        </div>
        <div className="flex gap-3">
          <button 
            className="btn btn-ghost btn-sm text-text-secondary"
            onClick={onRun}
            disabled={isRunning}
          >
            <FiPlay className="mr-1" /> Run Code
          </button>
          <button 
            className="btn btn-primary btn-sm bg-color-success hover:bg-color-success text-white border-none"
            onClick={onSubmit}
            disabled={isRunning}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Test Case Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex gap-2 mb-4">
          {testCases.map((tc, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === index
                  ? 'bg-surface-3 text-text-primary'
                  : 'bg-surface-2 text-text-muted hover:text-text-primary hover:bg-surface-3'
              }`}
            >
              Case {index + 1}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Input</h4>
            <div className="bg-bg-input p-3 rounded-lg font-mono text-sm text-text-primary border border-glass-border">
              {testCases[activeTab].input}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Expected Output</h4>
            <div className="bg-bg-input p-3 rounded-lg font-mono text-sm text-text-primary border border-glass-border">
              {testCases[activeTab].output}
            </div>
          </div>
          {testCases[activeTab].actualOutput && (
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Actual Output</h4>
              <div className={`bg-bg-input p-3 rounded-lg font-mono text-sm border ${
                testCases[activeTab].passed ? 'border-color-success text-color-success' : 'border-color-danger text-color-danger'
              }`}>
                {testCases[activeTab].actualOutput}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCasePanel;
