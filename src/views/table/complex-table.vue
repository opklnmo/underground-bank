<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="tableName"
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
        placeholder="用户名"
        style="width: 200px; margin-top: 7px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="opponent"
        placeholder="对手户名"
        style="width: 200px; margin-top: 7px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="cardNumber"
        placeholder="银行卡号"
        style="width: 200px; margin-top: 7px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="remark"
        placeholder="备注"
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
      <!-- <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.[0].value }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="交易户名"
        prop="account"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易卡号" prop="cardNumber" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.cardNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易账号" prop="accountNumber" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.accountNumber }}</span>
          <!-- <span class="link-cardNumber" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        label="交易时间"
        prop="time"
        width="160px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="收付标志"
        prop="signal"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.signal }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易金额"
        prop="tractionMoney"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.tractionMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易余额"
        prop="transactionBalance"
        width="160px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.transactionBalance }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易币种"
        prop="currence"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.currence }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="对手账户"
        prop="counterAccountNumber"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.counterAccountNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="对手户名"
        prop="counterAccount"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.counterAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易网点名称"
        prop="outlet"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.outlet }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="对手开户银行"
        prop="counterBank"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.counterBank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="摘要说明" prop="statement" width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.statement }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ip" prop="ip" width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="mac" prop="mac" width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.mac }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import axios from 'axios'
import {
// fetchList,
// fetchPv,
// createArticle,
// updateArticle
} from '@/api/article'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      options: [],
      tableName: '', // 选中的数据表
      tableKey: 0,
      list: null,
      rawData: null,
      total: 0,
      listLoading: true,
      username: '',
      opponent: '',
      cardNumber: '',
      remark: '',
      listQuery: {
        tableName: null,
        page: 1,
        limit: 10,
        name: '金吉子',
        opponent: null,
        account: null,
        remark: null // 新增备注输入框
      },
      showReviewer: false,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      axios
        .post('http://127.0.0.1:8000/all_transaction_history', this.listQuery) // 使用 POST 请求
        .then((response) => {
          this.rawData = response.data.items
          this.total = response.data.total
          this.list = this.rawData.map((item) => {
            return {
              account: item[0] === 'None' ? '空' : item[0],
              cardNumber: item[1] === 'None' ? '空' : item[1],
              accountNumber: item[2] === 'None' ? '空' : item[2],
              time: item[3] === 'None' ? '空' : item[3],
              signal: item[4] === 'None' ? '空' : item[4],
              tractionMoney: item[5] === 'None' ? '空' : Number(item[5]), // 转换为数字
              transactionBalance: item[6] === 'None' ? '空' : Number(item[6]),
              currence: item[7] === 'None' ? '空' : item[7],
              counterAccountNumber: item[8] === 'None' ? '空' : item[8],
              counterAccount: item[9] === 'None' ? '空' : item[9],
              outlet: item[10] === 'None' ? '空' : item[10],
              counterBank: item[11] === 'None' ? '空' : item[11],
              remark: item[12] === 'None' ? '空' : item[12],
              statement: item[13] === 'None' ? '空' : item[13],
              ip: item[14] === 'None' ? '空' : item[14],
              mac: item[15] === 'None' ? '空' : item[15]
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
      this.listQuery.name = this.username || null
      this.listQuery.account = this.cardNumber || null
      this.listQuery.remark = this.remark || null
      this.listQuery.opponent = this.opponent || null
      this.listQuery.tableName = this.tableName
      console.log(this.listQuery)
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
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
