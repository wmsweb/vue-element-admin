<template>
  <div class="app-container">

    <aside>
      <h3>用户列表</h3>
    </aside>

    <!--绑定回车事件-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="用户名称"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-thumb"
        style="margin-left: 10px"
        @click="handleClear"
      >重置</el-button>
      <el-button
        v-if="addUserButton"
        v-waves
        class="filter-item"
        type="success"
        icon="el-icon-user-solid"
        style="margin-left: 40px"
        @click="dialogFormVisibleAdd = true"
      >添加用户</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableList"
      border
      fit
      stripe
      size="medium"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column label="ID" prop="id" align="center" />
      <el-table-column label="用户名称" prop="username" align="center">
        <template slot-scope="{row:{username}}"><span>{{ username }}</span></template>
      </el-table-column>
      <el-table-column label="用户角色" prop="alias" align="center">
        <template slot-scope="{row:{alias}}"><span>{{ alias }}</span></template>
      </el-table-column>
      <el-table-column label="操作时间" prop="updateTime" align="center">
        <template slot-scope="{row:{updateTime}}"><span>{{ updateTime | timeFilter }}</span></template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="{row}">
          <el-button
            v-if="updateUserButton"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            :autofocus="true"
            @click="handleUpdate(row)"
          >编辑</el-button>
          <el-button
            v-if="deleteUserButton"
            style="margin-left: 30px;"
            size="mini"
            icon="el-icon-delete"
            type="danger"
            :autofocus="true"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 框架封装好的组件,底层用的也是element-ui -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="handleFilter"
    />

    <AddUser
      :dialog-form-visible-add="dialogFormVisibleAdd"
      @handleAddUser="handleAddUser"
      @handleCancel="handleCancel"
    />

    <UpdateUser
      :dialog-form-visible-edit="dialogFormVisibleEdit"
      :user-form="updateUserForm"
      @handleUpdateUser="handleUpdateUser"
      @handleCancel="handleCancel"
    />

  </div>
</template>

<script>

import pagination from '@/components/Pagination'
import waves from '@/directive/waves/waves' // 指令,在按钮上点击有水波效果
import { parseTime } from '@/utils'
import { listUser, deleteUser, getUser } from '@/api/user'
import AddUser from '@/views/user/Add'
import UpdateUser from '@/views/user/Edit'
import store from '@/store'

export default {
  components: {
    pagination,
    AddUser,
    UpdateUser
  },
  filters: {
    timeFilter(value) {
      return value ? parseTime(value, '{y}-{m}-{d} {h}:{i}') : '/'
    }
  },
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      listQuery: {},
      tableList: [],
      multipleSelection: [],
      total: 0,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      updateUserForm: {},
      addUserButton: store.getters.permissions.includes('user:add'),
      deleteUserButton: store.getters.permissions.includes('user:delete'),
      updateUserButton: store.getters.permissions.includes('user:update')

    }
  },
  mounted() { // 绑定事件,页面加载好的时候执行
    this.handleFilter()
  },
  methods: {
    handleFilter() {
      console.log('handleFilter')
      const query = {
        page: 1,
        pageSize: 10
      }
      this.listQuery = { ...query, ...this.listQuery }
      listUser(this.listQuery).then(result => {
        const { list, total } = result.data
        this.total = total
        this.tableList = list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleClear() {
      this.listQuery = {}
    },
    handleSelectionChange(val) { // 表单选中
      this.multipleSelection = val
      console.log(this.multipleSelection[0].name)
    },
    handleUpdate(row) {
      getUser(row.id).then(result => {
        const { data } = result
        this.updateUserForm = data
        this.dialogFormVisibleEdit = true
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除用户,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('userId', row.id)
        deleteUser(row.id).then(result => {
          const { code, message } = result
          if (code === 200) {
            this.$notify({
              title: '成功',
              message: message || '删除用户成功',
              type: 'success',
              duration: 2000
            })
            this.handleFilter()
          } else {
            this.$notify({
              title: '失败',
              message: '删除用户失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      })
    },
    handleCancel() {
      this.dialogFormVisibleAdd = false
      this.dialogFormVisibleEdit = false
    },
    handleAddUser() {
      console.log('handleAddUser')
      this.dialogFormVisibleAdd = false
      this.handleFilter()
    },
    handleUpdateUser() {
      console.log('handleUpdateUser')
      this.dialogFormVisibleEdit = false
      this.handleFilter()
    }
  }
}
</script>

<style lang="css" scoped>
</style>
