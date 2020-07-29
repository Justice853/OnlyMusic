<template>
  <div class="loading">
      <img src="./loading.gif" width="24" height="24">
     <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:'正在载入'
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
.loading
    width:100%
    height :40px
    text-align :center
    img
        margin-top:10px
    .desc
        line-height :20px
        font-size:$font-size-small
        color:$color-text-l

</style>