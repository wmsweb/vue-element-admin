<template>
  <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit" :before-close="handleCancel">
    <el-form
      ref="userForm"
      :model="userForm"
      :rules="rules"
      :hide-required-asterisk="false"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="ID: " style="width: 400px" prop="id">
        <el-input v-model="userForm.id" autocomplete="off" disabled clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="用户名: " style="width: 400px" prop="username">
        <el-input v-model="userForm.username" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="密码: " style="width: 400px" prop="password">
        <el-input v-model="userForm.password" autocomplete="off" clearable maxlength="25" show-password />
      </el-form-item>
      <el-form-item label="角色: " prop="roleId">
        <el-select v-model="userForm.roleId" placeholder="请选择角色">
          <el-option v-for="item in roleList" :key="item.id" :label="item.description" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="handleUpdate">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { updateUser } from '@/api/user'
import { getRoles } from '@/api/role'

export default {

  props: {
    dialogFormVisibleEdit: {
      type: Boolean,
      default: false
    },
    userForm: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      loading: false,
      roleList: []
    }
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    getRoles() {
      getRoles().then(result => {
        const { data } = result
        this.roleList = data
      })
    },
    handleCancel() {
      this.$emit('handleCancel')
    },
    handleUpdate() {
      if (!this.loading) {
        this.loading = true
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            updateUser(this.userForm).then(result => {
              this.$notify({
                title: '操作成功',
                message: '用户编辑成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.dialogFormVisibleEidt = false
              this.$emit('handleUpdateUser')
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
