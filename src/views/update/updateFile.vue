<template>
  <div style="margin-right: 40px">
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
    <el-upload
      ref="upload"
      class="upload-demo"
      action="http://localhost:8000/file"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :auto-upload="false"
      :on-success="handleSuccess"
      :on-error="handleError"
      accept=".xls,.xlsx"
>
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入数据</el-button>
      <el-button style="margin-left: 10px;" size="small" type="info" @click="DownloadModel">下载模板</el-button>
      <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
    </el-upload>
  </div>
</template>

<script>
import axios from 'axios'
import * as XLSX from 'xlsx'
import { USER } from '../login/index.vue'

export default {
  data() {
    return {
      options: [],
      value: '', // 选中的数据表
      fileList: [],
      transactionData: [], // 用于存储交易数据
      requiredHeaders: [
        '交易户名', '交易卡号', '交易账号', '交易时间',
        '交易金额', '交易余额', '收付标志', '对手账号',
        '现金标志', '对手户名', '对手身份证号', '对手开户银行',
        '摘要说明', '交易币种', '交易网点名称', '交易发生地',
        '交易是否成功', '传票号', 'IP地址', 'MAC地址',
        '对手交易余额', '交易流水号', '日志号', '凭证种类',
        '凭证号', '交易柜员号', '备注', '查询反馈结果原因'
      ]
    }
  },
  methods: {
    submitUpload() {
      const files = this.fileList
      if (files.length > 0) {
        // this.$refs.upload.submit();  //自动上传整个文件列表
        // 遍历所有文件
        files.forEach(fileItem => {
          const file = fileItem.raw // 获取每个文件
          console.log(file.name)

          const reader = new FileReader()
          reader.onload = (e) => {
            const arrayBuffer = e.target.result // 使用 ArrayBuffer
            const workbook = XLSX.read(arrayBuffer, { type: 'array' })

            // 只处理第一个工作表
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            // 将数据转为 JSON 格式
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            // 检查表头
            const headers = jsonData[0]
            const isValid = this.validateHeaders(headers)

            if (isValid) {
              const fileName = file.name
              const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
              // 使用正则表达式去除数字
              const validName = nameWithoutExt.replace(/[0-9]/g, '')
              console.log(validName)

              // 保存交易数据，第一列作为交易户名
              const header = jsonData[0] // 获取表头
              const expectedHeader = '交易户名'
              var flag = 0
              // 检查表头第一个元素是否为交易户名
              if (header[0] !== expectedHeader) {
                // 手动添加交易户名到表头
                header.unshift(expectedHeader) // 在开头插入交易户名
                flag = 1
              }
              // 保存交易数据，第一列作为交易户名
              for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i]
                var transaction = {}
                if (row.length > 0) {
                  if (flag === 1) {
                    transaction = {
                      交易户名: validName, // 文件名作为交易户名
                      交易卡号: row[0] ? String(row[0]).replace(/\t/g, '').trim() : '',
                      交易账号: row[1] ? String(row[1]).replace(/\t/g, '').trim() : '',
                      交易时间: row[2] ? String(row[2]).replace(/\t/g, '').trim() : '',
                      交易金额: row[3] ? String(row[3]).replace(/\t/g, '').trim() : '',
                      交易余额: row[4] ? String(row[4]).replace(/\t/g, '').trim() : '',
                      收付标志: row[5] ? String(row[5]).replace(/\t/g, '').trim() : '',
                      对手账号: row[6] ? String(row[6]).replace(/\t/g, '').trim() : '',
                      现金标志: row[7] ? String(row[7]).replace(/\t/g, '').trim() : '',
                      对手户名: row[8] ? String(row[8]).replace(/\t/g, '').trim() : '',
                      对手身份证号: row[9] ? String(row[9]).replace(/\t/g, '').trim() : '',
                      对手开户银行: row[10] ? String(row[10]).replace(/\t/g, '').trim() : '',
                      摘要说明: row[11] ? String(row[11]).replace(/\t/g, '').trim() : '',
                      交易币种: row[12] ? String(row[12]).replace(/\t/g, '').trim() : '',
                      交易网点名称: row[13] ? String(row[13]).replace(/\t/g, '').trim() : '',
                      交易发生地: row[14] ? String(row[14]).replace(/\t/g, '').trim() : '',
                      交易是否成功: row[15] ? String(row[15]).replace(/\t/g, '').trim() : '',
                      传票号: row[16] ? String(row[16]).replace(/\t/g, '').trim() : '',
                      IP地址: row[17] ? String(row[17]).replace(/\t/g, '').trim() : '',
                      MAC地址: row[18] ? String(row[18]).replace(/\t/g, '').trim() : '',
                      对手交易余额: row[19] ? String(row[19]).replace(/\t/g, '').trim() : '',
                      交易流水号: row[20] ? String(row[20]).replace(/\t/g, '').trim() : '',
                      日志号: row[21] ? String(row[21]).replace(/\t/g, '').trim() : '',
                      凭证种类: row[22] ? String(row[22]).replace(/\t/g, '').trim() : '',
                      凭证号: row[23] ? String(row[23]).replace(/\t/g, '').trim() : '',
                      交易柜员号: row[24] ? String(row[24]).replace(/\t/g, '').trim() : '',
                      备注: row[25] ? String(row[25]).replace(/\t/g, '').trim() : '',
                      查询反馈结果原因: row[26] ? String(row[26]).replace(/\t/g, '').trim() : ''
                    }
                  } else {
                    transaction = {
                      交易户名: row[0],
                      交易卡号: row[1] ? String(row[1]).replace(/\t/g, '').trim() : '',
                      交易账号: row[2] ? String(row[2]).replace(/\t/g, '').trim() : '',
                      交易时间: row[3] ? String(row[3]).replace(/\t/g, '').trim() : '',
                      交易金额: row[4] ? String(row[4]).replace(/\t/g, '').trim() : '',
                      交易余额: row[5] ? String(row[5]).replace(/\t/g, '').trim() : '',
                      收付标志: row[6] ? String(row[6]).replace(/\t/g, '').trim() : '',
                      对手账号: row[7] ? String(row[7]).replace(/\t/g, '').trim() : '',
                      现金标志: row[8] ? String(row[8]).replace(/\t/g, '').trim() : '',
                      对手户名: row[9] ? String(row[9]).replace(/\t/g, '').trim() : '',
                      对手身份证号: row[10] ? String(row[10]).replace(/\t/g, '').trim() : '',
                      对手开户银行: row[11] ? String(row[11]).replace(/\t/g, '').trim() : '',
                      摘要说明: row[12] ? String(row[12]).replace(/\t/g, '').trim() : '',
                      交易币种: row[13] ? String(row[13]).replace(/\t/g, '').trim() : '',
                      交易网点名称: row[14] ? String(row[14]).replace(/\t/g, '').trim() : '',
                      交易发生地: row[15] ? String(row[15]).replace(/\t/g, '').trim() : '',
                      交易是否成功: row[16] ? String(row[16]).replace(/\t/g, '').trim() : '',
                      传票号: row[17] ? String(row[17]).replace(/\t/g, '').trim() : '',
                      IP地址: row[18] ? String(row[18]).replace(/\t/g, '').trim() : '',
                      MAC地址: row[19] ? String(row[19]).replace(/\t/g, '').trim() : '',
                      对手交易余额: row[20] ? String(row[20]).replace(/\t/g, '').trim() : '',
                      交易流水号: row[21] ? String(row[21]).replace(/\t/g, '').trim() : '',
                      日志号: row[22] ? String(row[22]).replace(/\t/g, '').trim() : '',
                      凭证种类: row[23] ? String(row[23]).replace(/\t/g, '').trim() : '',
                      凭证号: row[24] ? String(row[24]).replace(/\t/g, '').trim() : '',
                      交易柜员号: row[25] ? String(row[25]).replace(/\t/g, '').trim() : '',
                      备注: row[26] ? String(row[26]).replace(/\t/g, '').trim() : '',
                      查询反馈结果原因: row[27] ? String(row[27]).replace(/\t/g, '').trim() : ''
                    }
                  }

                  this.transactionData.push(transaction)
                }
              }
              // console.log('交易数据:', this.transactionData);
              this.fetchData()
            } else {
              this.$message.error(file.name + '的文件格式错误，请检查表头是否符合要求。')
            }
          }
          reader.readAsArrayBuffer(file)
        })
      } else {
        this.$message({
          message: '未上传任何文件',
          type: 'warning'
        })
      }
    },
    fetchData() {
      const filenames = Array.from(this.fileList).map(file => file.name)
      axios.post('http://127.0.0.1:8000/upload', { user: USER, filename: filenames, tableName: this.value, newMember: this.transactionData })
        .then(response => {
          const success_lines = response.data.success_lines
          const fail_lines = response.data.fail_lines
          const repeat_members = response.data.intersection
          // 原来替代再往下一行的<pre style="text-align: left; background: #f5f7fa; padding: 15px; border-radius: 4px;">
          this.$alert(`
              <pre style="white-space: pre-wrap; text-align: left; background: #f5f7fa; 
               padding: 15px; border-radius: 4px; max-height: 400px; overflow-y: auto;">
符合要求的文件上传成功！
成功行数: ${success_lines}
失败行数: ${fail_lines}
重复对象: ${repeat_members}
              </pre>
            `, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            center: true,
            // closeOnClickModal: true,
            lockScroll: true,
            showClose: true,
            customClass: 'code-alert'
          })
        })
        .catch(error => {
          this.$message.error('上传失败:', error)
        })
    },
    validateHeaders(headers) { // 检查表头是否符合要求
      // 去除表头中的制表符和多余的空格
      headers = headers.map(header => header.replace(/\t/g, '').trim())
      const cleanHeaders = [...headers]
      // 检查表头的第一个元素是否为 "交易户名"
      if (cleanHeaders[0] !== '交易户名') {
        cleanHeaders.unshift('交易户名') // 如果不是，手动添加 "交易户名" 到开头
      }
      // console.log(JSON.stringify(cleanHeaders))
      // console.log(JSON.stringify(this.requiredHeaders))
      return JSON.stringify(cleanHeaders) === JSON.stringify(this.requiredHeaders)
    },
    handleChange(file, fileList) {
      this.fileList = fileList // 更新 fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleSuccess(response, file) {
      console.log('上传成功:', response)
    },
    handleError(err, file) {
      console.error('上传失败，请重新上传符合条件的文件格式:', err)
    },
    DownloadModel() {
      const link = document.createElement('a')
      link.href = '模板.xlsx'
      link.download = '模板.xlsx' // 指定下载的文件名
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
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
    }
  }
}
</script>

<style scoped>
.upload-demo {
  margin: 20px; /* 增加整体边距 */
}

.el-upload {
  margin-bottom: 20px; /* 上传组件下方边距 */
}

.el-button {
  margin-top: 10px; /* 上传按钮上方边距 */
}

.el-upload__tip {
  margin-top: 10px; /* 提示文本上方边距 */
}

.upload-container {
  margin-right: 40px; /* 添加右侧间距 */
}
</style>
