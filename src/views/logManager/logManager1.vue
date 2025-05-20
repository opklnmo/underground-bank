<template>
    <div class="app-container">
      <div class="filter-container">
        <!-- <el-input
          v-model="time"
          placeholder="时间"
          style="width: 200px; margin-top: 7px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        /> -->
        <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期时间"
            end-placeholder="结束日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 350px; margin-top: 7px;"
        />

        <el-input
          v-model="username"
          placeholder="用户名"
          style="width: 200px; margin-top: 7px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />

        <el-input
          v-model="fileName"
          placeholder="文件名"
          style="width: 200px; margin-top: 7px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="databaseName"
          placeholder="数据库名"
          style="width: 200px; margin-top: 7px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          class="filter-item search_submit"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column
          label="时间"
          prop="time"
          width="150px"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.time }}</span>
          </template>
        </el-table-column>

        <el-table-column label="用户名" prop="username" min-width="150px">
          <template slot-scope="{ row }">
            <span>{{ row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件名" prop="fileName" min-width="150px">
          <template slot-scope="{ row }">
            <span>{{ row.fileName }}</span>
            <!-- <span class="link-cardNumber" @click="handleUpdate(row)">{{ row.title }}</span>
            <el-tag>{{ row.type | typeFilter }}</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column
          label="数据库名"
          prop="databaseName"
          width="160px"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.databaseName }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pagelimit"
        @pagination="getList"
      />
    </div>
  </template>

<script>
import axios from 'axios'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'LogManager',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      rawData: null,
      tableKey: 0,
      total: 0,
      listLoading: true,
      time: [],
      username: '',
      fileName: '',
      databaseName: '',
      listQuery: {
        page: 1,
        pagelimit: 10,
        time: null,
        username: null,
        fileName: null,
        databaseName: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      axios
        .post('http://127.0.0.1:8000/all_log_history', this.listQuery) // 使用 POST 请求
        .then((response) => {
          this.rawData = response.data.items
          this.total = response.data.total
          this.list = this.rawData.map((item) => {
            return {
              time: item[0] === 'None' ? '空' : item[0],
              username: item[1] === 'None' ? '空' : item[1],
              fileName: item[2] === 'None' ? '空' : item[2],
              databaseName: item[3] === 'None' ? '空' : item[3]
            }
          })
        })
        .catch((error) => {
          console.error('Error fetching the list:', error)
        })
        .finally(() => {
          // 模拟请求时间
          setTimeout(() => {
            this.listLoading = false
          }, 1500)
        })
    },
    handleFilter() {
      console.log('handleFilter called')
      this.listQuery.page = 1
      this.listQuery.time = this.time || null
      this.listQuery.username = this.username || null
      this.listQuery.fileName = this.fileName || null
      this.listQuery.databaseName = this.databaseName
      console.log(this.listQuery)
      this.getList()
    }
  }
}
</script>

  <style>
  .filter-item {
    margin: 0 15px;
  }
  .search_submit {
    position: relative; /* 相对定位，以便伪元素定位 */
    overflow: hidden; /* 隐藏溢出部分 */
    border: none; /* 去掉按钮边框 */
    background-color: #007bffd5; /* 按钮背景颜色 */
    color: white; /* 字体颜色 */
    padding: 10px 20px; /* 按钮内边距 */
    border-radius: 4px; /* 圆角 */
    cursor: pointer; /* 鼠标指针 */
    transition: background-color 0.3s; /* 背景颜色过渡 */
  }
  </style>
