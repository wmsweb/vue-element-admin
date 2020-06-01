<template>

  <div class="app-container">

    <aside>
      <h3>授权列表</h3>
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
        icon="el-icon-delete"
        style="margin-left: 10px"
        @click="handleClear"
      >重置</el-button>
    </div>
    <div class="middle-button">

      <el-button
        v-waves
        v-loading="syncLoading"
        class="filter-item"
        type="success"
        icon="el-icon-refresh"
        style="margin-left: 10px"
        @click="handleSync"
      >手动同步</el-button>
      <el-button
        v-if="addAuthorizationButton"
        v-waves
        class="filter-item"
        type="success"
        icon="el-icon-document-add"
        style="margin-left: 10px"
        @click="addAuthorization"
      >添加授权</el-button>
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
    >
      <el-table-column label="ID" prop="id" align="center" />
      <el-table-column label="机构名称" align="center">
        <template slot-scope="{row:{name}}">
          <span>{{ name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="机构状态" align="center">
        <template slot-scope="{row:{state}}"><span>{{ state | stateFilter }}</span></template>
      </el-table-column>
      <el-table-column label="授权数量" align="center">
        <template slot-scope="{row:{authorizedNum}}"><span>{{ authorizedNum }}</span></template>
      </el-table-column>
      <el-table-column label="有效期" align="center">
        <template slot-scope="{row:{expirationDate}}"><span>{{ expirationDate }}</span></template>
      </el-table-column>
      <el-table-column label="启用时间" prop="startTime" align="center">
        <template slot-scope="{row:{startTime}}"><span>{{ startTime | timeFilter }}</span></template>
      </el-table-column>
      <el-table-column label="停用时间" prop="endTime" align="center">
        <template slot-scope="{row:{endTime}}"><span>{{ endTime | timeFilter }}</span></template>
      </el-table-column>
      <el-table-column label="同步状态" align="center">
        <template slot-scope="{row:{syncState}}"><span>{{ syncState | syncStateFilter }}</span></template>
      </el-table-column> -->
      <el-table-column label="操作时间" prop="updateTime" align="center">
        <template slot-scope="{row:{updateTime}}"><span>{{ updateTime | timeFilter }}</span></template>
      </el-table-column>
      <el-table-column label="同步时间" prop="syncTime" align="center">
        <template slot-scope="{row:{syncTime}}"><span>{{ syncTime | timeFilter }}</span></template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template slot-scope="{row}">
          <el-button v-if="remindAuthorizationButton" type="text" icon="el-icon-setting" @click="setReminder(row)">
            设置提醒
          </el-button>
          <el-button v-if="ordersAuthorizationButton" type="text" icon="el-icon-more-outline" @click="viewDetail(row)">
            查看明细
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
    <!-- 添加授权 -->
    <add
      :dialog-form-visible="dialogFormVisible"
      @handleCancel="handleCancel"
      @handleAdd="handleAdd"
    />
    <!-- 添加授权 -->

    <!-- 添加提醒 -->
    <remind
      :dialog-remind-visible="dialogRemindVisible"
      :remind-institution-name="remindInstitutionName"
      @handleCancel="handleCancel"
    />
    <!-- 添加提醒 -->

    <!-- 授权明细 -->
    <Details
      :dialog-detail-visible="dialogDetailVisible"
      :detail-data="detailData"
      @handleCancel="handleCancel"
    />
    <!-- 授权明细 -->

  </div>

</template>

<script>

import pagination from '@/components/Pagination'
import waves from '@/directive/waves/waves' // 指令,在按钮上点击有水波效果
import { parseTime } from '@/utils'
import { listAuthorization, authorizationOrderDetails } from '@/api/authorization'
import Add from '@/views/authorization/Add'
import Remind from '@/views/authorization/Remind'
import Details from '@/views/authorization/Details'
import store from '@/store'

export default {
  components: {

    pagination,
    Add,
    Remind,
    Details
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
      if (value === 'ENABLED') {
        return '启用'
      }
      if (value === 'DISABLED') {
        return '停用'
      }
    },
    syncStateFilter(value) {
      if (value === 1) {
        return '已同步'
      }
      if (value === 0) {
        return '未同步'
      }
    }
  },
  data() {
    return {
      listQuery: {}, // 查询条件
      tableKey: 0, // table识别用
      listLoading: true, // 默认加载
      syncLoading: false, // 手动同步
      tableList: [], // 表单数据
      total: 0, // 默认总条数
      dialogFormVisible: false,
      dialogRemindVisible: false,
      remindInstitutionName: '',
      dialogDetailVisible: false,
      detailData: {},
      addAuthorizationButton: store.getters.permissions.includes('authorization:add'),
      remindAuthorizationButton: store.getters.permissions.includes('authorization:remind'),
      ordersAuthorizationButton: store.getters.permissions.includes('authorization:orders')

    }
  },
  created() { // vue 声明周期函数
    this.parseQuery()
  },
  mounted() { // 绑定事件,页面加载好的时候执行
    this.handleFilter()
  },
  methods: {
    addAuthorization() {
      this.dialogFormVisible = true
    },
    parseQuery() { // 设置默认的查询参数
      const listQuery = {
        page: 1,
        pageSize: 10
      }

      this.listQuery = { ...listQuery, ...this.listQuery }
    },
    handleFilter() { // 查询
      listAuthorization(this.listQuery).then(result => {
        const { total, list } = result.data
        this.total = total
        this.tableList = list
        this.listLoading = false
      })
    },
    handleClear() { // 重置查询条件
      this.listQuery = {}
      this.parseQuery()
    },
    setReminder(row) { // 设置提醒
      // TODO
      this.dialogRemindVisible = true
      this.remindInstitutionName = row.name
    },
    viewDetail(row) { // 查看明细
      // TODO
      const params = {
        id: row.id
      }
      authorizationOrderDetails(params).then(result => {
        const { data } = result
        this.dialogDetailVisible = true
        this.detailData = data
      })
    },
    handleSync() {
      if (!this.syncLoading) {
        this.$confirm('此操作将同步机构信息,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.syncLoading = true
        }).catch(() => {
          this.syncLoading = false
        })
      }
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.dialogRemindVisible = false
      this.dialogDetailVisible = false
    },
    handleAdd() {
      this.handleCancel()
      this.handleFilter()
    }

  }
}
</script>

<style lang="css" scoped>

.middle-button {
  padding: 0px 10px 20px 10px
}

</style>
