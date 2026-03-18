import React from 'react';
import TradingChart from './components/TradingChart';

function App() {
  return (
    <div className="h-screen bg-[#0b0e11] text-white flex flex-col">
      <header className="h-14 border-b border-gray-800 flex items-center px-6">
        <h1 className="text-xl font-bold text-green-500 font-sans">🦅 صقر تداول</h1>
      </header>
      <main className="flex-1">
        <TradingChart />
      </main>
    </div>
  );
}

export default App;
