<template>
  <detail is-edit />
  <!-- <detail :is-edit='true' /> 属性绑定成true, 可以直接简写成-->
</template>

<script>

import Detail from './component/Detail'

export default {

  components: {
    detail: Detail
  }

}
</script>

<style>

</style>
