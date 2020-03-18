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
        icon="el-icon-delete"
        style="margin-left: 10px"
        @click="handleClear"
      >重置</el-button>
    </div>
    <div>
      <el-button
        v-waves
        plain
        class="filter-item"
        type="success"
        icon="el-icon-document-add"
        style="margin-left: 10px"
        @click="handleAdd"
      >添加</el-button>
      <el-button
        v-waves
        plain
        class="filter-item"
        type="success"
        icon="el-icon-refresh"
        style="margin-left: 10px"
        :loading="true"
        @click="handleSync"
      >手动同步</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" prop="id" align="center" width="100" />
      <el-table-column label="机构名称" align="center" width="150">
        <template slot-scope="{row:{name}}"><span>{{ name }}</span></template>
      </el-table-column>
      <el-table-column label="业务类别" align="center" width="150">
        <template slot-scope="{row:{category}}"><span>{{ category }}</span></template>
      </el-table-column>
      <el-table-column label="机构状态" align="center" width="150">
        <template slot-scope="{row:{state}}"><span>{{ state }}</span></template>
      </el-table-column>
      <el-table-column label="操作人" align="center" width="150">
        <template slot-scope="{row:{updaterName}}"><span>{{ updaterName }}</span></template>
      </el-table-column>
      <!-- <el-table-column label="授权数量" align="center" width="150">
        <template slot-scope="{row:{authorizedNum}}"><span>{{ authorizedNum }}</span></template>
      </el-table-column>
      <el-table-column label="有效期" align="center" width="150">
        <template slot-scope="{row:{expirationDate}}"><span>{{ expirationDate }}</span></template>
      </el-table-column>
      <el-table-column label="启用时间" prop="startTime" width="200" align="center">
        <template slot-scope="{row:{startTime}}"><span>{{ startTime | timeFilter }}</span></template>
      </el-table-column>
      <el-table-column label="停用时间" prop="endTime" width="200" align="center">
        <template slot-scope="{row:{endTime}}"><span>{{ endTime | timeFilter }}</span></template>
      </el-table-column>
      <el-table-column label="同步状态" align="center" width="150">
        <template slot-scope="{row:{syncState}}"><span>{{ syncState }}</span></template>
      </el-table-column> -->
      <el-table-column label="操作时间" prop="updateTime" width="200" align="center">
        <template slot-scope="{row:{updateTime}}"><span>{{ updateTime | timeFilter }}</span></template>
      </el-table-column>
      <el-table-column label="同步状态" prop="syncState" width="200" align="center">
        <template slot-scope="{row:{syncState}}"><span>{{ syncState }}</span></template>
      </el-table-column>
      <el-table-column label="同步时间" prop="syncTime" width="200" align="center">
        <template slot-scope="{row:{syncTime}}"><span>{{ syncTime | timeFilter }}</span></template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" icon="el-icon-setting" @click="setReminder(row)">设置提醒</el-button>
          <el-button type="text" icon="el-icon-more-outline" @click="viewDetail(row)">查看明细</el-button>
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
import { listInstitution } from '@/api/institution'

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
    }
  },
  data() {
    return {
      listQuery: {}, // 查询条件
      tableKey: 0, // table识别用
      listLoading: true, // 默认加载
      tableList: [], // 表单数据
      total: 0 // 默认总条数

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
    setReminder() { // 设置提醒
      // TODO
    },
    viewDetail() { // 查看明细
      // TODO
    }
  }
}
</script>

<style lang="css" scoped>
</style>
