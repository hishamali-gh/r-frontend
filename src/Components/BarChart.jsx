import { ResponsiveBar } from '@nivo/bar'

const data = [
  { country: 'AD', sales: 120 },
  { country: 'AE', sales: 200 },
  { country: 'AF', sales: 150 },
  { country: 'AG', sales: 80 },
]

export default function BarChart() {
  return (
    <div style={{ height: 500 }}>
      <ResponsiveBar
        data={data}
        keys={['sales']}
        indexBy="country"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        borderRadius={6}
        axisBottom={{
          tickRotation: 0,
          legend: 'Country',
          legendPosition: 'middle',
          legendOffset: 40,
        }}
        axisLeft={{
          legend: 'Sales',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  )
}
