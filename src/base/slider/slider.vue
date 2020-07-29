<template>
  <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
          <slot>
          </slot>
      </div>
      <div class="dots">
          <span class="dot" v-for="(item,index) in dots" :class="{active : currentPageIndex === index}"></span>
      </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from 'assets/js/dom'
export default {
    data() {
        return {
            dots:[],
            currentPageIndex:0
        }
    },
    props:{
        loop:{//开启轮播
            type:Boolean,
            default:true
        },
        //自动轮播
        autoPlay:{
            type:Boolean,
            default:true
        },
        //轮播间隔
        interval:{
            type:Number,
            default:4000
        }

    },
    mounted(){
        //渲染延时
      setTimeout(() => {
          this._setSliderWidth()
          this._initDots()
          this._initSlider()
          if(this.autoPlay){
              this._play()
          }
      }, 20)//20ms，浏览器刷新是17ms一次，20比较合适
      window.addEventListener('resize',()=>{//窗口切换方法
          if(!this.slider){//如果slider还没有初始化
              return
          }
          this._setSliderWidth(true)
          this.slider.refresh()//重新计算
      })
    },
    methods:{
        //计算滚动宽度,需要得到宽度，才能进行滑动操作
        _setSliderWidth(isResize){
            this.children=this.$refs.sliderGroup.children //得到所有子元素,数组
            let width = 0 //sliderGroup的宽度
            let sliderWidth = this.$refs.slider.clientWidth //最外层的宽度
            for(let i=0;i<this.children.length;i++){
                let child = this.children[i];
                addClass(child,'slider-item')
                child.style.width=sliderWidth + 'px' //将每个child都等于他的父容器的宽度,bettersccroll需要子元素宽度总和超过父容器才能进行滚动
                width+=sliderWidth //sliderWidth的宽度就等于每个child的width的总和，也就是有多少次循环就加上多少个sliderwidth

            }
            if(this.loop && !isResize){//不能每次切换都加上左右两边的sliderWidth
                width +=2*sliderWidth //bettersocll如果是轮播效果，需要在左右各增加一个sliderWidth
            }
            this.$refs.sliderGroup.style.width= width + 'px' //把width的宽度赋给sliderGroup
        },
        //初始化slider
        _initSlider(){
            this.slider=new BScroll(this.$refs.slider,{
                scrollX:true, //X轴滑动
                scrollY:false,
                momentum:false, //当快速在屏幕上滑动一段距离的时候，会根据滑动的距离和时间计算出动量，并生成滚动动画
                snap:{
                    loop:this.loop,// true 是为了支持循环轮播
                    threshold:0.3,//threshold 表示可滚动到下一个的阈值
                    speed:400,//速度
                },
                bounce: false,
                stopPropagation: true,
                click:true

            })
            //圆点页码更改绑定事件
            this.slider.on('scrollEnd',()=>{
                let pageIndex = this.slider.getCurrentPage().pageX //将slider的第个子元素赋给PageIndex
                // if(this.loop){
                //     pageIndex-=1 //循环元素下默认会拷贝一个元素在最开始。所以要减一个
                // }
                //新版不需要这么判断
                this.currentPageIndex = pageIndex
                if(this.autoPlay){
                    this._play()
                }
            })
        },
        _initDots(){
            this.dots=new Array(this.children.length)//长度为children长度的空数组
        },
        _play(){
            clearTimeout(this.timer)//清理之前的timer
            this.timer = setTimeout(()=>{
                this.slider.next()//不用gotoPage
            },this.interval)
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
    .slider
        min-height :1px
        position:relative
        .slider-group
            position:relative
            overflow :hidden //属性规定当内容溢出元素框时发生的事情。 hidden内容会被修剪，并且其余内容是不可见的。
            white-space :nowrap //white-space 属性设置如何处理元素内的空白。文本不会换行，nowrap文本会在在同一行上继续，直到遇到 <br> 标签为止。
            .slider-item
                float:left
                box-sizing :border-box //box-sizing 属性允许您以特定的方式定义匹配某个区域的特定元素。 border-box 就是说，为元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制。
                overflow:hidden
                text-align :center
                img
                    display :block
                    width:100%
        .dots
            position :absolute
            right :0
            left :0
            bottom :12px
            text-align :center
            .dot
                display :inline-block
                margin:0 4px
                width:8px
                height :8px
                border-radius :50%
                background :$color-text-l
                &.active
                    border-radius :5px
                    background :$color-highlight-background
</style>