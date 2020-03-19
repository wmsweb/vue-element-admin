<template>
  <el-dialog title="增加授权" :visible.sync="dialogFormVisible" :before-close="handleClose">
    <el-form
      ref="addForm"
      :model="addForm"
      :rules="rules"
      :hide-required-asterisk="false"
      label-position="left"
      label-width="150px"
    >
      <el-form-item label="机构名称: " prop="name" style="width: 500px">
        <!--下拉框-->
        <el-select v-model="addForm.name" placeholder="机构名称">
          <!--<el-option :value="1">11</el-option> -->
          <!--<el-option :value="2">22</el-option> -->
          <!--<el-option :value="3">33</el-option> -->

          <el-option v-for="item in names" :key="item.value" :label="item.label" :value="item.label" />

        </el-select>
      </el-form-item>

      <el-form-item label="授权设备数量: " prop="num" style="width: 500px">
        <el-input v-model="addForm.num" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="有效时间: " prop="date1" style="width: 500px">
        <el-date-picker v-model="addForm.date1" type="date" placeholder="生效日期" clearable style="width: 100%;" />
      </el-form-item>
      <el-form-item label="失效时间: " prop="date2" style="width: 500px">
        <el-date-picker v-model="addForm.date2" type="date" placeholder="失效日期" clearable style="width: 100%;" />
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="handleAdd">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {

  props: {
    dialogFormVisible: Boolean,
    addForm: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      rules: {},
      names: [
        { label: '家乐福', value: '1' },
        { label: '百家乐', value: '2' },
        { label: '沃尔玛', value: '3' }
      ]

    }
  },
  methods: {
    handleCancel() {
      this.$emit('handleCancel')
    },
    handleAdd() {
      this.$emit('handleCancel')
    },
    handleClose() {
      this.$emit('handleCancel')
    }
  }
}
</script>

<style lang="css" scoped>
</style>
