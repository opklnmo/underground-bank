<template>
  <div>
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
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
    </el-upload>
  </div>
</template>

<script>

export default {
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    submitUpload() {
      const files = this.fileList
      if (files.length > 0) {
        this.$refs.upload.submit() // 自动上传
      } else {
        console.log('未上传任何文件')
      }
    },

    handleChange(file, fileList) {
      console.log('文件变化:', file)
      console.log('当前文件列表:', fileList)
      this.fileList = fileList // 更新 fileList
    },
    handleRemove(file, fileList) {
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
    }
  }
}
</script>
