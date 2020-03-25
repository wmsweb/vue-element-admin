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
      <el-form-item label="机构名称: " prop="institutionId" style="width: 500px">
        <!--下拉框-->
        <el-select v-model="addForm.institutionId" placeholder="机构名称" style="width: 350px">
          <el-option v-for="item in names" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="授权设备数量: " prop="authorizeNum" style="width: 500px">
        <el-input v-model.number="addForm.authorizeNum" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="有效时间: " prop="startTime" style="width: 500px">
        <el-date-picker
          v-model="addForm.startTime"
          type="date"
          placeholder="生效日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="expireDateOption"
          clearable
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="失效时间: " prop="endTime" style="width: 500px">
        <el-date-picker
          v-model="addForm.endTime"
          type="date"
          placeholder="失效日期"
          :picker-options="expireDateOption"
          value-format="yyyy-MM-dd HH:mm:ss"
          clearable
          style="width: 100%;"
        />
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="handleAdd">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { getEnabledInstitutions } from '@/api/institution'
import { addAuthorization } from '@/api/authorization'

export default {

  props: {
    dialogFormVisible: Boolean
  },
  data() {
    var validateStartTime = (rule, value, callback) => {
      var curDate = new Date()
      if (value < curDate) {
        callback(new Error('开始日期必须大于等于今天'))
      } else if (this.addForm.endTime && this.addForm.endTime < value) {
        callback(new Error('开始时间必须小于等于结束时间'))
      } else {
        callback()
      }
    }
    var validateEndTime = (rule, value, callback) => {
      if (this.addForm.startTime && this.addForm.startTime > value) {
        callback(new Error('结束日期必须大于等于开始时间'))
      }
      var curDate = new Date()
      if (value < curDate) {
        callback(new Error('结束日期必须大于等于今天'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      rules: {
        institutionId: [
          { required: true, message: '请选择机构', trigger: 'click' }
        ],
        authorizeNum: [
          { required: true, message: '请输入授权数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字值', trigger: 'blur' }

        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' },
          { validator: validateStartTime, trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' },
          { validator: validateEndTime, trigger: 'blur' }
        ]
      },
      expireDateOption: {
        disabledDate(date) {
          return date.getTime() < Date.now()
        }
      },
      addForm: {},
      names: []

    }
  },
  mounted() {
    getEnabledInstitutions().then(result => {
      const { data } = result
      this.names = data
    })
  },
  methods: {
    handleCancel() {
      this.$refs['addForm'].clearValidate()
      this.addForm = {}
      // this.$refs['addForm'].resetFields()
      this.$emit('handleCancel')
    },
    handleAdd() {
      if (!this.loading) {
        this.loading = true
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            addAuthorization(this.addForm).then(result => {
              this.$notify({
                title: '操作成功',
                message: '添加授权成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$emit('handleAdd')
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.loading = false
          }
        })
      }
    },
    handleClose() {
      this.$refs['addForm'].clearValidate()
      this.addForm = {}
      // this.$refs['addForm'].resetFields()
      this.$emit('handleCancel')
    }
  }
}
</script>

<style lang="css" scoped>
</style>
