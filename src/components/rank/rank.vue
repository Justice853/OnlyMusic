<template>
  <div class="rank" ref="rank">
      <scroll class="toplist" ref="scroll">
          <ul>
              <li class="item" v-for="item in yuntoplist" :key="item.id" @click="selectItem(item)">
                  <div class="icon">
                      <img v-lazy="item.coverImgUrl" width="100" height="100"/>
                  </div>
                  <ul class="songlist">
                      <li class="song" v-for="(song,index) in item.top" :key="index">
                          <span>{{index + 1}}.</span>
                          <span>{{song.name}} - {{song.ar[0].name}}</span>
                      </li>
                  </ul>
              </li>
          </ul>
          <div v-show="showLoading" class="loading-content">
            <loading></loading>
          </div>
      </scroll>
      <router-view></router-view>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playListMixin} from 'assets/js/mixin'
import {mapMutations} from 'vuex'
import {getTopList} from 'api/rank'
import {getListDetail} from 'api/song'
import {ERR_OK} from 'assets/js/config'
export default {
    mixins:[playListMixin],
    data() {
        return {
            showLoading: true,
            yuntoplist:[],
            toplist:[]
        }
    },
    created() {
        this._getTopList()
    },
    methods: {
        selectItem(item){
            this.$router.push({
                path:`/rank/${item.id}`
            })
            this.setTopList(item)
        },
        handlePlaylist (playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.rank.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
        _getTopList(){
            getTopList().then((res)=>{
                if(res.data.code === ERR_OK){
                   this.toplist=res.data.list
                   for(let i=0;i<this.toplist.length;i++){
                       getListDetail(this.toplist[i].id).then((res)=>{
                           let list = res.data.playlist
                           list.top = res.data.playlist.tracks.slice(0,3)
                           this.yuntoplist.push(list)
                       })
                       if(i===this.toplist.length-1){
                          this.showLoading=false
                       }
                   }
                }
            })
        },
        ...mapMutations({
            setTopList: 'SET_TOP_LIST'
        })
    },
    components:{
        Scroll,
        Loading
    }
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin";
.rank
    position :fixed
    width:100%
    top:88px
    bottom:0
    .toplist
        height :100%
        overflow :hidden
        padding-top:5px
        .item
            display :flex
            margin:0 10px
            padding:3px 0
            height:100px
            border-bottom :1px solid rgb(228,228,228)
            &:last-child
                padding-bottom:20px
            .icon
                flex:0 0 100px
                width:100px
                height:100px
                img
                    border-radius :3px
            .songlist
                flex:1
                display:flex
                flex-direction :column
                justify-content :center
                padding:0 20px
                height:100px
                overflow :hidden
                color:$color-text
                font-size:$font-size-small-x
                .song
                    no-wrap()
                    line-height :30px
    .loading-content
        position:fixed
        width:100%
        top:70%
        transform :translateY(-50%)                
</style>