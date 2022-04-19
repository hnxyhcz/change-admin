import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

type PopulationDistributeProps = {
  plat: number;
  modelData: {
    name: string;
    step?: number;
    plat: number[];
    freq: number[];
    actualNum: number[];
    actualRate: number[];
  };
}

const PopulationDistribute: React.FC<PopulationDistributeProps> = ({ plat, modelData }) => {
  const chartRef = useRef<echarts.EChartsType>();
  const chartContainer = useRef<HTMLDivElement>(null);
  const step = modelData.step || 1
  // markArea的动画效果
  const [markAxis, setMarkAxis]= useState<number[]>([0, step]);
  const markColor = modelData.name === 'model2' ? plat < 16 ? 'green' : plat > 24 ? 'red' : 'yellow' : '#ffdd15';

  const option = {
    grid: {
      left: '5%',
      right: '5%'
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false
        },
      },
      {
        type: 'value',
        name: '实际发病风险(%)',
        splitLine: {
          show: false
        }
      }
    ],
    xAxis: {
      show: true,
      name: '预测风险值(%)',
      nameLocation: 'center',
      nameTextStyle: {
        lineHeight: 48,
      },
      data: modelData.plat,
    },
    series: [{
      type: 'line',
      yAxisIndex: 0,
      smooth: true,
      showSymbol: false,
      animationDuration: 100,
      data: modelData.freq,
      itemStyle: {
        color: '#d0d2d2',
      },
      areaStyle: {
        color: '#d0d2d2',
      },
      markArea: {
        animation: true,
        animationDurationUpdate: 1500,
        itemStyle: {
          color: markColor,
        },
        data: [
          [
            {
              xAxis: `${markAxis[0]}`,
              name: plat > 0 && `${plat}%`,
            },
            {
              xAxis: `${markAxis[1]}`
            }
          ],
        ],
      },
    }, {
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      showSymbol: false,
      animation: false,
      animationDuration: 100,
      data: modelData.actualRate
    }]
  }

  useEffect(() => {
    if (chartContainer.current) {
      chartRef.current = echarts.init(chartContainer.current);
      chartRef.current?.setOption(option);
      chartRef.current?.on('finished', () => {
        if (step === 0.1) {
          const start = Math.floor(plat * 10) / 10
          const end = Math.floor((plat + step) * 10) / 10
          setMarkAxis([start, end]);
        } else if (step === 1) {
          const start = Math.floor(plat);
          setMarkAxis([start, start + step]);
        }
      });
    }
  }, [markAxis])


  return (
    <div
      ref={chartContainer}
      style={{
        width: '100%',
        height: '700px',
        backgroundColor: '#fff'
      }}
    >
    </div>
  )
};

export default PopulationDistribute;