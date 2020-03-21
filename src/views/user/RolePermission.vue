<template>

  <el-dialog title="角色设置权限" :visible.sync="dialogTreeVisible" :before-close="handleClose">

    <el-tree
      ref="permissionTree"
      :data="permissionData"
      show-checkbox
      node-key="id"
      :check-strictly="true"
      default-expand-all
      highlight-current
      :props="defaultProps"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="handleAdd">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { permissionTree, addRolePermission } from '@/api/permission'

export default {
  name: 'RolePermission',
  props: {
    roleId: Number,
    dialogTreeVisible: Boolean,
    checkedKeys: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      permissionData: [],
      defaultProps: {
        children: 'children',
        label: 'description'
      }

    }
  },
  watch: {
    checkedKeys() {
      this.handleCheckedKeys()
    }
  },
  mounted() {
    this.permissionTree()
  },
  methods: {
    permissionTree() {
      permissionTree().then(result => {
        const { data } = result
        this.permissionData = data
      })
    },
    handleCheckedKeys() {
      this.$refs.permissionTree.setCheckedKeys(this.checkedKeys)
    },
    handleCancel() {
      this.$emit('handleCancel')
    },
    handleClose() {
      this.$emit('handleCancel')
    },
    handleAdd() {
      this.$confirm('此操作将重置该角色的所有权限,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submit()
      })
    },
    submit() {
      this.loading = true
      const roleId = this.roleId
      const permissionIds = this.$refs.permissionTree.getCheckedKeys()
      const data = {
        roleId,
        permissionIds
      }
      addRolePermission(data).then(result => {
        this.loading = false
        this.$alert('权限设置成功', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$emit('handleCancel')
          }

        })
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
