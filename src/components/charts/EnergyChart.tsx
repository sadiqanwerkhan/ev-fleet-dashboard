import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EnergyChartProps {
  data: {
    energyConsumptionData: Array<{ name: string; consumption: number }>;
  };
}

const EnergyChart: React.FC<EnergyChartProps> = memo(({ data }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Energy Consumption (kWh/100km)</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data.energyConsumptionData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="consumption" fill="#F59E0B" />
      </BarChart>
    </ResponsiveContainer>
  </div>
));

EnergyChart.displayName = 'EnergyChart';

export default EnergyChart;
