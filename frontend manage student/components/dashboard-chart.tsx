"use client"

import { useRef } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function DashboardChart() {
  const chartRef = useRef<ChartJS<"line">>(null)

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const labels = ["01/06", "05/06", "10/06", "15/06", "20/06", "25/06", "30/06"]

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Doanh thu (triệu đồng)",
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: "#d32f2f",
        backgroundColor: "rgba(211, 47, 47, 0.5)",
      },
    ],
  }

  return (
    <div className="h-[300px] w-full">
      <Line ref={chartRef} options={options} data={data} />
    </div>
  )
}

