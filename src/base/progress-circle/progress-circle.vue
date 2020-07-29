<template>
  <div class="progress-circle">
      <!-- viewBox整体大小和位置 -->
      <svg :width="redius" :height="redius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <!-- svg是使用 XML 来描述二维图形和绘图程序的语言。  -->
        <!-- 外层⚪,r半径,cx，cy圆心坐标 -->
        <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
        <!-- 内层⚪ -->
        <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" 
         :stroke-dasharray="dashArrey" :stroke-dashoffset="dashOffset"      />
         <!-- 描边距离，描边偏移 -->
      </svg> 
      <slot></slot>
  </div>
</template>

<script>
export default {
    props:{
        redius:{
            type:Number,
            default:100
        },
        percent:{
            type:Number,
            default:0
        }
    },
    data() {
        return {
            dashArrey:Math.PI*100
        }
    },
    computed:{
        dashOffset(){
            return (1-this.percent) * this.dashArrey
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"

.progress-circle
    position :relative
    circle
        stroke-width :8px //Stroke属性定义一条线，文本或元素轮廓颜色
        transform-origin :center //设置旋转元素的基点位置
        &.progress-background
            transform:scale(0.9) //缩放，确保是个园
            stroke:$color-theme-d
        &.progress-bar
            transform:scale(0.9) rotate(-90deg)
            stroke:$color-highlight-background
</style>