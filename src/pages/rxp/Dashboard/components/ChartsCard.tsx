import type { EChartsOption } from 'echarts'
import type { FC } from 'react'
import { Card } from 'antd'
import { useECharts } from '../hooks/useECharts'

interface propState {
  loading: boolean
  options: EChartsOption
  height: number
}

const ChartsCard: FC<propState> = ({ loading, options, height }) => {
  const { chartRef } = useECharts(options, loading)

  return (
    <Card loading={loading} variant='borderless'>
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: height + 'px'
        }}
      />
    </Card>
  )
}

export default ChartsCard
