<template>
  <div class="upload-container">
    <el-upload :action="action" :headers="headers">请上传</el-upload>
  </div>
</template>

<script>

import { getToken } from '@/utils/auth'

export default {
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
  }
}
</script>

<style>

</style>
