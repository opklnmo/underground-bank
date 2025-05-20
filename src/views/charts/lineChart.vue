<template>
    <div>
      <!-- 查询条件表单 -->
      <el-form :inline="true" :model="queryForm" label-width="100px" class="query-form">
        <!-- 数据表输入 -->
        <el-select
            v-model="value"
            placeholder="数据表"
            no-data-text="已经没有数据表了"
            style="margin-left: 20px;"
            @focus="handleSearch"
            @change="handleSelectChange"
        >
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
/>
        </el-select>
        <!-- 用户名输入 -->
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="queryForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>

        <!-- 日期时间区间选择 -->
        <el-form-item style="margin-left: 20px;">
          <el-date-picker
            v-model="queryForm.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期时间"
            end-placeholder="结束日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 350px;"
          />
        </el-form-item>

        <!-- 查询刻度选择 -->
        <el-form-item label="查询刻度">
          <el-select v-model="queryForm.timeScale" placeholder="请选择刻度" clearable>
            <el-option label="按小时" value="hour" />
            <el-option label="按日" value="day" />
            <el-option label="按月" value="month" />
            <el-option label="按年" value="year" />
          </el-select>
        </el-form-item>

        <!-- 查询按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <!-- <el-button @click="onReset">重置</el-button> -->
        </el-form-item>

        <!-- 二级查询栏 -->
        <el-form-item v-if="showSecondaryQuery" :inline="true" label="银行账户" class="bank-account">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" style="padding-left: 30px;" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedAccounts" style="padding-left: 30px" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="account in accounts" :key="account" :label="account">{{ account }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <!-- 折线图展示 -->
      <div ref="chart" style="width: 100%; height: 600px; margin-top: 0px;" />
    </div>
  </template>
<script>
import axios from 'axios'
import * as echarts from 'echarts'

export default {
  data() {
    return {
      options: [],
      value: '', // 选中的数据表
      dealData: [],
      // 查询表单数据
      checkAll: true,
      checkedAccounts: [],
      accounts: [],
      isIndeterminate: false,
      queryForm: {
        username: '', // 用户名
        dateRange: [], // 日期时间区间
        timeScale: 'hour', // 查询刻度，默认为“按小时”
        secondaryOption: ''
      },
      showSecondaryQuery: false,
      chart: null // 折线图实例
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    // 初始化折线图
    initChart() {
      this.chart = echarts.init(this.$refs.chart)
    },
    // 查询按钮点击事件
    async onSearch() {
      if (!this.queryForm.username) {
        this.$message.error('请输入用户名')
        return
      }
      if (!this.queryForm.dateRange.length) {
        this.$message.error('请选择日期时间区间')
        return
      }
      if (!this.queryForm.timeScale) {
        this.$message.error('请选择查询刻度')
        return
      }
      this.showSecondaryQuery = true // 显示二级查询栏
      // 模拟数据查询和更新图表
      await this.fetchChartData()
    },
    // 重置按钮点击事件
    onReset() {
      this.queryForm.username = ''
      this.queryForm.dateRange = []
      this.queryForm.timeScale = 'hour'
      this.showSecondaryQuery = false // 隐藏二级查询栏
    },
    // 模拟查询数据并更新图表
    async fetchChartData() {
      const [startDate, endDate] = this.queryForm.dateRange
      const timeScale = this.queryForm.timeScale
      const username = this.queryForm.username
      const selectedAccounts = this.checkedAccounts
      const params = {
        'tableName': this.value,
        'username': username,
        'startDate': startDate,
        'endDate': endDate,
        'timeScale': timeScale,
        'selectedAccounts': selectedAccounts
      }
      axios.post('http://127.0.0.1:8000/transaction_history', params)
        .then(response => {
          this.accounts = response.data.accounts
          console.log(this.checkedAccounts)
          if (params.selectedAccounts.length === 0 && this.checkAll === true) {
            this.checkedAccounts = this.accounts
          }
          this.dealData = []
          response.data.deal.forEach(item => {
            const [date, amount1, amount2, amount3] = item
            console.log(item)
            this.dealData.push({
              'date': date,
              'amount1': amount1,
              'amount2': amount2,
              'amount3': amount3
            })

            // 更新图表
          })
          // 进行排序
          this.dealData.sort((a, b) => {
            return Number(a.date) - Number(b.date)
          })
          this.updateChart()
        })
        .catch(error => {
          console.error('error:' + error)
          alert(error)
        })
        .finally(() => {
          // 模拟请求时间
          setTimeout(() => {
            this.listLoading = false
          }, 1500)
        })
    },
    // 格式化日期时间
    formatDateTime(date, format) {
      const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'H+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds() // 秒
      }
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
          )
        }
      }
      return format
    },

    formattedDateTime(input) {
      // 确保输入是一个字符串
      const dateString = input.toString()

      // 提取各个部分
      const year = dateString.substring(0, 4)
      const month = dateString.length >= 6 ? dateString.substring(4, 6) : ''
      const day = dateString.length >= 8 ? dateString.substring(6, 8) : ''
      const hour = dateString.length === 10 ? dateString.substring(8, 10) : ''

      // 根据输入的长度格式化日期
      if (dateString.length === 4) {
        return `${year}`
      } else if (dateString.length === 6) {
        return `${year}-${month}`
      } else if (dateString.length === 8) {
        return `${year}-${month}-${day}`
      } else if (dateString.length === 10) {
        return `${year}-${month}-${day} ${hour}`
      } else {
        throw new Error('Invalid date format')
      }
    },
    // 更新折线图
    updateChart() {
      this.chart.clear()
      let xData = []
      let yData1 = []
      let yData2 = []
      let yData3 = []
      xData = this.dealData.map(item => item.date)
      yData1 = this.dealData.map(item => item.amount1)
      yData2 = this.dealData.map(item => item.amount2)
      yData3 = this.dealData.map(item => item.amount3)
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0]
            return `日期: ${data.axisValue}<br>金额: ￥${data.data}`
          }
        },
        legend: {
          data: ['交易总额', '收入金额', '支出金额'], // 图例名称
          right: '10%', // 位置调整
          top: '5%' // 位置调整
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value',
          name: '交易金额',
          axisLabel: {
            formatter: (value) => `￥${value}`
          }
        },
        series: [
          {
            name: '交易总额',
            type: 'line',
            data: yData1,
            smooth: true,
            itemStyle: {
              color: 'black' // 第一组的颜色
            }
          },
          {
            name: '收入金额',
            type: 'line',
            data: yData2,
            smooth: true,
            itemStyle: {
              color: 'red' // 第二组的颜色
            }
          },
          {
            name: '支出金额',
            type: 'line',
            data: yData3,
            smooth: true,
            itemStyle: {
              color: 'green' // 第三组的颜色
            }
          }
        ]
      }

      this.chart.setOption(option)
    },
    handleCheckAllChange(val) { // 处理复选框
      this.checkedAccounts = val ? this.accounts : []
      this.isIndeterminate = false
      this.fetchChartData() // 同步查询数据
    },
    handleCheckedCitiesChange(value) {
      this.checkedAccounts = value // 将选中的城市保存到 checkedCities
      const checkedCount = value.length
      this.checkAll = checkedCount === this.accounts.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.accounts.length
      // console.log("this.checkedCities:" + this.checkedCities)
      this.fetchChartData() // 同步查询数据
    },
    handleSearch() {
      console.log('1')
      // 发送交易数据到后端
      axios.get('http://127.0.0.1:8000/all_tables')
        .then(response => {
          console.log(response.data)
          const data = response.data.all_tables
          this.options = data.map(item => ({
            label: item, // 使用字符串作为 label
            value: item // 使用相同的字符串作为 value
          }))
        })
        .catch(error => {
          this.$message.error('上传失败:', error)
        })
    }
  }
}
</script>

<style>
.query-form{
    margin-top: 20px;
}

.bank-account {
  margin-left: 15px;
  display: flex;
  align-items: center; /* 垂直居中对齐 */
}
</style>
