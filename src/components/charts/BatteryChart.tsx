import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BatteryChartProps {
  data: {
    batteryData: Array<{ name: string; battery: number; status: string }>;
  };
}

const BatteryChart: React.FC<BatteryChartProps> = memo(({ data }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Battery Levels by Vehicle</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data.batteryData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="battery" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  </div>
));

BatteryChart.displayName = 'BatteryChart';

export default BatteryChart;
