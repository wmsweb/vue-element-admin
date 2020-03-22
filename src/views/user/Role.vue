<template>
  <div>
    <sticky :class-name="'sub-navbar'">
      <el-button v-loading="loading" type="success" style="margin-left: 10px" @click="dialogFormVisible = true">
        添加新角色
      </el-button>
    </sticky>
    <aside>
      <h3>角色管理</h3>
    </aside>
    <div style="margin: 40px;padding: 40px">
      <el-table :data="tableData" border stripe size="medium" highlight-current-row style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="KEY" />
        <el-table-column prop="description" label="名称" />
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="success" @click="handleRolePermission(scope.row)">设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <addRole :dialog-form-visible="dialogFormVisible" @handleAddRole="handleAddRole" @handleCancel="handleCancel" />

    <rolePermission
      :checked-keys="checkedKeys"
      :role-id="roleId"
      :dialog-tree-visible="dialogTreeVisible"
      @handleCancel="handleCancel"
    />
  </div>
</template>
<script>
import { rolePermission } from '@/api/permission'
import Sticky from '@/components/Sticky/index'
import AddRole from '@/views/user/AddRole'
import RolePermission from '@/views/user/RolePermission'
import { getRoles } from '@/api/role'

export default {

  components: {
    Sticky,
    AddRole,
    rolePermission: RolePermission
  },

  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      dialogTreeVisible: false,
      tableData: [],
      checkedKeys: [],
      roleId: 0
    }
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    handleRolePermission(row) {
      this.dialogTreeVisible = true
      this.roleId = row.id
      rolePermission(this.roleId).then(result => {
        const { data } = result
        this.checkedKeys = data
      })
    },
    getRoles() {
      getRoles().then(result => {
        const { data } = result
        this.tableData = data
      })
    },
    handleAddRole() {
      this.dialogFormVisible = false
      this.getRoles()
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.dialogTreeVisible = false
    },
    handleEdit(index, row) {
      // todo
    },
    handleDelete(index, row) {
      // todo
    }
  }
}

</script>
<style lang="css" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-table__body tr.current-row>td {
  background: red;
}

</style>
