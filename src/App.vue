<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<style lang="scss">
  body{
    background-color: #fff;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;;
  }

  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .clearfix::after{
    content: "";
    display: block;
    clear: both;
  }
  auto-img{
    width: 100%;
    display: block;
  }
  .auto-text{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
