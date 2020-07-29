<template>
  <scroll class="listview" 
  :data="data" 
  ref="listview" 
  :probeType="probeType"
  :ListenScroll="listenScroll"
  @scroll="scroll">
  <!-- 监听滚动事件-->
      <ul>
          <li v-for="group in data" :key="group.id" class="list-group" ref="listGroup">
              <h2 class="list-group-title">{{group.title}}</h2>
              <ul>
                  <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.id">
                      <img v-lazy="item.avatar" class="avatar">
                      <span class="name">{{item.name}}</span>
                  </li>
              </ul>
          </li>
      </ul>
      <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
          <ul>
              <li v-for="(item,index) in shortcutList" 
              :data-index="index" 
              :key="index" 
              class="item"
              :class="{'current':currentIndex===index}">
                  {{item}}
              </li>
          </ul>
      </div>
      <!-- <div class="list-fixed" v-show="fixedTitle"  ref="fixedTop">
          <h1 class="fixed-title">{{fixedTitle}}</h1>
      </div> -->
      <div v-show="!data.length" class="loading-container">
          <loading></loading>
      </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'assets/js/dom.js'
import Loading from 'base/loading/loading'
const ANCHOR_HEIGHT = 18//字体高度加Padding值
const TiTLE_HEIGHT =18//字体高度加Padding值
export default {
    created(){
        this.touch={},//在VUE里面DATA的值都会添加一个get和set，有一个监听。我们不需要观测touch的变化，只要在下面获得touch就行
        this.listenScroll=true
        this.listHeight=[]
        this.probeType=3
    },
    data() {
        return {
            scrollY:-1,
            currentIndex:0,
            // diff:-1 //下一个列表的上限和当前滚动位置的上限的差
        }
    },
    props:{
        data:{//渲染数据
            type:Array,
            default:[]
        }
    },
    computed:{
        shortcutList(){//右侧列表数据
            return this.data.map((group)=>{//map数组
                return group.title.substr(0,1)//取标题的第一个字，例如热门就是两个字，我们只要热就好
            })
        },
        fixedTitle(){
            if(this.scrollY>0){
                return ''
            }
            return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
        }
    },
    methods: {
        selectItem(item){
            this.$emit('select',item)
        },
        onShortcutTouchStart(e){//点击事件,点的时候要获得元素的索引.
        //获取点击位置的dom元素index属性,index 属性可返回索引位置。
        //anchorIndex是个字符串，注意
            let anchorIndex=getData(e.target,'index')//e.target不会变化，它永远是直接接受事件的目标DOM元素；
            let firstTouch = e.touches[0]//获得第一个touch的位置
            this.touch.y1=firstTouch.pageY//获取touch的Y值
            this.touch.anchorIndex=anchorIndex//记录刚开始点的锚点的位置
            this._scrollTo(anchorIndex)
        },
        onShortcutTouchMove(e){//按住事件
            let firstTouch=e.touches[0]//获取刚开始按住的touch位置
            this.touch.y2=firstTouch.pageY//获得Y值
            let dalta = (this.touch.y2-this.touch.y1) / ANCHOR_HEIGHT |0 //获取纯点击和按住之后的偏移像素,然后除以一个元素高度，得到有多少元素，|0的用途就是得到整数
            let anchorIndex = parseInt(this.touch.anchorIndex)+dalta//获取元素位置，就是点击的元素位置加上偏移量
            this._scrollTo(anchorIndex)
        },
        refresh(){
            this.$refs.listview.refresh
        },
        scroll(pos){//这个方法在scroll中被派发
            this.scrollY=pos.y
        },
        _scrollTo(index){
            if(!index && index!==0){
                return 
            }
            //按住边界处理
            if(index <0){
                index =0
            }else if(index>this.listHeight.length-2){
                index=this.listHeight.length-2
            }
            this.scrollY=-this.listHeight[index]
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)

        },
        _calculateHeight(){
            this.listHeight=[]
            const list = this.$refs.listGroup
            let height=0
            this.listHeight.push(height)//开始高度是0
            for(let i=0;i<list.length;i++){
                let item =list[i]
                height+=item.clientHeight//item是个dom可以直接获取clientheight，累加每一个group的高度，
                this.listHeight.push(height)//累加一个就将一个高度push进去，就得到所有的高度了
            }
        },
    },
    components:{
        Scroll,
        Loading
    },
    watch: {
        data(){//如果数据发生变化
            setTimeout(()=>{
                this._calculateHeight()//计算每个group的高度
            },20)
        },
        scrollY(newY){//观测scrollY
            const listHeight = this.listHeight
            //当滚动到顶部newY>0
            if(newY>0){
                this.currentIndex=0
                return
            }
            //中间部分
            for(let i=0;i<listHeight.length-1;i++){//在开始都添加了一个0，所以会多一个列表元素
                let height1 = listHeight[i]//当前位置高度下限
                let height2= listHeight[i+1]//高度上限
                if((-newY>=height1)&&(-newY<height2)){//往上滚动Y值是负值,大于等于
                    this.currentIndex=i
                    // this.diff = height2+newY //高度上限（下个区块的下限）减去滚动的位置
                    return
                }
            }
            //当滚动到底部 且-newY大于最后一个元素的上限.
            this.currentIndex=listHeight.length-1
        },
        // diff(newVal){
        //     console.log(newVal)
        //     let fixedTop=(newVal>0 && newVal<TiTLE_HEIGHT)? newVal-TiTLE_HEIGHT :0
        //     if(this.fixedTop === fixedTop){
        //         return
        //     }
        //     this.fixedTop= fixedTop
            
        //     this.$refs.fixedTop.style.transform=`translate3d(0,${fixedTop}px,0)`
        // }
        
    },
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
.listview
    position :relative
    width:100%
    height :100%
    overflow :hidden
    background:$color-background
    .list-group
        .list-group-title
            height :20px
            line-height :20px
            padding-left:12px
            margin-bottom :10px
            font-size:$font-size-small
            color:#fff
            background:rgba(0, 0, 0, 0.1)
        .list-group-item
            display :flex
            align-items :center
            padding:5px 0
            margin 0 5px
            border-bottom :1px solid rgb(228,228,228)
            &:last-child
                border:none
                margin-bottom :10px
            .avatar
                width :50px
                height :50px
                border-radius:3px
            .name
                margin-left :20px
                color:$color-text
                font-size:$font-size-medium
    .list-shortcut
        position :absolute
        z-index:30
        right:3px
        top:50%
        transform:translateY(-50%)
        width: 20px
        padding:200px 0
        border-radius :3px
        text-align :center
        font-family : Helvetica
        .item
            padding:5px 5px
            line-height :1
            color:$color-text-g
            font-size:$font-size-small
            font-weight :bold
            &.current
                color:$color-theme
    .loading-container
        position:absolute
        width:100%
        top:50%
        transform :translateY(-50%)
    // .list-fixed
    //     position :absolute
    //     top:0
    //     left:0
    //     width:100%
    //     .fixed-title
    //         height :20px
    //         line-height :20px
    //         padding-left:12px
    //         margin-bottom :10px
    //         font-size:$font-size-small
    //         color:#fff
    //         background:grey
        
</style>