<template>

  <el-dialog title="添加权限" :visible.sync="dialogFormVisible" :before-close="handleClose">
    <el-form
      ref="permissionForm"
      :model="permissionForm"
      :rules="rules"
      :hide-required-asterisk="false"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="权限名称: " style="width: 400px" prop="name">
        <el-input v-model="permissionForm.name" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="URL: " style="width: 400px" prop="url">
        <el-input v-model="permissionForm.url" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="描述: " style="width: 400px" prop="description">
        <el-input v-model="permissionForm.description" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="父节点ID: " style="width: 400px" prop="pid">
        <el-input v-model="pid" autocomplete="off" disabled maxlength="25" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="handleAdd">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>

import { addPermission } from '@/api/permission'

export default {
  props: {
    dialogFormVisible: Boolean,
    pid: {
      type: Number,
      default: function() {
        return 0
      }
    }
  },
  data() {
    return {
      loading: false,
      permissionForm: {},
      rules: {
        name: [
          { required: true, message: '请输入name', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入url', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述信息', trigger: 'blur' }
        ]
      }

    }
  },
  // watch: {
  //   pid() {
  //     this.pidChange()
  //   }
  // },
  methods: {
    // pidChange() {
    //   this.permissionForm.pid = this.pid
    // },
    handleCancel() {
      this.permissionForm = {}
      this.$emit('handleCancel')
    },
    handleClose() {
      this.permissionForm = {}
      this.$emit('handleCancel')
    },
    handleAdd() {
      if (!this.loading) {
        this.loading = true
        this.$refs['permissionForm'].validate((valid) => {
          if (valid) {
            this.permissionForm.pid = this.pid
            addPermission(this.permissionForm).then(result => {
              this.$notify({
                title: '操作成功',
                message: '权限添加成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.permissionForm = {}
              this.$emit('handleAdd')
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.loading = false
          }
        })
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
