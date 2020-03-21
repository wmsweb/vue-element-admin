<template>
  <el-tree
    ref="tree"
    :data="data"
    show-checkbox
    node-key="id"
    default-expand-all
    highlight-current
    :props="defaultProps"
  />
</template>

<script>

import { permissionTree } from '@/api/permission'

export default {

  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'description'
      }

    }
  },
  mounted() {
    this.permissionTree()
  },
  methods: {
    permissionTree() {
      permissionTree().then(result => {
        const { data } = result
        this.data = data
      })
    }
  }
}
</script>

<style lang="css" scoped>

</style>
