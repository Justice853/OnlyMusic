<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
    props:{
        // 有时候我们需要知道滚动的位置。
        // 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
        // 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
        // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
        probeType:{
            type:Number,
            default:1
        },
        //是否手动派发点击事件
        click:{
            type:Boolean,
            default:true
        },
        //数据
        data:{
            type:Array,
            default:null
        },
        ListenScroll:{//开启监听位置
            type:Boolean,
            default:false
        },
        pullup:{
            type:Boolean,
            default:false
        }
    },
    mounted(){
        setTimeout(()=>{
            this._initScroll()
        },20)
    },
    methods:{
        _initScroll(){
            if(!this.$refs.wrapper){
                return
            }
            this.scroll = new BScroll(this.$refs.wrapper,{
                probeType:this.probeType,
                click:this.click
            })

            if(this.ListenScroll){
                let me = this
                this.scroll.on('scroll',(pos)=>{//监听scroll的滚动事件,pos是位置
                    me.$emit('scroll',pos)// $emit 触发父组件的自定义事件。
                })
            }
            if (this.pullup) {
                this.scroll.on('scrollEnd', () => {
                if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                    this.$emit('scrollToEnd')
                }
                })
             }
        },
        enable(){//启用
            this.scroll && this.scroll.enable()
            },
        disable(){//不启用
            this.scroll && this.scroll.disable()
        },
        refresh(){//刷新
            this.scroll && this.scroll.refresh()
        },
        scrollTo () { //滚动到指定的位置，见 Demo 。
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments) //使用特殊对象 arguments，开发者无需明确指出参数名，就能访问它们。
        },
        scrollToElement () { //滚动到指定的目标元素。
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        }
    },
    watch:{
        data(){//data变化了，需要重新计算SCROLL
            setTimeout(()=>{
            this.refresh()
        },20)
        }
    }
}
</script>

<style>

</style>