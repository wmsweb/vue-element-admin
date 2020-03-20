<template>
  <div>
    <div class="dashboard-editor-container" style="margin: 60px">

      <panel-group />

    </div>
    <div style="margin: 60px; padding: 20px; background-color: rgb(240, 242, 245);">
      <h3>临超期提醒</h3>
      <el-table
        :data="tableData"
        border
        stripe
        fit
        highlight-current-row
        size="medium"
        style="width: 100%"
      >

        <el-table-column
          prop="date"
          label="机构"
        />
        <el-table-column
          prop="name"
          label="停用时间"
        />
        <el-table-column
          prop="address"
          label="剩余天数"
        />

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <div style="margin: 60px; padding: 20px; background-color: rgb(240, 242, 245);">
      <h3>临超数提醒</h3>
      <el-table
        :data="tableNumData"
        border
        stripe
        fit
        size="medium"
        highlight-current-row
        style="width: 100%"
      >

        <el-table-column
          prop="date"
          label="机构"
        />
        <el-table-column
          prop="name"
          label="授权数量"
        />
        <el-table-column
          prop="address"
          label="剩余数量"
        />

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>

import PanelGroup from './components/PanelGroup'

export default {
  name: 'DashboardAdmin',
  components: {

    PanelGroup
  },
  data() {
    return {

      tableData: [
        {
          date: '北京便利蜂',
          name: '2019.02.02',
          address: '45'
        },
        {
          date: '北京便利蜂',
          name: '2019.02.02',
          address: '45'
        },
        {
          date: '北京便利蜂',
          name: '2019.02.02',
          address: '45'
        },
        {
          date: '北京便利蜂',
          name: '2019.02.02',
          address: '45'
        }
      ],
      tableNumData: [
        {
          date: '北京便利蜂',
          name: '100',
          address: '45'
        },
        {
          date: '北京便利蜂',
          name: '201',
          address: '45'
        },
        {
          date: '北京便利蜂',
          name: '201',
          address: '45'
        },
        {
          date: '北京便利蜂',
          name: '201',
          address: '45'
        }
      ]

    }
  },
  methods: {

    handleEdit(index, row) {
      console.log(index, row)
    }

  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
