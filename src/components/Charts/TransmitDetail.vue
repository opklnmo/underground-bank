<template>
  <div class="transmit-detail-container">
    <!-- 标题和选择器 -->
    <div class="header">
      <h2>{{ decodedName }} 交易趋势分析</h2>
      <el-select
        v-model="timeUnit"
        style="width: 120px"
        @change="updateChart"
      >
        <el-option label="按月统计" value="month" />
        <el-option label="按年统计" value="year" />
      </el-select>
    </div>
    <div
      ref="chart"
      style="width: 100%; height: 600px; margin-top: 20px"
      />
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'TransmitDetail',
  data() {
    return {
      timeUnit: 'month',
      chartInstance: null,
      chartData: {}
    }
  },
  computed: {
    decodedName() {
      return decodeURIComponent(this.$route.query.name || '')
    }
  },
  created() {
    this.generateMockData()
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
  },
  methods: {
    generateMockData() {
      const mockData = {
        month: {
          xAxis: ['1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'],
          series: Array.from({ length: 12 }, () =>
            Math.floor(Math.random() * 1000000) + 500000)
        },
        year: {
          xAxis: ['2020', '2021', '2022', '2023'],
          series: [1250000, 2430000, 1780000, 2960000]
        }
      }
      this.chartData = mockData
    },
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart)
      this.updateChart()
    },
    updateChart() {
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0]
            return `${data.name}<br/>交易金额：${this.formatAmount(data.value)}`
          }
        },
        xAxis: {
          type: 'category',
          data: this.chartData[this.timeUnit].xAxis,
          axisLabel: { rotate: 45 }
        },
        yAxis: {
          type: 'value',
          axisLabel: { formatter: (value) => this.formatAmount(value) }
        },
        series: [{
          data: this.chartData[this.timeUnit].series,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(64, 158, 255, 0.8)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
            ])
          },
          itemStyle: { color: '#409EFF' }
        }],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        }
      }
      this.chartInstance.setOption(option)
    },
    formatAmount(value) {
      return `¥${(value / 10000).toLocaleString()}万`
    },
    handleResize() {
      this.chartInstance?.resize()
    }
  }
}
</script>

<style scoped>
.transmit-detail-container {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 20px;
}

h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
}

</style>
