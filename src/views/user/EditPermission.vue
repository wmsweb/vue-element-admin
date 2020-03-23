<template>

  <el-dialog title="编辑权限" :visible.sync="dialogEditFormVisible" :before-close="handleCancel">
    <el-form
      ref="permissionEditForm"
      :model="permissionEditForm"
      :rules="rules"
      :hide-required-asterisk="false"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="权限名称: " style="width: 400px" prop="name">
        <el-input v-model="permissionEditForm.name" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="URL: " style="width: 400px" prop="url">
        <el-input v-model="permissionEditForm.url" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="描述: " style="width: 400px" prop="description">
        <el-input v-model="permissionEditForm.description" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="父节点ID: " style="width: 400px" prop="pid">
        <el-input v-model="permissionEditForm.pid" autocomplete="off" disabled maxlength="25" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="handleEdit">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>

import { updatePermission } from '@/api/permission'

export default {
  props: {
    dialogEditFormVisible: Boolean,
    permissionEditForm: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
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
      this.$emit('handleCancel')
    },
    handleEdit() {
      if (!this.loading) {
        this.loading = true
        this.$refs['permissionEditForm'].validate((valid) => {
          if (valid) {
            updatePermission(this.permissionEditForm).then(result => {
              this.$notify({
                title: '操作成功',
                message: '权限修改成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.permissionEditForm = {}
              this.$emit('handleEdit')
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
