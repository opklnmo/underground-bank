/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: '数据监测',
    icon: 'chart'
  },
  children: [
    // {
    //   path: 'keyboard',
    //   component: () => import('@/views/charts/keyboard'),
    //   name: 'KeyboardChart',
    //   meta: { title: 'Keyboard Chart', noCache: true }
    // },
    // {
    //   path: 'line',
    //   component: () => import('@/views/charts/line'),
    //   name: 'LineChart',
    //   meta: { title: 'Line Chart', noCache: true }
    // },
    // {
    //   path: 'mix-chart',
    //   component: () => import('@/views/charts/mix-chart'),
    //   name: 'MixChart',
    //   meta: { title: 'Mix Chart', noCache: true }
    // },
    {
      path: 'KnowledgeGraph',
      component: () => import('@/views/charts/knowledgeGraph.vue'),
      name: 'KnowledgeGraph',
      meta: { title: '人物关系网', noCache: true }
    },
    // {
    //   path: 'perKnowledgeGraph',
    //   component: () => import('@/views/charts/test.vue'),
    //   name: 'Test',
    //   meta: { title: '单级人物关系网', noCache: true }
    // },
    {
      path: 'lineChart',
      component: () => import('@/views/charts/lineChart.vue'),
      name: 'LineChart',
      meta: { title: '交易流水分析', noCache: true }
    },
    {
      path: 'RateGraph',
      component: () => import('@/views/charts/RateGraph.vue'),
      name: 'RategeGraph',
      meta: { title: '嫌疑排名', noCache: true }
    },
    {
      path: 'transmit-detail',
      component: () => import('@/views/charts/TransmitDetail.vue'),
      name: 'TransmitDetail',
      meta: { title: '详细信息', noCache: true },
      hidden: true
    }
  ]
}

export default chartsRouter
