<template>

  <div class="app-container">

    <aside>
      <h3>机构列表</h3>
    </aside>

    <!--绑定回车事件-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="机构名称"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <!--下拉框-->
      <el-select
        v-model="listQuery.state"
        placeholder="机构状态"
        class="filter-item"
        style="margin-left: 10px"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option value="ENABLED" label="启用">启用</el-option>
        <el-option value="DISABLED" label="停用">停用</el-option>
      </el-select>
      <el-select
        v-model="listQuery.category"
        placeholder="业务类别"
        class="filter-item"
        style="margin-left: 10px"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option value="CMS" label="信发系统">信发系统</el-option>
        <el-option value="JEEGY" label="价签系统">价签系统</el-option>
      </el-select>
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
    </div>
    <div class="middle-button">
      <el-button
        v-if="addInstitutionButton"
        v-waves
        plain
        class="filter-item"
        type="success"
        icon="el-icon-document-add"
        style="margin-left: 10px"
        @click="handleAdd"
      >添加</el-button>
      <el-button
        v-if="syncInstitutionButton"
        v-waves
        plain
        class="filter-item"
        type="success"
        icon="el-icon-refresh"
        style="margin-left: 10px"
        :loading="syncLoading"
        @click="handleSync"
      >手动同步</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableList"
      border
      fit
      size="medium"
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" prop="id" align="center" width="100" />
      <el-table-column label="机构名称" prop="name" align="center" width="150">
        <template slot-scope="{row:{name}}"><span>{{ name }}</span></template>
      </el-table-column>
      <el-table-column label="业务类别" prop="category" align="center" width="150">
        <template slot-scope="{row:{category}}"><span>{{ category }}</span></template>
      </el-table-column>
      <el-table-column label="机构状态" prop="state" align="center" width="150">
        <template slot-scope="{row:{state}}"><span>{{ state | stateFilter }}</span></template>
      </el-table-column>
      <el-table-column label="操作人" prop="updateName" align="center" width="150">
        <template slot-scope="{row:{updateName}}"><span>{{ updateName }}</span></template>
      </el-table-column>
      <el-table-column label="操作时间" prop="updateTime" width="200" align="center">
        <template slot-scope="{row:{updateTime}}"><span>{{ updateTime | timeFilter }}</span></template>
      </el-table-column>
      <el-table-column label="同步状态" prop="syncState" width="200" align="center">
        <template slot-scope="{row:{syncState}}"><span>{{ syncState | syncStateFilter }}</span></template>
      </el-table-column>
      <el-table-column label="同步时间" prop="syncTime" width="200" align="center">
        <template slot-scope="{row:{syncTime}}"><span>{{ syncTime | timeFilter }}</span></template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template slot-scope="{row}">
          <el-button v-if="updateInstitutionButton" type="text" icon="el-icon-edit" :autofocus="true" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button v-if="deleteInstitutionButton" type="text" icon="el-icon-delete" style="color: #f56c6c" :autofocus="true" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button v-if="stopInstitutionButton" type="text" icon="el-icon-switch-button" style="color: green" :autofocus="true" @click="handleStop(row)">
            停用
          </el-button>
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
  </div>

</template>

<script>

import pagination from '@/components/Pagination'
import waves from '@/directive/waves/waves' // 指令,在按钮上点击有水波效果
import { parseTime } from '@/utils'
import { listInstitution, deleteInstitution, stopInstitution, syncInstitution } from '@/api/institution'
import store from '@/store'

export default {
  components: {

    pagination
  },
  directives: {
    waves
  },
  filters: {
    valueFilter(value) {
      return value || '/'
    },
    timeFilter(value) {
      return value ? parseTime(value, '{y}-{m}-{d} {h}:{i}') : '/'
    },
    stateFilter(value) {
      return value === 'ENABLED' ? '启用' : '停用'
    },
    syncStateFilter(value) {
      return value === 1 ? '同步成功' : '同步失败'
    }
  },
  data() {
    return {
      listQuery: {}, // 查询条件
      tableKey: 0, // table识别用
      listLoading: true, // 默认加载
      syncLoading: false, // 手动同步
      tableList: [], // 表单数据
      multipleSelection: [], // 被选中表单
      total: 0, // 默认总条数
      updateInstitutionButton: store.getters.permissions.includes('institution:update'),
      deleteInstitutionButton: store.getters.permissions.includes('institution:delete'),
      stopInstitutionButton: store.getters.permissions.includes('institution:stop'),
      syncInstitutionButton: store.getters.permissions.includes('institution:sync'),
      addInstitutionButton: store.getters.permissions.includes('institution:add')

    }
  },
  created() { // vue 声明周期函数
    this.parseQuery()
  },
  mounted() { // 绑定事件,页面加载好的时候执行
    this.handleFilter()
  },
  methods: {
    parseQuery() { // 设置默认的查询参数
      const listQuery = {
        page: 1,
        pageSize: 10
      }

      this.listQuery = { ...listQuery, ...this.listQuery }
    },
    handleFilter() { // 查询
      listInstitution(this.listQuery).then(result => {
        const { total, records } = result.data
        this.total = total
        this.tableList = records
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleClear() { // 重置查询条件
      this.listQuery = {}
      this.parseQuery()
    },
    handleAdd() { // 添加
      this.$router.push('/institution/add')
    },
    handleSync() { // 同步
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选中要同步的机构',
          type: 'error'
        })
        return
      }
      this.$confirm('是否重新同步授权信息到业务系统？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => {
          return item['id']
        })
        syncInstitution(ids).then(result => {
          this.$message({
            message: '同步成功',
            type: 'success'
          })
          this.handleFilter()
        })
      })
    },
    handleEdit(row) { // 编辑
      this.$router.push(`/institution/edit/${row.id}`)
    },
    handleDelete(row) { // 删除
      this.$confirm('此操作将删除机构,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInstitution(row.id).then(result => {
          this.$message({
            message: '机构删除成功',
            type: 'success'
          })
          this.handleFilter()
        })
      })
    },
    handleStop(row) { // 停用
      this.$confirm('此操作将停用机构,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stopInstitution(row.id).then(result => {
          this.$message({
            message: '机构停用成功',
            type: 'success'
          })
          this.handleFilter()
        })
      })
    },
    handleSelectionChange(val) { // 表单选中
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="css" scoped>

.middle-button {
  padding: 0px 10px 20px 10px
}
</style>
