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
            <el-button
              v-if="scope.row.name !== 'admin' "
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.name !== 'admin' "
              type="danger"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
            <el-button size="mini" type="success" @click="handleRolePermission(scope.row)">设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <addRole :dialog-form-visible="dialogFormVisible" @handleAddRole="handleAddRole" @handleCancel="handleCancel" />
    <editRole
      :dialog-edit-form-visible="dialogEditFormVisible"
      :editRoleForm="editRoleForm"
      @handleEditRole="handleEditRole"
      @handleCancel="handleCancel"
    />

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
import EditRole from '@/views/user/EditRole'
import RolePermission from '@/views/user/RolePermission'
import { getRoles, deleteRole } from '@/api/role'

export default {

  components: {
    Sticky,
    AddRole,
    EditRole,
    rolePermission: RolePermission
  },

  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      dialogTreeVisible: false,
      tableData: [],
      checkedKeys: [],
      roleId: 0,
      dialogEditFormVisible: false,
      editRoleForm: {}
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
    handleEditRole() {
      this.dialogEditFormVisible = false
      this.getRoles()
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.dialogTreeVisible = false
      this.dialogEditFormVisible = false
    },
    handleEdit(row) {
      this.dialogEditFormVisible = true
      this.editRoleForm = {
        id: row.id,
        name: row.name,
        alias: row.description
      }
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除角色,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.id).then(result => {
          this.$message({
            message: '角色删除成功',
            type: 'success'
          })
          this.getRoles()
        })
      })
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
