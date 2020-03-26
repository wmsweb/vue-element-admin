<template>
  <div>
    <sticky :class-name="'sub-navbar'">
      <el-button
        v-if="addPermissionButton"
        v-loading="loading"
        type="success"
        style="margin-left: 10px"
        @click="submit"
      >添加根权限菜单
      </el-button>
    </sticky>

    <aside>
      <h3>权限管理</h3>
    </aside>

    <el-row>
      <el-col :span="10">
        <el-tree
          ref="permissionTree"
          :data="permissionData"
          :indent="32"
          node-key="id"
          :check-strictly="true"
          default-expand-all
          highlight-current
          :check-on-click-node="false"
          :expand-on-click-node="false"
          :props="defaultProps"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button v-if="addPermissionButton" type="text" size="mini" @click="() => append(data)">
                添加
              </el-button>
              <el-button v-if="updatePermissionButton" type="text" size="mini" @click="() => edit(node, data)">
                编辑
              </el-button>
              <el-button v-if="deletePermissionButton" type="text" size="mini" @click="() => remove(node, data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
    </el-row>
    <addPermission
      :dialog-form-visible="dialogFormVisible"
      :pid="pid"
      @handleCancel="handleCancel"
      @handleAdd="handleAdd"
    />
    <editPermission
      :dialog-edit-form-visible="dialogEditFormVisible"
      :permission-edit-form="permissionEditForm"
      @handleCancel="handleCancel"
      @handleEdit="handleEdit"
    />

  </div>
</template>
<script>
import { permissionTree, deletePermission } from '@/api/permission'
import Sticky from '@/components/Sticky/index'
import AddPermission from '@/views/user/AddPermission'
import EditPermission from '@/views/user/EditPermission'
import store from '@/store'

export default {

  components: {
    Sticky,
    AddPermission,
    EditPermission
  },

  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      permissionData: [],
      defaultProps: {
        children: 'children',
        label: 'description'
      },
      pid: 0,
      dialogEditFormVisible: false,
      permissionEditForm: {},
      addPermissionButton: store.getters.permissions.includes('permission:add'),
      updatePermissionButton: store.getters.permissions.includes('permission:update'),
      deletePermissionButton: store.getters.permissions.includes('permission:delete')

    }
  },
  mounted() {
    this.permissionTree()
  },
  methods: {
    submit() {
      this.dialogFormVisible = true
      this.pid = 0
    },
    handleAdd() {
      this.pid = 0
      this.dialogFormVisible = false
      this.permissionTree()
    },
    handleEdit() {
      this.pid = 0
      this.dialogEditFormVisible = false
      this.permissionTree()
    },
    handleCancel() {
      this.pid = 0
      this.dialogFormVisible = false
      this.dialogEditFormVisible = false
    },
    permissionTree() {
      permissionTree().then(result => {
        const { data } = result
        this.permissionData = data
      })
    },
    append(data) {
      this.dialogFormVisible = true
      this.pid = data.id
    },
    edit(node, data) {
      this.dialogEditFormVisible = true
      this.permissionEditForm = { ...data }
    },
    remove(node, data) {
      this.$confirm('删除权限将永久删除本权限及其子权限,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePermission(data.id).then(result => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.permissionTree()
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
    font-size: 18px;
    padding-right: 8px;
  }
.el-button--mini{
  font-size: 16px;
}
</style>
