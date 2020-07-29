<template>
<transition name="search">
  <div class="search" ref="searchWrapper">
      <div class="search-box-wrapper">
            <font-awesome-icon icon="chevron-left" class="fa" @click="back"></font-awesome-icon>
            <search-box @query="onQueryChange" ref="searchbox"></search-box>
      </div>
      <scroll class="search-scroll-wrapper" ref="scroll" :pullup="pullup" @scrollToEnd="searchMore">
        <div ref="search">
          <div class="search-hots" v-show="!query">
            <p class="title">热门搜索</p>
            <span class="search-hots-item" v-for="item in hots" :key="item.id" @click="addQuery(item.first)"  >
              {{item.first}}
            </span>
          </div>
          <div class="shortcut-wrapper" v-show="!query">
            <div class="search-history" v-show="searchHistory.length" > 
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="showConfirm">
                  <font-awesome-icon icon="trash-alt" class="icon-clear"></font-awesome-icon>
                </span>
              </h1>
               <search-list @select="addQuery"  @delete="deleteSearchHistory"   :searches="searchHistory"></search-list>
            </div>
          </div>
          <div class="search-result">
            <suggest @select="saveSearch"  @refresh="refresh" :query="query" ref="suggest"></suggest>
          </div>
        </div>
      </scroll>
      <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空历史记录？" confirmBtnText="清空"></confirm>
      <router-view></router-view>
  </div>
</transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Scroll from 'base/scroll/scroll'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import {getSearchHot} from 'api/search'
import {playlistMixin} from 'assets/js/mixin'
import {mapActions, mapGetters} from 'vuex'

export default {
   data() {
     return {
       hots:[],
       query:'',
       pullup:true
     }
   },
   components:{
      Scroll,
       SearchBox,
       Suggest,
       SearchList,
       Confirm
   },
   created() {
     this._getSearchHot()
   },
   computed:{
     ...mapGetters([
      'searchHistory'
    ]),
   },
   methods: {
     back(){
       this.$router.back()
       this.$refs.searchbox.clear()
     },
     onQueryChange(query){
       this.query=query
     },
     addQuery(query){
       this.$refs.searchbox.setQuery(query)
     },
    showConfirm () {
      this.$refs.confirm.show()
    },
     searchMore () {
      this.$refs.suggest.searchMore()
    },
     _getSearchHot(){
       getSearchHot().then(res=>{
         this.hots=res.data.result.hots
       })
     },
     refresh () {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    },
    saveSearch () {
     this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ]),
    
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.searchWrapper.style.bottom = bottom
      this.refresh()
    }
   },
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin"
.search-enter-active, .search-leave-active 
  transition: all 0.3s
.search-enter, .search-leave-to 
  transform: translate3d(50%, 0, 0)
  opacity: 0
.search
  position: fixed
  z-index: 100
  width: 100%
  top: 0
  bottom: 0
  background: $color-background
  .search-box-wrapper
        padding: 10px 40px 10px 43px
        background: $color-theme
        .fa
            position: absolute
            left: 5px
            top: 3px
            padding: 3px 10px
            font-size: 30px
            color: #fff
  .search-scroll-wrapper
        height: 100%
        overflow: hidden
        .search-hots
            margin:0 20px
            .title
                padding: 15px 5px 0 5px
                height: 30px
                line-height: 30px
                font-size:$font-size-small-x
                color: $color-text-g
            span
                display: inline-block
                padding: 3px 5px
                margin: 4px 4px
                border: 0.8px solid $color-text-ggg
                border-radius: 5px
                line-height: 20px
                color: $color-text
                font-size: $font-size-medium
        .shortcut-wrapper
            position :relative
            .search-history
                position :relative
                margin:10px 25px
                .title
                    display: flex
                    align-items: center
                    height: 30px
                    font-size: $font-size-small-x
                    color: $color-text-g
                    .text
                        flex:1
                    .clear
                        extend-click()
                        .icon-clear
                                font-size:$font-size-medium
                                color:$color-text
        .search-result 
            position: relative
            width: 100%
            top: 10px
            bottom: 0
.router-view
  z-index:1000
</style>