import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface StatusChartProps {
  data: {
    statusData: Array<{ name: string; value: number; color: string }>;
  };
}

const StatusChart: React.FC<StatusChartProps> = memo(({ data }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vehicle Status Distribution</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data.statusData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.statusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
));

StatusChart.displayName = 'StatusChart';

export default StatusChart;
