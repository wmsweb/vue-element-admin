<template>
  <el-dialog title="授权明细" :visible.sync="dialogDetailVisible" :before-close="handleClose">

    <span slot="title" class="dialog-title">授权明细 <span style="font-weight:bold;padding-left: 300px">便利蜂</span></span>
    <hr>
    <div style="padding-top: 10px;padding-bottom: 10px">
      <h3><span>授权总数: 300</span><span style="padding-left: 200px">当前可用授权数量: 100</span></h3>
    </div>

    <el-table :data="detailData">
      <el-table-column property="id" label="编号" width="70" />
      <el-table-column property="num" label="授权数量" width="100" />
      <el-table-column property="expireDate" label="有效期" width="100" />
      <el-table-column property="authorizationDate" label="授权日期" width="150" />
      <el-table-column property="effectiveDate" label="生效时间" width="150" />
      <el-table-column property="failureDate" label="失效时间" width="150" />
      <el-table-column property="state" label="状态" width="100" />
      <el-table-column property="updaterName" label="操作人" width="100" />
    </el-table>

  </el-dialog>
</template>

<script>
export default {

  props: {
    dialogDetailVisible: Boolean
    // detailData: Array
  },

  data() {
    return {
      detailData: [
        { id: 1000,
          num: 300,
          expireDate: '一年',
          authorizationDate: '2020.3.20',
          effectiveDate: '2020.3.20',
          failureDate: '2020.3.20',
          state: '进行中',
          updaterName: 'test'
        },
        { id: 1000,
          num: 300,
          expireDate: '一年',
          authorizationDate: '2020.3.20',
          effectiveDate: '2020.3.20',
          failureDate: '2020.3.20',
          state: '进行中',
          updaterName: 'test'
        },
        { id: 1000,
          num: 300,
          expireDate: '一年',
          authorizationDate: '2020.3.20',
          effectiveDate: '2020.3.20',
          failureDate: '2020.3.20',
          state: '进行中',
          updaterName: 'test'
        },
        { id: 1000,
          num: 300,
          expireDate: '一年',
          authorizationDate: '2020.3.20',
          effectiveDate: '2020.3.20',
          failureDate: '2020.3.20',
          state: '进行中',
          updaterName: 'test'
        },
        { id: 1000,
          num: 300,
          expireDate: '一年',
          authorizationDate: '2020.3.20',
          effectiveDate: '2020.3.20',
          failureDate: '2020.3.20',
          state: '进行中',
          updaterName: 'test'
        }
      ]

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
