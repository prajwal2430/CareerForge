import React, { useState } from 'react';
import { FiCheck, FiX, FiPlay } from 'react-icons/fi';

const TestCasePanel = ({ testCases, onRun, onSubmit, isRunning }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="test-panel">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#FAFAF9] border-b border-[#E7E5E4]">
        <div className="flex gap-4">
          <button className="text-sm font-semibold text-[#1C1917] border-b-2 border-[#0F766E] px-1 py-1">
            Test Cases
          </button>
          <button className="text-sm font-medium text-[#78716C] hover:text-[#1C1917] px-1 py-1 transition-colors">
            Test Result
          </button>
        </div>
        <div className="flex gap-3">
          <button 
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#E7E5E4] text-[#1C1917] hover:bg-[#F0FDFA] hover:text-[#0F766E] transition-colors flex items-center cursor-pointer"
            onClick={onRun}
            disabled={isRunning}
          >
            <FiPlay className="mr-1" /> Run Code
          </button>
          <button 
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#0F766E] hover:bg-[#115E59] text-white transition-colors flex items-center shadow-xs cursor-pointer"
            onClick={onSubmit}
            disabled={isRunning}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Test Case Content */}
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        <div className="flex gap-2 mb-4">
          {testCases.map((tc, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === index
                  ? 'bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] shadow-xs'
                  : 'bg-[#FAFAF9] text-[#78716C] hover:text-[#1C1917] border border-[#E7E5E4]'
              }`}
            >
              Case {index + 1}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-2">Input</h4>
            <div className="bg-[#FAFAF9] p-3 rounded-xl font-mono text-xs text-[#1C1917] border border-[#E7E5E4]">
              {testCases[activeTab].input}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-2">Expected Output</h4>
            <div className="bg-[#FAFAF9] p-3 rounded-xl font-mono text-xs text-[#1C1917] border border-[#E7E5E4]">
              {testCases[activeTab].output}
            </div>
          </div>
          {testCases[activeTab].actualOutput && (
            <div>
              <h4 className="text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-2">Actual Output</h4>
              <div className={`bg-white p-3 rounded-lg font-mono text-sm border ${
                testCases[activeTab].passed ? 'border-[#0F766E] text-[#0F766E] bg-[#F0FDFA]' : 'border-[#EA6250] text-[#EA6250] bg-[#FFF1F0]'
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
