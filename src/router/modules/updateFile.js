import Layout from '@/layout'

const updateFileRouter = {
  path: '/updateFile',
  component: Layout,
  redirect: 'noRedirect',
  name: 'UpdateFile',
  meta: {
    title: '上传文件',
    icon: 'component'
  },
  children: [
    {
      path: 'updateFile',
      component: () => import('@/views/update/updateFile.vue'),
      name: 'UpdateFile',
      meta: { title: '导入数据' }
    }
  ]
}
export default updateFileRouter
