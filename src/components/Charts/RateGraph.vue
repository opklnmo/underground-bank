
<template>
  <div>
    <el-select
      v-model="value"
      placeholder="数据表"
      no-data-text="已经没有数据表了"
      style="margin-left: 20px"
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
    <el-input
      v-model="username"
      placeholder="请输入查询的用户名"
      style="
        width: 200px;
        margin-top: 15px;
        margin-right: 15px;
        margin-left: 15px;
      "
    />

    <el-button type="primary" @click="applyWeights">应用权重</el-button>
    <el-button type="info" @click="resetWeights">重置权重</el-button>

    <!-- 权重设置区域 -->
    <div class="weight-settings">
      <h3>标签权重设置</h3>
      <div class="row">
        <div class="weight-item">
          <span>快进快出：</span>
          <el-slider v-model="weights.flag2" :min="0" :max="5" :step="0.1" show-input />
        </div>
        <div class="weight-item">
          <span>高频交易：</span>
          <el-slider v-model="weights.flag3" :min="0" :max="5" :step="0.1" show-input />
        </div>
      </div>
      <div class="row">
        <div class="weight-item">
          <span>时间集中：</span>
          <el-slider v-model="weights.flag4" :min="0" :max="5" :step="0.1" show-input />
        </div>
        <div class="weight-item">
          <span>小额测试：</span>
          <el-slider v-model="weights.flag5" :min="0" :max="5" :step="0.1" show-input />
        </div>
      </div>
    </div>

    <el-card style="margin: 20px; min-height: 520px;">
      <div slot="header" class="clearfix">
        <span>嫌疑排行榜</span>
      </div>

      <div class="scroll-container">
        <div ref="scrollContainer" class="custom-scrollbar" @scroll="handleScroll">
          <el-table :data="rankData" style="width: 100%">
            <el-table-column type="index" label="排名" width="80" />
            <el-table-column prop="name" label="姓名 / 公司名称">
              <template #default="scope">
                <el-link
                  type="primary"
                  @click="handleNameClick(scope.row.name)"
                >
                  {{ scope.row.name }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="fused_score" label="嫌疑分值">
              <template #default="scope">
                {{ Number(scope.row.fused_score).toFixed(3) }}
              </template>
            </el-table-column>
            <el-table-column prop="count" label="命中标签数" />
            <el-table-column prop="flag2" label="快进快出">
              <template #default="scope">
                {{ scope.row.flag2 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column prop="flag3" label="高频交易">
              <template #default="scope">
                {{ scope.row.flag3 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column prop="flag4" label="时间集中">
              <template #default="scope">
                {{ scope.row.flag4 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column prop="flag5" label="小额测试">
              <template #default="scope">
                {{ scope.row.flag5 ? '是' : '否' }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div
          v-if="isBottom"
          class="bottom-notice"
          :class="{ 'show-notice': isBottom }"
        >
          已经到达末尾
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Demo',
  data() {
    return {
      options: [],
      value: '',
      dateRange: [],
      username: null,
      weights: {
        flag2: 1,
        flag3: 1,
        flag4: 1,
        flag5: 1
      },
      rankData: [],
      isBottom: false,
      scrollContainer: null
    }
  },
  mounted() {
    this.handleSearch()
    this.generateRankData()
    this.scrollContainer = this.$refs.scrollContainer
  },
  methods: {
    handleSelectChange(value) {
      console.log('选中的数据表:', value)
    },
    handleNameClick(name) {
      this.$router.push({
        path: '/charts/transmit-detail',
        query: {
          name: encodeURIComponent(name),
          timeUnit: 'month'
        }
      })
    },
    handleSearch() {
      axios
        .get('http://127.0.0.1:8000/all_tables')
        .then(response => {
          const data = response.data.all_tables
          this.options = data.map(item => ({
            label: item,
            value: item
          }))
        })
        .catch(error => {
          this.$message.error('上传失败:', error)
        })
    },
    async generateRankData(weights = null) {
      try {
        console.log(11)
        if (weights) {
          console.log('发送权重到后端:', weights)
          try {
            const res = await axios.post('http://127.0.0.1:8000/tianye_demo', { weights })
            console.log('后端响应:', res)
            this.rankData = res.data.data
          } catch (postError) {
            const getRes = await axios.get('http://127.0.0.1:8000/tianye_demo')
            this.rankData = getRes.data.data
          }
        } else {
          console.log('默认')
          try {
            const res = await axios.get('http://127.0.0.1:8000/tianye_demo')
            console.log('获取默认数据成功:', res)
            this.rankData = res.data.data
          } catch (error) {
            console.error('请求失败详细信息:', error)
            if (error.response) {
              console.error('服务器响应:', error.response.status, error.response.data)
            } else if (error.request) {
              console.error('没有收到响应，请求详情:', error.request)
            } else {
              console.error('请求设置错误:', error.message)
            }
            this.$message.error('连接后端失败，请检查网络和服务器状态')
            throw error
          }
        }
        return Promise.resolve()
      } catch (error) {
        console.error('Error fetching rank data:', error)
        this.$message.error('获取数据失败:', error.message)
        return Promise.reject(error)
      }
    },
    applyWeights() {
      const loading = this.$loading({
        lock: true,
        text: '正在应用权重设置...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })

      this.generateRankData(this.weights)
        .then(() => {
          loading.close()
          this.$message.success('已成功应用新的权重设置')
        })
        .catch(() => {
          loading.close()
        })
    },
    resetWeights() {
      this.weights = {
        flag2: 1,
        flag3: 1,
        flag4: 1,
        flag5: 1
      }
      this.$message.info('已重置权重为默认值，点击「应用权重」按钮生效')
    },
    handleScroll({ scrollTop, scrollHeight, clientHeight }) {
      this.isBottom = scrollTop + clientHeight >= scrollHeight - 5
    }
  }
}
</script>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

/* 滚动条滑块 */
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8aeb3;
}

/* Element UI 表格样式覆盖 */
.el-table {
  margin-bottom: 5px;
}

.scroll-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px); /* 根据实际情况调整 */
  min-height: 380px;
}

/* 调整滚动条样式 */
.custom-scrollbar {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 10px; /* 增加与底部提示的间距 */
}

/* 底部提示样式优化 */
.bottom-notice {
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #909399;
  background: #f5f7fa;
  border-top: 1px solid #dfe6ec;
  transition: all 0.3s;
  opacity: 0;
}

.show-notice {
  opacity: 1;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
}

/* 表格列样式微调 */
.el-table-column {
  padding: 12px 0;
}

/* 权重设置区域样式 */
.weight-settings {
  margin: 12px;
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.weight-settings h3 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
}

.row {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.weight-item {
  display: flex;
  align-items: center;
  flex: 1;  /* 关键：平均分配宽度 */
  height: 32px;
}

/* 新增：确保滑块容器占满剩余空间 */
.weight-item .el-slider {
  flex: 1;
  min-width: 120px;  /* 防止内容过窄 */
}

.weight-item span {
  width: 70px;
  text-align: right;
  margin-right: 10px;
  color: #606266;
  font-size: 13px;
}

/* 保持滑块细节样式 */
.weight-item .el-slider__runway {
  height: 4px !important;
}
.weight-item .el-slider__button {
  width: 12px !important;
  height: 12px !important;
}
</style>
