<template>
  <div>
    <el-input v-model="input" placeholder="请输入查询的用户名" style="width: 200px; margin-top: 15px; margin-right: 15px; margin-left: 15px;" />
    <el-button type="primary" @click="showGraph">确认</el-button>
    <div v-if="isShow" style="height:calc(100vh);">
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
export default {
  name: 'Demo',
  components: { RelationGraph },
  data() {
    return {
      input: '',
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
        layout:
          {
            layoutName: 'center'
          },
        defaultJunctionPoint: 'border',

        // 这里可以参考"Graph 图谱"中的参数进行设置
        // Add these properties to change line color and text
        defaultLineColor: 'black',
        defaultLineTextColor: 'black',
        defaultLineTextFontSize: 40 // Adjust the size as needed
      }
    }
  },
  mounted() {
    this.showGraph()
  },
  methods: {
    showGraph() {
      this.isShow = true
      const __graph_json_data = {
        rootId: '2',
        nodes: [
          // { id: '1', text: '金英爱', color: 'rgba(70, 130, 180, 1)' },
          { id: '41', text: '金吉子', color: 'rgba(178, 34, 34, 1)' },
          { id: '42', text: '吴秋生', color: 'rgba(0, 0, 255, 1)', width: 100, height: 100 },
          { id: '43', text: '林家维', color: 'rgba(0, 0, 255, 1)', width: 100, height: 100 },
          { id: '44', text: '李根', color: 'rgba(0, 0, 255, 1)', width: 100, height: 100 },
          { id: '45', text: '李香浩', color: 'rgba(0, 0, 255, 1)', width: 100, height: 100 },
          { id: '46', text: '刘洋', color: 'rgba(0, 0, 255, 1)' },
          { id: '47', text: '张哲', color: 'rgba(0, 0, 255, 1)' },
          { id: '48', text: '权英大', color: 'rgba(0, 0, 255, 1)' },
          { id: '49', text: '刘明吉', color: 'rgba(0, 0, 255, 1)' },
          { id: '50', text: '韩永东', color: 'rgba(0, 0, 255, 1)', width: 50, height: 50 }

          // 深红色: rgba(139, 0, 0, 1) // Dark Red
          // 深绿色: rgba(0, 100, 0, 1) // Dark Green
          // 深蓝色: rgba(0, 0, 139, 1) // Dark Blue
          // 橄榄色: rgba(128, 128, 0, 1) // Olive
          // 棕色: rgba(165, 42, 42, 1) // Brown
          // 灰色: rgba(128, 128, 128, 1) // Gray
          // 金色: rgba(255, 215, 0, 1) // Gold
          // 淡紫色: rgba(216, 191, 216, 1) // Thistle
          // 海洋蓝: rgba(70, 130, 180, 1) // Steel Blue
          // 绿色: rgba(0, 128, 0, 1) // Green
          // 蓝色: rgba(0, 0, 255, 1) // Bright Blue
          // 紫色: rgba(128, 0, 128, 1) // Purple
          // 青色: rgba(0, 255, 255, 1) // Cyan
          // 粉色: rgba(255, 192, 203, 1) // Pink
          // 浅绿色: rgba(144, 238, 144, 1) // Light Green
          // 浅蓝色: rgba(173, 216, 230, 1) // Light Blue
          // 深橙色: rgba(255, 140, 0, 1) // Dark Orange
          // 深紫色: rgba(75, 0, 130, 1) // Indigo
          // 淡黄色: rgba(255, 255, 224, 1) // Light Yellow
          // 淡灰色: rgba(211, 211, 211, 1) // Light Gray
          // 砖红色: rgba(178, 34, 34, 1) // Firebrick
          // 浅紫色: rgba(221, 160, 221, 1) // Plum
          // 草绿色: rgba(124, 252, 0, 1) // Lawn Green
          // 深天蓝色: rgba(0, 191, 255, 1) // Deep Sky Blue
        ],
        lines: [
          // { from: '0', to: '1', text: '93924.00' }
          { from: '41', to: '42', text: '484880.00' },
          { from: '41', to: '43', text: '160440.00' },
          { from: '41', to: '44', text: '128700.00' },
          { from: '41', to: '45', text: '106404.00' },
          { from: '41', to: '46', text: '70000.00' },
          { from: '41', to: '47', text: '60000.00' },
          { from: '41', to: '48', text: '49000.00' },
          { from: '41', to: '49', text: '48500.00' },
          { from: '41', to: '50', text: '20000.00' }
        ]
      }

      this.$refs.graphRef.setJsonData(__graph_json_data, (graphInstance) => {
        // 假设 __graph_json_data 包含节点数组和边数组
        // const nodes = graphInstance.getNodes(); // 获取当前图谱的节点

        // // 遍历每个节点并设置大小
        // nodes.forEach(node => {
        //     // 根据需要设置节点的大小，这里假设您有一个方法获取大小
        //     node.size = node.id; // 或根据节点的某些属性动态设置大小
        // });

        // // 重新渲染图谱以应用大小更改
        // graphInstance.refresh();
        const nodes = graphInstance.getNodes() // 获取当前图谱的节点

        // 遍历每个节点并设置大小
        nodes.forEach(node => {
          // 基于节点的 ID 或其他属性设置大小
          switch (node.id) {
            case '0':
              node.size = 2000 // 较大的节点
              break
            case '1':
              node.size = 1500 // 中等大小的节点
              break
            case '2':
              node.size = 1000 // 较小的节点
              break
            default:
              node.size = 8 // 默认大小
              break
          }
          // console.log(node.size)
        })

        // 重新渲染图谱以应用大小更改
        graphInstance.render() // 重新渲染图形
      })
    }
    // onNodeClick(nodeObject, $event) {
    //   console.log('onNodeClick:', nodeObject);
    // },
    // onLineClick(lineObject, linkObject, $event) {
    //   console.log('onLineClick:', lineObject);
    // }
    // showXXX(){
    //   // console.log("success")
    //   isShow = true;
    //   showGraph();
    // }
    // showGraph() {
    //   // You can process the input here to set up the graph data
    //   // const graphDataXXX = this.getGraphDataFromInput(this.input);

    //   // Assuming you have a method to generate graph data from input
    //   // this.$refs.graphRef.setData(graphData);
    //   this.isShow = true; // Show the graph
    // },
  }
}
</script>

