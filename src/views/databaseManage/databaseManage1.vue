<template>
  <div>
    <div style="margin-top: 20px;">
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
        <el-button
        type="danger"
        style="margin-left: 10px;"
        @click="handleDelete"
        >
        删除
        </el-button>
        <el-button
        type="primary"
        style="margin-left: 10px;"
        @click="handleFilter"
        >
        筛选
        </el-button>
    </div>

    <div v-if="showSelectButton" style="margin-top: 20px; position: relative;">
        <div v-for="(item, index) in inputGroups" :key="index" style="margin-bottom: 10px;">
            <el-select
                v-model="item.attribute"
                placeholder="属性"
                no-data-text="已经没有数据了"
                style="margin-left: 20px;"
            >
                <el-option
                    v-for="option in options1"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
/>
            </el-select>

            <el-select
                v-model="item.logical"
                placeholder="逻辑"
                no-data-text="已经没有数据了"
                style="margin-left: 10px;"
            >
                <el-option
                    v-for="option in options2"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
/>
            </el-select>

            <el-input
                v-model="item.content"
                placeholder="内容"
                style="margin-left: 10px; width: 200px;"
/>
        </div>
        <div style="position: absolute; top: 0px; left: 651px;">
            <el-button
                type="primary"
                style="margin-left: 10px;"
                @click="handleAnd"
            >
            且
            </el-button>

            <el-button
                type="primary"
                style="margin-left: 10px;"
                @click="handleOr"
            >
            或
            </el-button>

            <el-button
                type="primary"
                style="margin-left: 10px;"
                @click="handleFulfill"
            >
            添加完成
            </el-button>
        </div>
    </div>

    <div v-if="showSubmitButton" style="margin-top: 20px; margin-left: 10px;">
        <el-input
            v-model="newTable"
            placeholder="数据表名"
            style="margin-left: 10px; width: 200px;"
/>

        <el-button
            type="primary"
            style="margin-left: 10px;"
            @click="submit"
        >
        确认
        </el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      newTable: '',
      value: '', // 选中的数据表
      options: [], // 选择框中的选项
      loading: false, // 加载状态
      showSelectButton: false,
      showSubmitButton: false,
      inputGroups: [
        { attribute: '', logical: '', content: '' } // 初始输入组
      ],
      options1: [ // 属性选项
        { label: '交易户名', value: '交易户名' },
        { label: '交易卡号', value: '交易卡号' },
        { label: '交易账号', value: '交易账号' },
        { label: '交易时间', value: '交易时间' },
        { label: '交易金额', value: '交易金额' },
        { label: '交易余额', value: '交易余额' },
        { label: '收付标志', value: '收付标志' },
        { label: '对手账号', value: '对手账号' },
        { label: '现金标志', value: '现金标志' },
        { label: '对手户名', value: '对手户名' },
        { label: '对手身份证号', value: '对手身份证号' },
        { label: '对手开户银行', value: '对手开户银行' },
        { label: '摘要说明', value: '摘要说明' },
        { label: '交易币种', value: '交易币种' },
        { label: '交易网点名称', value: '交易网点名称' },
        { label: '交易发生地', value: '交易发生地' },
        { label: '交易是否成功', value: '交易是否成功' },
        { label: '传票号', value: '传票号' },
        { label: 'IP地址', value: 'IP地址' },
        { label: 'MAC地址', value: 'MAC地址' },
        { label: '对手交易余额', value: '对手交易余额' },
        { label: '交易流水号', value: '交易流水号' },
        { label: '日志号', value: '日志号' },
        { label: '凭证种类', value: '凭证种类' },
        { label: '凭证号', value: '凭证号' },
        { label: '交易柜员号', value: '交易柜员号' },
        { label: '备注', value: '备注' },
        { label: '查询反馈结果原因', value: '查询反馈结果原因' }
      ],
      options2: [ // 逻辑选项
        { label: '大于', value: '大于' },
        { label: '大于等于', value: '大于等于' },
        { label: '小于', value: '小于' },
        { label: '小于等于', value: '小于等于' },
        { label: '等于', value: '等于' },
        { label: '不等于', value: '不等于' },
        { label: '是', value: '是' },
        { label: '非', value: '非' }
      ]
    }
  },
  methods: {
    handleSearch() {
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
    },
    handleDelete() {
      if (this.value.length > 0) {
        axios.post('http://127.0.0.1:8000/drop_table', { table4drop: this.value })
          .then(response => {
            const is_success = response.data.isSuccess
            if (is_success) {
              this.$message.success('已删除选中的表')
              // 清空选中的值
              this.value = []
            } else {
              this.$message.warning('删除失败，请联系管理员...')
            }
          })
          .catch(error => {
            this.$message.error('上传失败:', error)
          })
      } else {
        this.$message.warning('没有选中的项可删除')
      }
    },
    handleFilter() {
      if (this.value) {
        this.showSelectButton = true
      }
    },
    handleSelectChange() {
      // 当选择框内容变化时隐藏“添加完成”按钮
      this.showSelectButton = false
      this.showSubmitButton = false
    },
    handleAnd() {
      // 处理且按钮的逻辑
      this.inputGroups.push({ attribute: '', logical: '', content: '', connect: '且' })
    },
    handleOr() {
      // 处理或按钮的逻辑
      this.inputGroups.push({ attribute: '', logical: '', content: '', connect: '或' })
    },
    handleFulfill() {
      this.showSubmitButton = true
    },
    submit() {
      const newDictionary = {
        original_form: this.value,
        logical: this.inputGroups,
        new_form: this.newTable
      }

      axios.post('http://127.0.0.1:8000/logical_filter', newDictionary)
        .then(response => {
          const result = response.data.result

          if (result === 0) {
            this.$message.success('成功')
          } else {
            this.$message.error('上传失败，错误码为：', result)
          }
        })
        .catch(error => {
          this.$message.error('上传失败:', error)
        })
    }
  }
}
</script>
