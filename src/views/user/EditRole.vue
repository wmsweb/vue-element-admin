<template>

  <el-dialog title="编辑角色" :visible.sync="dialogEditFormVisible" :before-close="handleCancel">
    <el-form
      ref="editRoleForm"
      :model="editRoleForm"
      :rules="rules"
      :hide-required-asterisk="false"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="角色ID: " style="width: 400px" prop="id">
        <el-input v-model="editRoleForm.id" autocomplete="off" disabled clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="角色KEY: " style="width: 400px" prop="name">
        <el-input v-model="editRoleForm.name" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="角色名称: " style="width: 400px" prop="alias">
        <el-input v-model="editRoleForm.alias" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="handleEdit">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>

import { updateRole } from '@/api/role'

export default {
  props: {
    dialogEditFormVisible: Boolean,
    editRoleForm: {
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
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    handleCancel() {
      this.$emit('handleCancel')
    },
    handleEdit() {
      if (!this.loading) {
        this.loading = true
        this.$refs['editRoleForm'].validate((valid) => {
          if (valid) {
            updateRole(this.editRoleForm).then(result => {
              this.$notify({
                title: '操作成功',
                message: '角色编辑成功',
                type: 'success',
                duration: 3000
              })
              this.loading = false
              this.editRoleForm = {}
              this.$emit('handleEditRole')
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
