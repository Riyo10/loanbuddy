'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Doughnut, Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler
);

const LoanDetails = () => {
  const searchParams = useSearchParams();

  const loanAmount = Number(searchParams.get('amount')) || 0;
  const loanYears = Number(searchParams.get('years')) || 0;
  const annualRate = Number(searchParams.get('rate')) || 0;

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [amortization, setAmortization] = useState([]);

  useEffect(() => {
    if (loanAmount && loanYears && annualRate) {
      const principal = loanAmount;
      const r = annualRate / 12 / 100;
      const n = loanYears * 12;

      const emiValue = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emiValue * n;
      const interest = total - principal;

      setEmi(Math.round(emiValue));
      setTotalPayment(Math.round(total));
      setTotalInterest(Math.round(interest));

      let balance = principal;
      const schedule = [];

      for (let month = 1; month <= n; month++) {
        const interestPayment = balance * r;
        const principalPayment = emiValue - interestPayment;
        balance = balance - principalPayment;

        schedule.push({
          month,
          emi: emiValue,
          principalPayment,
          interestPayment,
          remainingBalance: balance > 0 ? balance : 0,
        });
      }

      setAmortization(schedule);
    }
  }, [loanAmount, loanYears, annualRate]);

  // --- Chart Data ---

  const chartData = {
    labels: ['Principal Amount', 'Total Interest'],
    datasets: [
      {
        data: [loanAmount, totalInterest],
        backgroundColor: ['#3b82f6', '#f59e0b'],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: amortization.map(item => `Month ${item.month}`),
    datasets: [
      {
        label: 'Monthly EMI (₹)',
        data: amortization.map(item => item.emi.toFixed(2)),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        fill: false,
        tension: 0.2,
        yAxisID: 'y',
      },
      {
        label: 'Remaining Balance (₹)',
        data: amortization.map(item => item.remainingBalance.toFixed(2)),
        borderColor: '#f59e0b',
        backgroundColor: '#f59e0b',
        fill: true,
        tension: 0.2,
        yAxisID: 'y1',
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'EMI Amount (₹)' },
        ticks: {
          callback: value => '₹' + value.toLocaleString('en-IN'),
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Remaining Balance (₹)' },
        ticks: {
          callback: value => '₹' + value.toLocaleString('en-IN'),
        },
      },
      x: {
        ticks: {
          maxTicksLimit: 10,
        },
      },
    },
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: context =>
            `${context.dataset.label}: ₹${Number(context.parsed.y).toLocaleString('en-IN', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}`,
        },
      },
    },
  };

  const stackedBarData = {
    labels: amortization.map(item => `Month ${item.month}`),
    datasets: [
      {
        label: 'Principal Paid',
        data: amortization.map(item => item.principalPayment.toFixed(2)),
        backgroundColor: '#3b82f6',
        stack: 'combined',
      },
      {
        label: 'Interest Paid',
        data: amortization.map(item => item.interestPayment.toFixed(2)),
        backgroundColor: '#f59e0b',
        stack: 'combined',
      },
    ],
  };

  const cumulativeData = (() => {
    let principal = 0;
    let interest = 0;
    const labels = [];
    const principalData = [];
    const interestData = [];

    amortization.forEach(item => {
      principal += item.principalPayment;
      interest += item.interestPayment;
      labels.push(`Month ${item.month}`);
      principalData.push(principal.toFixed(2));
      interestData.push(interest.toFixed(2));
    });

    return {
      labels,
      datasets: [
        {
          label: 'Cumulative Principal Paid',
          data: principalData,
          borderColor: '#2563eb',
          fill: false,
        },
        {
          label: 'Cumulative Interest Paid',
          data: interestData,
          borderColor: '#eab308',
          fill: false,
        },
      ],
    };
  })();

  const piePaidRemainingData = (() => {
    const paid = amortization.reduce((sum, item) => sum + item.emi, 0);
    const remaining = totalPayment - paid;
    return {
      labels: ['Paid So Far', 'Remaining'],
      datasets: [
        {
          data: [paid, remaining],
          backgroundColor: ['#10b981', '#ef4444'],
        },
      ],
    };
  })();

  return (
    <div className="min-h-screen bg-white py-10 px-6 max-w-6xl mx-auto flex flex-col">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Loan Breakdown</h1>

      <div className="bg-gray-100 rounded-lg p-6 shadow-md mb-8">
        <p className="text-lg font-medium mb-2">Loan Amount: ₹{loanAmount.toLocaleString('en-IN')}</p>
        <p className="text-lg font-medium mb-2">Loan Tenure: {loanYears} years</p>
        <p className="text-lg font-medium mb-2">Interest Rate: {annualRate}%</p>
        <hr className="my-4" />
        <p className="text-xl text-blue-600 font-semibold mb-1">
          Monthly EMI: ₹{emi.toLocaleString('en-IN')}
        </p>
        <p className="text-md text-gray-700">Total Interest Payable: ₹{totalInterest.toLocaleString('en-IN')}</p>
        <p className="text-md text-gray-700">Total Amount to be Paid: ₹{totalPayment.toLocaleString('en-IN')}</p>
      </div>

      {/* Main Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">EMI Distribution</h2>
          <Doughnut data={chartData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Monthly EMI & Remaining Balance</h2>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Principal vs Interest (Monthly)</h2>
          <Bar data={stackedBarData} options={{ responsive: true, scales: { x: { stacked: true }, y: { stacked: true } } }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Cumulative Principal & Interest</h2>
          <Line data={cumulativeData} />
        </div>

        {/* <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-center">Paid vs Remaining</h2>
          <Pie data={piePaidRemainingData} />
        </div> */}
      </div>

      {/* Amortization Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-12 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Amortization Schedule</h2>
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-4 py-2">Month</th>
              <th className="px-4 py-2">EMI</th>
              <th className="px-4 py-2">Principal</th>
              <th className="px-4 py-2">Interest</th>
              <th className="px-4 py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {amortization.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2">{item.month}</td>
                <td className="px-4 py-2">₹{item.emi.toFixed(0)}</td>
                <td className="px-4 py-2">₹{item.principalPayment.toFixed(0)}</td>
                <td className="px-4 py-2">₹{item.interestPayment.toFixed(0)}</td>
                <td className="px-4 py-2">₹{item.remainingBalance.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="text-center text-gray-500 text-sm pb-4">
        Created with ❤️ by{' '}
        <a
          href="https://supriyo-ten.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Supriyo
        </a>
      </footer>
    </div>
  );
};

export default LoanDetails;
