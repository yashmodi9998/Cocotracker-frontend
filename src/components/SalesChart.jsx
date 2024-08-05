import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = ({ data }) => {
  return (
    <div className="my-4">
      {data ? (
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              animation: {
                duration: 500, // Duration of the animation in milliseconds
                easing: 'easeInOutQuad', // Easing function to use for the animation
              },
              title: {
                display: true,
                text: 'Sales Data',
              },
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default SalesChart;
