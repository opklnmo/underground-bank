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

    <el-date-picker
      v-model="dateRange"
      type="datetimerange"
      range-separator="至"
      start-placeholder="起始日期时间"
      end-placeholder="结束日期时间"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      style="width: 350px;margin-top: 15px;margin-right: 15px;margin-left: 15px;"
    />

    <el-input
      v-model="minAmount"
      placeholder="请输入查询的最低额度"
      style="
        width: 200px;
        margin-top: 15px;
        margin-right: 15px;
        margin-left: 15px;
      "
    />

    <el-button type="primary" @click="showGraph">确认</el-button>

    <div v-if="isShow" style="height: calc(100vh)">
      <RelationGraph
        ref="graphRef"
        :options="graphOptions"
        :on-node-click="onNodeClick"
        :on-line-click="onLineClick"
      />
    </div>
  </div>
</template>

<script>
import RelationGraph from 'relation-graph'
import axios from 'axios'
export default {
  name: 'Demo',
  components: { RelationGraph },
  data() {
    return {
      options: [],
      value: '', // 选中的数据表
      minAmount: null,
      dateRange: [],
      username: null,
      nodes: [],
      lines: [],
      isShow: false,
      isShowCodePanel: false,
      graphOptions: {
        debug: true,
        // defaultNodeBorderWidth: 0,
        defaultNodeColor: 'rgba(238, 178, 94, 1)',
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        defaultLineShape: 0, // 不带箭头
        // defaultLineShape: 1,
        layout: {
          layoutName: 'center',
          distance_coefficient: 2
          // layoutName: 'force',
          // force_node_repulsion: 3
        },
        defaultJunctionPoint: 'border',
        defaultLineColor: 'rgb(241, 45, 224)',
        defaultNodeFontColor: 'rgb(243, 153, 48)',
        defaultLineFontColor: 'rgb(243, 153, 48)',
        defaultLineTextFontSize: 40, // Adjust the size as needed
        hideNodeContentByZoom: true // 根据缩放比例隐藏节点内容
      }
    }
  },
  async created() {
    await this.showGraph()
  },
  mounted() {
    this.handleSearch() // 初始化加载表名
  // 如果需默认加载数据，可在此调用 this.showGraph();
  },
  // mounted() {
  //   this.showGraph();
  // },
  methods: {
    // fetchDefaultData(){
    //   alert('default');
    //   axios.get('http://127.0.0.1:8000/all_relation')
    //   .then(response => {
    //     if (response.data.state === 200) {
    //       // 保存 nodes 和 lines 数据
    //       this.nodes = response.data.data.nodes;
    //       this.lines = response.data.data.lines;
    //       console.log('this.nodes', this.nodes);
    //       console.log('this.lines', this.lines);
    //     } else {
    //       console.error('查询失败: ', response.data.state);
    //     }
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });
    // },
    // showDefaultGraph(){
    //   fetchDefaultData();
    //   this.isShow = true;
    //   const __graph_json_data = {
    //     rootId: '0',
    //     nodes: this.nodes,
    //     lines: this.lines
    //   };
    //   //用来显示图形，必须存在
    //   this.$refs.graphRef.setJsonData(__graph_json_data, (graphInstance) => {
    //       graphInstance.render(); // 重新渲染图形
    //   });
    // },
    handleSelectChange(value) {
      console.log('选中的数据表:', value)
      this.showGraph() // 选择变化时重新加载图表
    },
    async fetchData() {
      const payload = {
        tableName: this.value || null,
        username: this.username || null,
        minAmount: Number(this.minAmount) || 0,
        dateRange: this.dateRange || []
      }
      console.log('payload是:', payload)
      try {
        const response = await axios.post('http://127.0.0.1:8000/find_relation', payload)
        if (response.data.state === 200) {
          this.nodes = response.data.data.nodes
          this.lines = response.data.data.lines
          console.log('接收到的数据:', { nodes: this.nodes, lines: this.lines })
        } else {
          console.log('测试失败')
          console.error('服务器返回异常:', response.data)
          throw new Error(`查询失败，服务器返回状态码: ${response.data.state}`)
        }
      } catch (error) {
        console.log('这里的问题')
        console.error('请求失败:', error)
        throw error // 抛出错误，让调用者知道请求失败
      }
    },
    async showGraph() {
      try {
        console.log('日期范围参数:', this.dateRange)
        // 等待 fetchData 完成
        this.isShow = true
        await this.fetchData()
        if (this.nodes.length === 0 || this.lines.length === 0) {
          this.$message.warning('没有数据可显示')
          return
        }
        // 确保数据加载完成后，再执行后续逻辑

        const __graph_json_data = {
          rootId: '0',
          nodes: this.nodes,
          lines: this.lines
        }

        // 直接调用render方法，无需回调
        this.$refs.graphRef.setJsonData(__graph_json_data, (graphInstance) => {
          // 可在此回调中添加布局配置（如果需要）
          graphInstance.setOptions({ layout: 'force' })
        })
      } catch (error) {
        // 捕获并处理错误
        console.error('Failed to fetch data or render graph:', error)
        this.isShow = false // 如果失败，可以将 isShow 设置为 false 或其他逻辑
      }
    },
    onNodeClick(nodeObject, $event) {
      this.$message(`人物: ${nodeObject.text}`)
    },
    onLineClick(lineObject, linkObject, $event) {
      this.$message(`交易额: ${lineObject.text}`)
    },
    handleSearch() {
      // 发送交易数据到后端
      axios
        .get('http://127.0.0.1:8000/all_tables')
        .then((response) => {
          console.log(response.data)
          const data = response.data.all_tables
          this.options = data.map((item) => ({
            label: item, // 使用字符串作为 label
            value: item // 使用相同的字符串作为 value
          }))
        })
        .catch((error) => {
          this.$message.error('上传失败:', error)
        })
    }
  }
}
</script>
