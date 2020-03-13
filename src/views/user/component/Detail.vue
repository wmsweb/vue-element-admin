<template>
  <el-form ref="postForm" :model="postForm">
    <sticky :class-name="'sub-navbar'">

      <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
      <el-button v-loading="loading" type="success" style="margin-left: 10px" @click="submitForm">{{ isEdit? '编辑用户':'新增用户' }}</el-button>

    </sticky>

    <div class="detail-container">
      <warning />  <!-- 提醒组件 -->
      <el-row>
        <el-col :span="24">
          <EbookUpload />
        </el-col>
        <el-col :span="24" />
      </el-row>

    </div>

  </el-form>
</template>

<script>

import Sticky from '../../../components/Sticky/index'
import Warning from './Warning'
import EbookUpload from '@/components/EbookUpload'

export default {

  components: {
    Sticky,
    Warning,
    EbookUpload
  },
  props: {
    isEdit: Boolean
  },
  data() {
    return {
      loading: false,
      postForm: {

      }
    }
  },
  methods: {
    submitForm() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    showGuide() {
      alert('showGuide')
    }
  }

}
</script>

<style>

</style>
