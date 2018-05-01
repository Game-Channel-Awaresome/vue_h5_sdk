<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

html,body {
  background-color: #fbf9fe;
  height: 100%;
  overflow: hidden;
  #app{
  	height: 100%;
  	overflow: hidden;
  }
}
</style>
