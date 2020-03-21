<template>

  <el-dialog title="添加角色" :visible.sync="dialogFormVisible" :before-close="handleClose">
    <el-form
      ref="roleForm"
      :model="roleForm"
      :rules="rules"
      :hide-required-asterisk="false"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="角色名称: " style="width: 400px" prop="name">
        <el-input v-model="roleForm.name" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="角色描述: " style="width: 400px" prop="alias">
        <el-input v-model="roleForm.alias" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="handleAdd">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>

import { addRole } from '@/api/role'

export default {
  props: {
    dialogFormVisible: Boolean
  },

  data() {
    return {
      loading: false,
      roleForm: {},
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
    handleClose() {
      this.$emit('handleCancel')
    },
    handleAdd() {
      if (!this.loading) {
        this.loading = true
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            addRole(this.roleForm).then(result => {
              this.$notify({
                title: '操作成功',
                message: '角色添加成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.roleForm = {}
              this.$emit('handleAddRole')
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
