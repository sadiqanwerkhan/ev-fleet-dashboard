import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SpeedChartProps {
  data: {
    speedData: Array<{ name: string; speed: number }>;
  };
}

const SpeedChart: React.FC<SpeedChartProps> = memo(({ data }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Vehicle Speeds</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data.speedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="speed" fill="#10B981" />
      </BarChart>
    </ResponsiveContainer>
  </div>
));

SpeedChart.displayName = 'SpeedChart';

export default SpeedChart;
