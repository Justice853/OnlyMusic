<template>
   <div class="music-list">
        <div class="header" ref="header">
            <div class="back" @click="back">
                 <font-awesome-icon icon="chevron-left" class="fa"></font-awesome-icon>
            </div>
            <div class="text">
                <h1 class="title" >{{headerTitle}}</h1>
            </div>
        </div>
        <scroll
        @scroll="scroll"
        :probe-type="probeType" 
        :listen-scroll="listenScroll"
        :data="songs" 
         ref="list"
        class="list">
            <div class="music-list-wrapper">
                <div class="bg-image" :style="bgStyle" ref="bgImage">
                    <div class="filter"></div>
                    <div class="text">
                        <h2 class="list-title">{{title}}</h2>
                    </div>
                </div>
                <div class="song-list-wrapper">
                    <div class="sequence-play" @click="random">
                        <font-awesome-icon icon="play-circle" class="icon"></font-awesome-icon>
                        <span class="text">随机播放全部</span>
                        <span class="count">(共{{songs.length}}首)</span>
                    </div>
                    <song-list @select="selectItem" :songs="songs"></song-list>   
                </div>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>    
    </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import {mapActions} from 'vuex'
import {playListMixin} from 'assets/js/mixin'
const RESERVED_HEIGHT = 44
export default {
    mixins:[playListMixin],
    data() {
        return {
            scrollY: 0,
            headerTitle:''
        }
    },
    created(){
        this.probeType = 3
        this.listenScroll = true
        this.headerTitle = this.htitle
    },
    components:{
        Scroll,
        SongList,
        Loading
    },
    props:{
        bgImage:{
            type:String,
            default:''
        },
        songs:{
            type:Array,
            default:[]
        },
        title:{
            type:String,
            default:''
        },
        htitle:{
            type:String,
            default:'歌手'
        }
    },
    computed:{
        bgStyle(){
            return `background-image:url(${this.bgImage})`
        },
    },
    mounted(){
        this.imageHeight=this.$refs.bgImage.clientHeight
        this.minTranslateY = -this.imageHeight+RESERVED_HEIGHT
    },
    methods: {
        handlePlaylist (playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.list.$el.style.bottom = bottom
            this.$refs.list.refresh()
        },
        back(){
            this.$router.back()
        },
        scroll(pos){
            this.scrollY = pos.y
        },
        selectItem(item,index){
            
            this.selectPlay({
                list:this.songs,
                index:index
            })
        },
        random(){
            this.randomPlay({
                list:this.songs
            })
        },

        ...mapActions([
            'selectPlay',
            'randomPlay'
        ])
    },
    watch:{
        scrollY(newY){
            const percent =Math.abs(newY / this.imageHeight)
            if(newY<(this.minTranslateY + RESERVED_HEIGHT-20)){
                this.headerTitle=this.title
            }
            else{
                this.headerTitle=this.htitle
            }
            if(newY<0){
                this.$refs.header.style.background = `rgba(65, 105, 225, ${percent})`
            }else{
                this.$refs.header.style.background = `rgba(65, 105, 225,0)`
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin"
    .music-list
        position :fixed
        z-index :100
        top:0 //left:0; right:0; top:0; bottom:0; margin：auto;会使text居中，如果text没有宽高，则会继承父集的宽高
        left :0
        right:0
        bottom:0
        background:$color-background
        .header
            position :fixed
            top:0
            width:100%
            height :44px
            color:#fff
            z-index:100
            .back
                position :absolute
                top:0
                left:4px
                .fa
                    padding:5px 10px
                    font-size :30px
            .text
                position:absolute
                left :38px
                line-height :44px
                font-size :$font-size-medium-x
                no-wrap()
        .list
            position: fixed;
            top: 0;
            bottom: 0;
            width: 100%;
            background: $color-background;
            .music-list-wrapper
                .bg-image
                    position :relative
                    width :100%
                    height :0
                    padding-top:75%
                    transform-origin :top //transform-origin 属性允许您改变被转换元素的位置。 top定义视图处于Y轴的顶部 
                    background-size:cover //规定背景图像的尺寸。cover 把背景图像扩展至足够大，以使背景图像完全覆盖背景区域。
                    background-position :0 30%
                    .filter
                        position :absolute
                        top:0
                        left :0
                        width:100%
                        height:100%
                        background:black
                        opacity :0.2
                    .text
                        position:absolute
                        width :80%
                        height:40px
                        bottom:40px
                        left:20px
                        color:#fff
                        .list-title
                            position:absolute
                            bottom:0
                            font-size:$font-size-large-s
                            line-height :18px
                            font-weight :bold
                            letter-spacing :1px
                .song-list-wrapper
                    padding:41px 0 20px 0
                    border-radius :10px
                    position:relative
                    top:-20px
                    background:$color-background
                    .sequence-play
                        position:absolute
                        top:0px
                        display:flex
                        align-items :center
                        width:100%
                        height:40px
                        padding-left:16px
                        border-bottom:1px solid rgb(228,228,228)
                        .icon
                            font-size:18px
                            color:$color-text
                            padding-right:14px
                        .text
                            font-size:$font-size-medium-x
                        .count
                            font-size:$font-size-medium
                            color:$color-text-g
            .loading-container
                position:absolute
                width:100%
                top:50%
                transform :translateY(-50%)
</style>