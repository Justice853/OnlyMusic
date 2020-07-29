<template>
  <div class="no-result">
      <div class="no-result-icon">
          <font-awesome-icon icon="music" class="fa"></font-awesome-icon>
      </div>
      <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:''
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
    .no-result
        text-align :center
        .no-result-icon
            color:$color-text-gg
            font-size:50px
        .no-result-text
            margin-top :30px
            font-size:$font-size-medium
            color:$color-text    
</style>