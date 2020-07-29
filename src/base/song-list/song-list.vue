<template>
  <div class="song-list">
      <ul>
          <li  v-for="(song, index) in songs" :key="song.id" class="item" @click="selectItem(song,index)" >
              <p class="count">{{index+1}}</p>
              <div class="content">
                  <h2 class="name">{{song.name}}</h2>
                  <p class="desc">{{getDesc(song)}}</p>
              </div>
          </li>
      </ul>
  </div>
</template>

<script>
export default {
    props:{
        songs:{
            type:Array,
            default:[]
        }
    },
    methods: {
        selectItem(item,index){
            this.$emit('select',item,index)//派发select事件，属性有item，index
        },
        getDesc (song) {
            if (song.aliaName) {
                return `${song.singer} - ${song.aliaName}`
            } else {
                return `${song.singer}`
            }
        }
    },
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin"
.song-list
    .item
        position: relative
        display: flex
        align-items: center
        box-sizing: border-box
        height: 60px
        border-bottom: 1px solid rgb(228, 228, 228)
        .count
            flex: 0 0 50px
            width: 50px
            text-align: center
            color: $color-text-g
        .content
            flex:1 //让所有弹性盒模型对象的子元素都有相同的长度，且忽略它们内部的内容：
            line-height :20px
            overflow :hidden
            .name
                margin-top :4px
                width :80%
                color:$color-text
                no-wrap()
            .desc
                width:80%
                font-size :12px
                color:$color-text-g
                no-wrap()
            
</style>

