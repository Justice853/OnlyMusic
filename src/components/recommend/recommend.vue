<template>
  <div class="recommend" ref="recommend">
      <scroll ref="scroll" class="recommend-content" :data="playList">
          <div style="transform: translate(0px, 0px) ">
              <div v-show="banner.length" class="decorate" v-if="banner.length"></div>
              <div v-if="banner.length" class="slider-wrapper">
                <slider>
                    <div v-for="item in banner" :key="item.id "  @click.stop="selectBanner(item)">
                            <a :href="item.url">
                                <img  @load="loadImage" :src="item.imageUrl"/>
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="recommend-list">
                    <h1 class="title">热门歌单推荐</h1>
                    <ul>
                        <li @click = "selectItem(item)" class="item" v-for="item in playList" :key="item.id">
                            <div class="icon">
                                <div class="gradients"></div>
                                <img @load="loadImage" v-lazy="item.picUrl"/>
                            </div>
                            <p class="play-count">
                                <font-awesome-icon icon="headphones-alt"></font-awesome-icon>
                                {{Math.floor(item.playCount/10000)}}万
                            </p>
                            <div class="text">
                                <p class="name">{{item.name}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="recommend-song" ref="recommendSong">
                    <h1 class="title">推荐歌曲</h1>
                    <ul>
                        <li class="item" v-for="item in recommendMusic" :key="item.id" @click="selectSong(item)">
                            <div class="icon">
                                <img @load="loadImage"  v-lazy="item.image">
                            </div>
                            <p class="text">{{item.name}}</p>
                            <p class="singer">{{item.singer}}</p>
                        </li>
                    </ul>
                </div>
          </div>
          <div class="loading-container" v-show="!playList.length && !recommendMusic.length">
              <loading></loading>
          </div>
          <router-view></router-view>
      </scroll>
  </div>
</template>

<script>
import {getBanner,getRecommendList,getRecommendMusic} from 'api/recommend'
import {ERR_OK} from 'assets/js/config'
import {createRecommendSong} from 'assets/js/song'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playListMixin} from 'assets/js/mixin'
import {mapMutations,mapActions} from 'vuex'
import {getSongDetail} from 'api/search'
export default {
    mixins: [playListMixin],
    data() {
        return {
            banner:[],
            playList:[],
            recommendMusic:[]
        }
    },
    created(){
        this._getBanner()
        this._getRecommendList()
        this._getRecommendMusic()
    },
    methods:{
        selectBanner(item){
            if(item.targetId !=0){
                getSongDetail(item.targetId).then((res)=>{
                    let m = res.data.songs[0]
                    let song = {
                        id: m.id,
                        singer: m.ar[0].name,
                        name: m.name,
                        image: m.al.picUrl,
                        album: m.al.name
                    }
                    this.insertSong(song)
                    this.setFullScreen(true)
                })
            }
        },
        selectItem(item){
            this.$router.push({
                path:`/recommend/${item.id}`
            })
            this.setDisc(item)
        },
         handlePlaylist (playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.recommend.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
        selectSong(item){
            this.insertSong(item)
        },
        _getBanner(){
            getBanner().then((res)=>{
                if(res.status === ERR_OK){
                    let list = res.data.banners      
                    this.banner=list.splice(4,5)
                }else{
                    console.error('Banner 获取失败')
                }
            })
        },
        _getRecommendList(){
            getRecommendList().then((res)=>{
                if(res.status ===ERR_OK){
                    this.playList=res.data.result

                }else{
                    console.error("歌单获取失败")
                }
            })
        },
        _getRecommendMusic(){
            getRecommendMusic().then((res)=>{
                if(res.status==ERR_OK){
                    let list = res.data.result.map((item)=>{
                        return createRecommendSong(item)
                    })
                    list.splice(9)
                    this.recommendMusic=list
                }else{
                    console.log('推荐新歌获取失败')
                }
            })
        },
        loadImage(){
            if(!this.checkLoaded){
                 this.$refs.scroll.refresh()
                 this.checkLoaded=true
            }
           
        },
        ...mapMutations({
             setDisc:'SET_DISC',
             setFullScreen: 'SET_FULL_SCREEN'
        }),
        ...mapActions([
            'insertSong'
    ]   )
    },
    components:{
        Slider,
        Scroll,
        Loading
    }
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin";
    .recommend
        position: fixed
        width: 100%;
        top: 88px
        bottom: 0
        z-index: 100
        .recommend-content
            width: 100%
            height: 100%
            overflow: hidden //属性规定当内容溢出元素框时发生的事情。hidden内容会被修剪，并且其余内容是不可见的。
            .decorate
                position:absolute
                top:-30vh
                z-index: -10
                background :$color-theme
                width:100%
                height:45vh
                vertical-align :inherit //vertical-align 属性设置元素的垂直对齐方式。
            .slider-wrapper
                width:96%
                margin:0 auto
                border-radius :5px
                padding-top:5px
                overflow :hidden
            .recommend-list
                position :relative
                box-sizing :border-box
                width :100%
                text-align :center
                .title
                    height :65px
                    line-height :65px
                    padding-left:1.5%
                    text-align :left
                    font-size :$font-size-medium
                    font-weight :bold
                    color:$color-text
                .item
                    display :inline-block
                    position :relative
                    box-sizing :border-box //规定两个并排的带边框的框：
                    width :33%
                    padding:0 1%
                    .icon
                        position:relative
                        display :inline-block
                        width :100%
                        margin-bottom :5px
                        .gradents
                            position:absolute
                            top:0
                            width:100%
                            height:35px
                            border-radius:3px
                            background:linear-gradient(rgba(109, 109, 109, 0.4),rgba(255, 255, 255, 0))
                        img
                            width:100%
                            height:100%
                            border-radius :3px
                    .play-count
                        position:absolute
                        top:5px
                        right:8px
                        font-size:$font-size-small-s
                        color:$color-text-l
                    .text
                        float:left
                        line-height :16px
                        text-align :left
                        height:40px
                        line-height :16px
                        overflow :hidden
                        margin-bottom :10px
                        font-size :$font-size-small
            .recommend-song
                margin-top:-20px
                box-sizing :border-box
                width:100%
                text-align :center
                .title
                    height:65px
                    line-height :65px
                    padding-left:1.5%
                    text-align :left
                    font-size: $font-size-medium;
                    font-weight: bold;
                    color: $color-text
                .item
                    display: inline-block
                    position: relative
                    box-sizing: border-box
                    width: 33%
                    padding: 0 1%
                    .icon
                        position: relative
                        display: inline-block
                        width: 100%
                        margin-bottom: 5px
                        img
                            width:100%
                            height :100%
                            border-radius:3px
                    .text
                        line-height: 16px
                        text-align: left
                        height: 16px
                        @include no-wrap()
                        font-size: $font-size-small
                    .singer
                        line-height: 16px
                        margin-bottom: 10px
                        text-align: left
                        @include no-wrap()
                        font-size: $font-size-small
                        color: $color-text-g
            .loading-container
                position:absolute
                width:100%
                top:50%
                transform :translateY(-50%)
</style>