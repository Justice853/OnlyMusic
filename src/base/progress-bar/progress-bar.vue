<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
      <!-- 整个的长度 -->
      <div class="bar-inner">
          <!-- 走过的位置 -->
          <div class="progress" ref="progress"></div>
          <!-- 按钮 -->
          <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent = "progressTouchStart"
            @touchmove.prevent = "progressTouchMove"
            @touchend.prevent = "progressTouchEnd"
          >
              <div class="progress-btn"></div>
          </div>
      </div>
  </div>
</template>

<script>
const progressBtnWidth = 16
import {prefixStyle} from 'assets/js/dom'
const transform = prefixStyle('transform')
export default {
    props:{
        percent:{ //时间
            type:Number,
            default:0
        }
    },
    created(){
        this.touch={}//用于不同的回调函数共享数据
    },
    methods: {
        //按钮拖拽方法
        progressTouchStart(e){
            this.touch.initiated = true//touch初始化
            this.touch.startX = e.touches[0].pageX //点击的位置
            this.touch.left = this.$refs.progress.clientWidth //点击时进度条偏移位置


        },
        progressTouchMove(e){
            if(!this.touch.initiated)//如果没进Start，就直接返回
                {
                   return 
                }
            const deltaX = e.touches[0].pageX-this.touch.startX //移动位置减去开始位置可以获得偏移量
            const offsetWidth =Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0,this.touch.left+deltaX)) //偏移量加上偏移位置，且这个值不能小于0，且不能大于整体宽度
            this._offset(offsetWidth)
        },
        progressTouchEnd(){
            this.touch.initiated=false
            this._triggerPercent()
        },
        progressClick(e){
            const rect = this.$refs.progressBar.getBoundingClientRect()
            //bug!点击会回弹到开始
            // this._offset(e.offsetX)
            const offsetWidth = e.pageX-rect.left
            this._offset(offsetWidth)
            this._triggerPercent()
        },
        _offset(offsetWidth){
             this.$refs.progress.style.width=`${offsetWidth}px`
            this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`
        },
        _triggerPercent(){
             const barWidth=this.$refs.progressBar.clientWidth - progressBtnWidth //整个条的宽度减小球
             const percent = this.$refs.progress.clientWidth / barWidth //运动percent
             this.$emit('percentChange',percent)
        }
    },
    watch:{
        percent(newPercent){
            if(newPercent>=0 && !this.touch.initiated ){
                const barWidth=this.$refs.progressBar.clientWidth - progressBtnWidth //整个条的宽度减小球
                const offsetWidth =newPercent * barWidth //偏移宽度，比例乘所有宽度
                this._offset(offsetWidth)
            }
        }
    }
}
</script>

<style lang="stylus" scoped>

@import "~assets/stylus/variable"
.progress-bar
    height:30px
    .bar-inner
        position :relative
        top:13px
        height:4px
        background:rgba(0,0,0,0.3)
        .progress
            position :absolute
            height:100%
            background:$color-theme
        .progress-btn-wrapper
            position: absolute
            left: -8px
            top: -13px
            width: 30px
            height: 30px
            .progress-btn
                position: relative
                top: 7px
                left: 7px
                box-sizing: border-box
                width: 16px
                height: 16px
                border: 5px solid $color-theme-l
                border-radius: 50%
                background: $color-theme
</style>