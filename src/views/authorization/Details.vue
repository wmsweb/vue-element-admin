<template>
  <el-dialog title="授权明细" :visible.sync="dialogDetailVisible" :before-close="handleClose" width="70%">

    <span slot="title" class="dialog-title">授权明细 <span style="font-weight:bold;padding-left: 300px">便利蜂</span></span>
    <hr>
    <div style="padding-top: 10px;padding-bottom: 10px">
      <h3>
        <span>授权总数: {{ detailData.totalNum }}</span>
        <span style="padding-left: 200px">当前可用授权数量: {{ detailData.availableNum }}</span>
      </h3>
    </div>

    <el-table :data="detailData.list">
      <el-table-column property="id" label="编号" />
      <el-table-column property="num" label="授权数量" />
      <el-table-column property="expireDate" label="有效期" />
      <el-table-column property="authorizationDate" label="授权日期" width="200px" />
      <el-table-column property="effectiveDate" label="生效时间" />
      <el-table-column property="failureDate" label="失效时间" />
      <el-table-column property="state" label="状态" />
      <el-table-column property="updaterName" label="操作人" />
    </el-table>

  </el-dialog>
</template>

<script>
export default {

  props: {
    dialogDetailVisible: Boolean,
    detailData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },

  data() {
    return {

    }
  },
  methods: {
    handleClose() {
      this.$emit('handleCancel')
    }
  }
}
</script>

<style lang="css" scoped>
</style>
