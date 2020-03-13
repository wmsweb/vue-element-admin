<template>
  <div class="upload-container">
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-exceed="onExceed"
      :disabled="disabled"
      drag
      show-file-list
      accept="application/epub+zip"
      class="image-upload"
    >
      <i class="el-icon-upload" />
      <div v-if="fileList.length === 0" class="el-upload__text">
        请将文件拖入或<em>点击上传</em>
      </div>
      <div v-else class="el-upload__text">文件已上传</div>
    </el-upload>
  </div>
</template>

<script>

import { getToken } from '@/utils/auth'

export default {
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/file/upload` // 上传地址
    }
  },
  computed: {
    headers() {
      return {
        Authorization: `${getToken()}`
      }
    }
  },
  methods: {
    beforeUpload(file) { // 上传之前执行的方法
      this.$emit('beforeUpload', file) // 提交给父组件监听方法
    },
    onSuccess(response, file) {
      const { code, message } = response
      if (code === 0) {
        this.$message({
          message: message,
          type: 'success'
        })
        this.$emit('onSuccess', file)
      } else {
        this.$message({
          message: (message && `上传失败,失败原因:${message}`) || '上传失败',
          type: 'error'
        })
        this.$emit('onError', file)
      }
    },
    onError(err) {
      console.log({ err }) // err 加大括号转换成一个对象的方式打印出来,可以看到详细信息,这个也是一个技巧
      const errMsg = (err.message && JSON.parse(err.message)) || '上传失败'
      this.$message({
        message: (errMsg && errMsg.message && `上传失败,失败原因: ${errMsg.message}`) || '上传失败',
        type: 'error'
      })
      this.$emit('onErr', err) // 提交给父组件监听
    },
    onRemove() {
      console.log('调用服务端接口,删除已上传的文件')
      this.$message({
        message: '文件删除成功',
        type: 'success'
      })
      this.$emit('onRemove')
    },
    onExceed() {
      console.log('上传文件数量超限制')
      this.$message({
        message: '每次只能上传一个文件',
        type: 'warning'
      })
    }
  }
}
</script>

<style>

</style>
