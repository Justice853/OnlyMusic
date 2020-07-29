<template>
  <div class="suggest">
      <div class="search-suggest" v-show="!searchShow && query && songs.length>0">
          <p class="title" v-show="showSinger && showList">最佳匹配</p>
          <div @click="selectSinger(suggest.artists[0])" class="search-suggest-item"  v-if="suggest.artists && showSinger">
              <img :src="suggest.artists[0].img1v1Url" width="50" height="50">
              <span>歌手:{{suggest.artists[0].name}}</span>
          </div>
          <div @click="selectList(suggest.playlists[0])" class="search-suggest-item"  v-if="suggest.playlists && showList">
              <img :src="suggest.playlists[0].coverImgUrl" width="50" height="50">
              <div class="text">
                  <p>歌单:{{suggest.playlists[0].name}}</p>
                  <p class="singer">{{suggest.albums[0].artist.name}}</p>
              </div>
          </div>
      </div>
      <ul class="suggest-list" ref="suggestList" v-show="!searchShow">
          <li @click="selectSong(item)" class="suggest-item" v-for="(item, index) in songs" :key="index">
              <div class="icon">
                  <font-awesome-icon class="icon-disc" icon="compact-disc"></font-awesome-icon>
              </div>
              <div class="name">
                  <p class="song">{{item.name}}</p>
                  <p class="singer">
                      {{item.singer}}
                  </p>
              </div>
          </li>
          <loading v-show="haveMore && query"></loading>
      </ul>
      <div class="no-result-wrapper" v-show="!haveMore && !songs.length && query">
          抱歉，暂无搜索结果
      </div>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import Singer from 'assets/js/singer'
import {getSearchSongs, getSearchSuggest, getSongDetail} from 'api/search'
import {createSearchSong} from 'assets/js/song'
import {mapMutations, mapActions} from 'vuex'
export default {
    props:{
        query:{
            type:String,
            default:''
        },
        showSinger:{
            type:Boolean,
            default:true
        },
        showList:{
            type:Boolean,
            default:true
        }
        
    },
    data() {
        return {
            singer:{},
            songs:[],
            suggest:{},
            searchShow: true,
            page:0,
            haveMore: true,
            updata:true
        }
    },
    methods: {
        selectList(item){
            const list={}
            list.name=item.name
            list.id = item.id
            list.picUrl = item.coverImgUrl
            list.playCount= item.playCount
            this.$router.push({
                path: `/search/list/${list.id}`
            })
            this.setDisc(list)
            this.$emit('select')
        },
        selectSinger(item){
            const singer = new Singer({
                id:item.id,
                name:item.name,
                avatar :item.img1v1Url
            })
            this.$router.push({
                path: `/search/singer/${singer.id}`
            })
            this.setSinger(singer)
            this.$emit('select')
        },
        selectSong(item){
            getSongDetail(item.id).then((res)=>{
                item.image=res.data.songs[0].al.picUrl
                this.insertSong(item)
            })
            this.$emit('select')
        },
        search(){
            if(this.query.length ===0){
                return
            }
            this.searchShow=false
            this.haveMore = true
            getSearchSongs(this.query,this.page).then((res)=>{
                if(!res.data.result.songs){
                    this.haveMore=false
                    return
                }
                let list = res.data.result.songs
                let ret = []
                list.forEach((item) => {
                    ret.push(createSearchSong(item))
                })
                this.songs=ret
                this.$emit('refresh')
            })
            this.page+=30
            getSearchSuggest(this.query).then((res)=>{
                this.suggest=res.data.result
            })
        },
        searchMore(){
            if(!this.haveMore){
                return
            }
            if(!this.songs.length){
                return
            }
            getSearchSongs(this.query, this.page).then((res) => {
                let list = res.data.result.songs
                if (!res.data.result.songs) {
                    this.haveMore = false
                    return
                }
                let ret = []
                list.forEach((item) => {
                    ret.push(createSearchSong(item))
                })
                this.songs = this.songs.concat(ret)
                this.$emit('refresh')
                this.page += 30
            })
        },
        ...mapActions([
            'insertSong'
        ]),
        ...mapMutations({
            setSinger: 'SET_SINGER',
            setDisc: 'SET_DISC'
        })
    },
    watch:{
        query(val){
            if(val ===''){
                this.suggest={}
                this.songs=[]
                this.haveMore = false
            }
            this.suggest = {}
            this.songs = []
            this.searchShow = true
            this.page = 0
            this.haveMore = true
            this.search()
        }
    },
    components:{
        Loading
    }
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin"
.suggest
  height: 100%
  overflow: hidden
  .search-go 
    font-size: $font-size-medium
    margin-left: 20px
    color: $color-theme
  .search-suggest 
    .title 
      padding-left: 20px
      padding-bottom: 10px
      color: $color-theme
      font-size: 11px
    .search-suggest-item 
      display: flex
      align-items: center
      padding: 8px 20px
      border-bottom: 1px solid rgb(228, 228, 228)
      font-size: $font-size-medium
      img 
        flex: 0 0 50px
        padding-right: 15px
      .text 
        width: 100%;
        p 
          padding: 3px 0
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
        .singer 
          font-size: 12px
          color: $color-text
  .suggest-list 
    padding-bottom: 30px
    .suggest-item 
      display: flex
      padding: 3px 20px
      height: 50px
      align-items: center
      border-bottom: 1px solid rgb(228, 228, 228)
      .icon-disc
        font-size: 20px
        color: $color-text
        padding-right:10px
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text
        overflow: hidden
        p 
            padding: 3px 0
        .song 
            font-size: $font-size-medium-x
            color: $color-text
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
        .singer
            font-size: 12px
            color: $color-text-g
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis       
    
.no-result-wrapper 
  position: fixed
  overflow: hidden
  left: 50%
  top: 40vh
  transform: translatex(-50%)
  color: $color-text

  
</style>
