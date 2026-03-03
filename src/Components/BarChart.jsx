import { useState, useEffect } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import API from '../api'

export default function BarChart() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('orders/revenue/')
        setChartData(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching revenue data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div style={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Chart...</div>
  

  if (chartData.length === 0) return <div>No delivered orders found for the selected period.</div>

  return (
    <div style={{ height: 700 }}>
      <ResponsiveBar
        data={chartData}
        keys={['revenue']}  
        indexBy="month"     
        margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        borderRadius={6}
        axisBottom={{
          tickRotation: -45,
          legend: 'Month',
          legendPosition: 'middle',
          legendOffset: 50,
        }}
        axisLeft={{
          legend: 'Revenue (₹)',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  )
}