<template>
  <div>
    <sticky :class-name="'sub-navbar'">
      <el-button v-loading="loading" type="success" style="margin-left: 10px" @click="submit">添加根权限菜单</el-button>
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
              <el-button type="text" size="mini" @click="() => append(data)">
                添加
              </el-button>
              <el-button type="text" size="mini" @click="() => edit(node, data)">
                编辑
              </el-button>
              <el-button type="text" size="mini" @click="() => remove(node, data)">
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

  </div>
</template>
<script>
import { permissionTree } from '@/api/permission'
import Sticky from '@/components/Sticky/index'
import AddPermission from '@/views/user/AddPermission'
export default {

  components: {
    Sticky,
    AddPermission
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
      pid: 0

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
    handleCancel() {
      this.pid = 0
      this.dialogFormVisible = false
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
      // const newChild = { id: id++, label: 'testtest', children: [] }
      // if (!data.children) {
      //   this.$set(data, 'children', [])
      // }
      // data.children.push(newChild)
    },
    edit(node, data) {
      // console.log(node, data)
    },
    remove(node, data) {
      // const parent = node.parent
      // const children = parent.data.children || parent.data
      // const index = children.findIndex(d => d.id === data.id)
      // children.splice(index, 1)
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
