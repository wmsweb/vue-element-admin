<template>
  <div class="app-container">

    <!--绑定回车事件-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="书名"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <!--下拉框-->
      <el-select
        v-model="listQuery.category"
        placeholder="分类"
        class="filter-item"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <!--<el-option :value="1">11</el-option> -->
        <!--<el-option :value="2">22</el-option> -->
        <!--<el-option :value="3">33</el-option> -->

        <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.label" />

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
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left: 5px"
        @click="handleCreate"
      >新增</el-button>
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        style="margin-left: 5px"
        @click="changeShowCover"
      >
        显示封面</el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableList"
      border
      fit
      :default-sort="defaultSort"
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" />
      <el-table-column label="书名" align="center" width="150">
        <template slot-scope="{row:{titleWrapper}}"><span v-html="titleWrapper" /></template>
      </el-table-column>
      <el-table-column label="作者" align="center" width="150">
        <template slot-scope="{row:{author}}"><span>{{ author }}</span></template>
      </el-table-column>
      <el-table-column label="出版社" prop="publisher" width="150" align="center" />
      <el-table-column label="分类" prop="category" width="150" align="center" />
      <el-table-column label="语言" prop="language" align="center" />
      <el-table-column v-if="showCover" label="封面" width="150" align="center">
        <template slot-scope="{row:{cover}}">
          <a :href="cover" target="_blank">
            <img :src="cover" style="width: 120px;height: 180px">
          </a>
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="filename" width="100" align="center">
        <template slot-scope="{row:{filename}}"><span>{{ filename | valueFilter }}</span></template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="200" align="center">
        <template slot-scope="{row:{createTime}}"><span>{{ createTime | timeFilter }}</span></template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" style="color: #f56c6c" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 框架封装好的组件,底层用的也是element-ui -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="refresh"
    />
  </div>
</template>

<script>

import pagination from '@/components/Pagination'
import waves from '@/directive/waves/waves' // 指令,在按钮上点击有水波效果
import { getCategory, getTableList, deleteBook } from '@/api/book'
import { parseTime } from '@/utils'

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
      tableList: [],
      tableKey: 0, // 当有多个table的时候用来区分
      listLoading: true, // table 一直在加载效果
      listQuery: {}, // 查询条件
      showCover: false,
      categoryList: [], // 下拉列表
      total: 0,
      defaultSort: {}
    }
  },
  created() {
    this.parseQuery()
  },
  mounted() { // 绑定事件,页面加载好的时候执行
    this.getCategoryList()
    this.listBooks()
  },
  methods: {
    parseQuery() {
      const query = Object.assign({}, this.$route.query) // 优化
      let sort = '+id' // 默认用id升序排列
      const listQuery = {
        page: 1,
        pageSize: 10,
        sort // +代表升序 -代表降序 通过id字段升序排列
      }
      if (query) {
        // 字符串转数字
        query.page && (query.page = +query.page)
        query.pageSize && (query.pageSize = +query.pageSize)
        query.sort && (sort = query.sort)
      }
      const sortSymbol = sort[0]
      const sortColumn = sort.silce(1, sort.length)
      this.defaultSort = {
        prop: sortColumn,
        order: sortSymbol === '+' ? 'ascending' : 'descending'

      }
      this.listQuery = { ...listQuery, ...query } // 合并两个对象,如果有重复的字段,后面对象的字段覆盖前面对象的字段
    },
    handleUpdate(row) {
      this.$router.push(`/book/edit/${row.filename}`)
    },
    wrapperKeyword(k, v) {
      function highlight(value) {
        return `<span style="color: #1890ff">${value}</span>`
      }
      if (!this.listQuery[k]) {
        return v
      } else {
        return v.replace(new RegExp(this.listQuery[k], 'ig'), v => highlight(v))
      }
    },
    listBooks() {
      this.listLoading = true
      getTableList(this.listQuery).then(response => {
        console.log(response)
        const { list, count } = response.data
        this.total = count
        this.tableList = list
        this.listLoading = false
        this.tableList.forEach(row => {
          row.titleWrapper = this.wrapperKeyword('title', row.title)
          console.log(row.titleWrapper)
        })
      })
    },
    sortChange(data) {
      console.log('sort-change', data)
      const { prop, order } = data
      this.sortBy(prop, order)
      this.handleFilter()
    },
    sortBy(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
    },
    refresh() {
      this.$router.push({
        path: '/book/list',
        query: this.listQuery
      })
    },
    handleFilter() {
      console.log('handleFilter', this.listQuery)
      this.listQuery.page = 1
      this.refresh()
      // this.listBooks()
    },
    handleCreate() {
      this.$router.push('/book/create') // 页面跳转
    },
    changeShowCover(value) {
      this.showCover = value
    },
    getCategoryList() {
      getCategory().then(response => {
        console.log(response)
        this.categoryList = response.data
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除电子书,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBook(row.id).then(result => {
          const { code, message } = result
          if (code === 200) {
            this.$notify({
              title: '成功',
              message: message || '删除成功',
              type: 'success',
              duration: 2000
            })
            this.handleFilter()
          } else {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      })
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path === from.path) {
      const newQuery = Object.assign({}, to.query) // 浅拷贝对象
      const oldQuery = Object.assign({}, from.query)
      if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
        this.listBooks()
      }
    }
    next()
  }

}
</script>

<style>

</style>
