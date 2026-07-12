import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CustomChart = ({ type = 'bar', data = [], title = '' }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <p>No statistics data available</p>
      </div>
    );
  }

  // Render glowing Donut chart
  const renderDonutChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="text-center py-10">No complaints logged yet.</div>;

    let accumulatedAngle = 0;
    const radius = 60;
    const strokeWidth = 16;
    const center = 80;
    const circumference = 2 * Math.PI * radius;

    // Palette for donut slices
    const colors = [
      '#6366f1', // Indigo
      '#8b5cf6', // Violet
      '#06b6d4', // Cyan
      '#10b981', // Green
      '#f59e0b', // Amber
      '#f43f5e', // Rose
      '#ec4899', // Pink
      '#14b8a6', // Teal
      '#64748b'  // Slate
    ];

    return (
      <div className="flex flex-col md:flex-row items-center justify-around gap-6 mt-4">
        {/* SVG Circle Graph */}
        <div className="relative w-44 h-44">
          <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
            {data.map((item, index) => {
              const percentage = item.value / total;
              const strokeLength = percentage * circumference;
              const strokeOffset = circumference - strokeLength + accumulatedAngle;
              accumulatedAngle -= strokeLength;
              const color = colors[index % colors.length];
              const isHovered = hoveredIdx === index;

              return (
                <motion.circle
                  key={item.label}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredIdx(index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 8px ${color})` : 'none'
                  }}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeOffset }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.1 }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
              {total}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-2 w-full md:w-1/2">
          {data.map((item, index) => {
            const color = colors[index % colors.length];
            const isHovered = hoveredIdx === index;
            const percentage = ((item.value / total) * 100).toFixed(0);

            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all duration-200 ${
                  isHovered 
                    ? 'bg-primary-500/10 border-primary-500/20 translate-x-1' 
                    : 'bg-transparent border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-md"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 6px ${color}`
                    }}
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    {item.value}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render glowing Bar chart
  const renderBarChart = () => {
    const maxVal = Math.max(...data.map(item => item.value), 1);
    
    return (
      <div className="flex flex-col gap-4 mt-6">
        {data.map((item, index) => {
          const percentage = (item.value / maxVal) * 100;
          const isHovered = hoveredIdx === index;

          return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex flex-col gap-1.5 cursor-pointer"
            >
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                <span className="text-slate-800 dark:text-white font-bold">{item.value}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden border border-slate-200/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: index * 0.05 }}
                  className={`h-full rounded-full transition-all duration-300 ${
                    item.colorClass || 'bg-gradient-to-r from-primary-500 to-cyber-violet'
                  }`}
                  style={{
                    boxShadow: isHovered ? '0 0 10px rgba(99, 102, 241, 0.6)' : 'none'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-wide">
          {title}
        </h3>
      )}
      {type === 'donut' ? renderDonutChart() : renderBarChart()}
    </div>
  );
};

export default CustomChart;
