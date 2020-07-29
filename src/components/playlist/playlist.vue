<template>
  <transition name="list-fade">
      <div class="playlist" v-show="showFlag" @click="hide">
          <div class="list-wrapper" @click.stop>
              <div class="list-header">
                  <h1 class="title">
                    <font-awesome-icon :icon="iconMode" class="iconfont" @click="changeMode"></font-awesome-icon>
                    <span class="text">{{modeText}}
                    (<span class="count">{{playlist.length}}</span>)
                    </span>
                    <span class="clear" @click="showConfirm">
                        <font-awesome-icon icon="trash-alt" class="icon-clear"></font-awesome-icon>
                    </span>
                  </h1>
              </div>
              <scroll class="list-content" ref="listContent" :data="sequenceList">
                  <transition-group name="list" tag="ul">
                      <li class="item" ref="listItem" v-for="(item,index) in sequenceList" @click="selectItem(item,index)" :key="item.id">
                          <font-awesome-icon :icon='getCurrentSong(item)' class="current" ></font-awesome-icon>
                          <span class="text">{{item.name}}</span>
                          <span class="delete" @click.stop="deleteOne(item)">
                              <font-awesome-icon icon="ban" class="delete"></font-awesome-icon>
                          </span>
                      </li>
                  </transition-group>
              </scroll>
              <div class="list-close" @click="hide">
                  <span>关闭</span>
              </div>
          </div>
          <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import {playMode} from 'assets/js/config'
import {shuffile} from 'assets/js/util'
export default {
    data() {
        return {
            showFlag:false,
            refreshDelay:100
        }
    },
    computed:{
        iconMode(){
            return this.mode ===playMode.sequence ? 'redo' : this.mode===playMode.loop ? 'sync' : 'random'
        },
         modeText () {
            return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
        },
        ...mapGetters([
            'sequenceList',
            'currentSong',
            'mode',
            'currentIndex',
            'playlist'
        ])
        
    },
    methods: {
        hide(){
            this.showFlag=false
        },
        show(){
            this.showFlag=true
            setTimeout(()=>{
                this.$refs.listContent.refresh()
                //赵傲当前歌曲位置
                this.scrollToCurrent(this.currentSong)
            })
        },
        scrollToCurrent(current){
            const index = this.sequenceList.findIndex((song)=>{
                return current.id === song.id
            })
            //滚动到目标指定元素
            this.$refs.listContent.scrollToElement(this.$refs.listItem[index],300)
        },
        showConfirm(){
            this.$refs.confirm.show()
        },
        confirmClear(){
            this.deleteSongList()
            this.hide()
            this.$emit('stopMusic')
        },
        deleteOne(item){
            this.deleteSong(item)
            if(!this.playlist.length){
                this.hide()
                this.$emit('stopMusic')
            }
        },
        getCurrentSong(item){
            if(this.currentSong.id===item.id){
                return ['fas', 'volume-up']
            }else{
                return ['fas','volume-off']
            }
        },
        selectItem(item,index){
            if(this.mode=== playMode.random){
                // 找到需要播放的歌曲在播放顺序里面的索引
                index = this.playlist.findIndex((song)=>{
                    return song.id===item.id
                })
            }
            this.setCurrentIndex(index)
        },
        changeMode(){
            const mode = (this.mode+1)%3
            this.setPlayMode(mode)
            let list = null
            if(mode ===playMode.random){
                list =shuffile(this.sequenceList)
            }else{
                list =this.sequenceList
            }
            this._resetCurrentIndex(list)
            this.setPlayList(list)
        },
        _resetCurrentIndex (list) {
            let index = list.findIndex((item) => {
                // 返回 index
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        ...mapMutations({
            setCurrentIndex:'SET_CURRENT_INDEX',
            setPlayMode:'SET_PLAY_MODE',
            setPlayList:'SET_PLAYLIST'
        }),
        ...mapActions([
            'deleteSong',
            'deleteSongList'
        ])
    },
    components:{
        Scroll,
        Confirm
    }
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin"
.playlist
    position:fixed
    left :0
    right:0
    top:0
    bottom:0
    z-index:200
    background-color:rgba(0,0,0,0.3)
    &.list-fade-enter-active,&.list-fade-leave-active
        transition :opacity 0.3s
        .list-wrapper
            transition: all 0.3s
    &.list-fade-enter,&.list-fade-leave-top
        opacity :0
        .list-wrapper
            transition :all 0.3s
    .list-wrapper
        position: absolute
        left: 0
        bottom: 0
        width: 100%
        border-radius: 8px
        background-color: $color-background
        .list-header
            position :relative
            padding:20px 30px 10px 20px
            .title
                display:flex
                align-items :center
                .iconfont
                    margin-right :10px
                    font-size:20px
                    color:$color-text-g
                .text
                    flex:1
                    font-size:$font-size-medium
                    color:$color-text
                    .count
                        position:relative
                        top:1px
                .clear
                    extend-click()
                    .icon-clear
                        font-size:$font-size-medium
                        color:$color-text-g
        .list-content
            max-height :240px
            overflow :hidden
            .item
                display: flex
                align-items: center
                height: 40px
                padding: 0 30px 0 20px
                overflow: hidden
                &.list-enter-active,&.list-leave-active
                    transition: all 0.1s
                &.list-enter,&.list-leave-to
                    height:0
                .current
                    color:$color-theme
                    margin-right :5px
                .text
                    flex:1
                    no-wrap()
                    line-height :20px
                    font-size:$font-size-medium
                    color:$color-text
                .delete
                    extend-click()
                    font-size:$font-size-medium
                    color:$color-theme
        .list-close
            text-align :center
            line-height :50px
            background:$color-background
            font-size:$font-size-medium-x
            color:$color-text
</style>