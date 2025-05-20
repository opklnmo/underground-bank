import Layout from '@/layout'

const databaseManageRouter = {
  path: '/databaseManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'DatabaseManage',
  meta: {
    title: '数据库操纵',
    icon: 'edit'
  },
  children: [
    {
      path: 'databaseManage1',
      component: () => import('@/views/databaseManage/databaseManage1.vue'),
      name: 'DatabaseManage',
      meta: { title: '数据库操作页面' }
    }
  ]
}
export default databaseManageRouter
