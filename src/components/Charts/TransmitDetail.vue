<template>
  <div>
    <el-card>
      <div ref="chart" style="width: 100%; height: 400px;" />
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'

export default {
  name: 'LineGraphView',
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    console.log(88)
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const name = decodeURIComponent(this.$route.query.name || '')
      try {
        console.log(66)
        const res = await axios.post('http://127.0.0.1:8000/line_graph', {
          user: name,
          time_class: 'month'
        })
        const { timeSpan, tradeAmount } = res.data
        console.log(timeSpan)
        this.initChart(timeSpan, tradeAmount)
      } catch (error) {
        console.error('加载数据失败', error)
      }
    },
    initChart(xData, yData) {
      this.chart = echarts.init(this.$refs.chart)
      const option = {
        title: {
          text: '交易金额变化图'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value',
          name: '交易金额'
        },
        series: [
          {
            data: yData,
            type: 'line',
            smooth: true,
            name: '交易金额',
            areaStyle: {}
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
