import Layout from '@/layout'

const logManageRouter = {
  path: '/logManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'LogManage',
  meta: {
    title: '日志',
    icon: 'education'
  },
  children: [
    {
      path: 'logManage',
      component: () => import('@/views/logManager/logManager1.vue'),
      name: 'LogManage',
      meta: { title: '查看日志' }
    }
  ]
}
export default logManageRouter
