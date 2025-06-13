'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const LoanForm = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [loanTenure, setLoanTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(12);

  const [formattedAmount, setFormattedAmount] = useState('');

  useEffect(() => {
    setFormattedAmount(loanAmount.toLocaleString('en-IN'));
  }, [loanAmount]);

  const queryString = `/loandetails?amount=${loanAmount}&years=${loanTenure}&rate=${interestRate}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg max-w-lg">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-wide">
          Loan Calculator
        </h2>

        {/* Loan Amount */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-600 mb-2 select-none">
            Total Loan Amount (₹{formattedAmount})
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="10000"
              max="40000000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="flex-grow border border-gray-300 rounded-lg px-3 py-3 text-lg font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="range"
              min="10000"
              max="40000000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-1/3 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Loan Tenure */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-600 mb-2 select-none">
            Loan Tenure: {loanTenure} year(s)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max="15"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="flex-grow border border-gray-300 rounded-lg px-3 py-3 text-lg font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="range"
              min="1"
              max="15"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="w-1/3 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Interest Rate */}
        <div className="mb-10">
          <label className="block text-sm font-semibold text-gray-600 mb-2 select-none">
            Interest Rate: {interestRate}%
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="10"
              max="21"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="flex-grow border border-gray-300 rounded-lg px-3 py-3 text-lg font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="range"
              min="10"
              max="21"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-1/3 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="text-center">
          <Link
            href={queryString}
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl"
          >
            Get My Loan Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoanForm;
