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
      highlight-current-row
      style="width: 880px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" prop="id" align="center" width="100" />
      <el-table-column label="用户名称" prop="username" align="center" width="150">
        <template slot-scope="{row:{username}}"><span>{{ username }}</span></template>
      </el-table-column>
      <el-table-column label="用户角色" prop="roleName" align="center" width="150">
        <template slot-scope="{row:{roleName}}"><span>{{ roleName }}</span></template>
      </el-table-column>
      <el-table-column label="操作时间" prop="updateTime" width="200" align="center">
        <template slot-scope="{row:{updateTime}}"><span>{{ updateTime | timeFilter }}</span></template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            :autofocus="true"
            @click="handleEdit(row)"
          >编辑</el-button>
          <el-button
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
          <el-input v-model="userForm.password" autocomplete="off" clearable maxlength="25" />
        </el-form-item>
        <el-form-item label="角色: " prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理权限" value="admin" />
            <el-option label="查看权限" value="view" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button v-loading="loading" type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import pagination from '@/components/Pagination'
import waves from '@/directive/waves/waves' // 指令,在按钮上点击有水波效果
import { parseTime } from '@/utils'
import { listUser, addUser } from '@/api/user'

export default {
  components: {
    pagination
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
      userForm: {},
      loading: false,
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
    handleEdit() {
      // todo
    },
    handleDelete() {
      // todo
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
              this.dialogFormVisibleAdd = false
              this.handleFilter() // 刷新列表
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
