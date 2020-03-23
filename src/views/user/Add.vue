<template>
  <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
    <el-form
      ref="userForm"
      :model="userForm"
      :rules="rules"
      :hide-required-asterisk="false"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="用户名: " style="width: 400px" prop="username">
        <el-input v-model="userForm.username" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="密码: " style="width: 400px" prop="password">
        <el-input v-model="userForm.password" autocomplete="off" clearable maxlength="25" show-password />
      </el-form-item>
      <el-form-item label="角色: " prop="roleName">
        <el-select v-model="userForm.roleId" placeholder="请选择角色">
          <el-option v-for="item in roleList" :key="item.id" :label="item.description" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="handleAdd">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { addUser } from '@/api/user'
import { getRoles } from '@/api/role'

export default {
  props: {
    dialogFormVisibleAdd: Boolean
  },

  data() {
    return {
      loading: false,
      userForm: {},
      roleList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }

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
    handleAdd() {
      if (!this.loading) {
        this.loading = true
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            addUser(this.userForm).then(result => {
              this.$notify({
                title: '操作成功',
                message: '用户添加成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$emit('handleAddUser')
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
