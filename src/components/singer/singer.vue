<template>
  <div class="singer" ref="singer">
      <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
        <router-view></router-view>
  </div>
</template>

<script>
import {getSinger} from 'api/singer'
import {ERR_OK} from 'assets/js/config'
import Singer from 'assets/js/singer'
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'
import {playListMixin} from 'assets/js/mixin'
const pinyin = require('pinyin')//pinyin插件，拼音排序
const HOT_NAME = '热门'
const HOT_SINGERS = 10
export default {
    mixins:[playListMixin],
    data() {
        return {
            singers:[]
        }
    },
    created(){
        this._getSinger()
    },
    components:{
        ListView
    },
    methods:{
        handlePlaylist (playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.singer.style.bottom = bottom
            this.$refs.list.refresh()
        },
        selectSinger(singer){
            this.$router.push({
                path:`/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        _getSinger(){
            getSinger().then((res)=>{
                if(res.status === ERR_OK){
                    let s = res.data.artists
                    s.map((item)=>{
                        let py = pinyin(item.name[0],{
                            style:pinyin.STYLE_FIRST_LETTER
                        })
                        item.initial = py[0][0].toUpperCase() //把输入字符串中的小写字母全部变成大写字符。
                    })
                    this.singers=this._normalizeSinger(s)//进行字母序排序并进行数据注入
                }
            })
        },
        _normalizeSinger(list){
            let map={
                hot:{
                    title:HOT_NAME,
                    items:[]
                }
            }
            list.forEach((item,index) => {
                
                if(index < HOT_SINGERS){ //将前十个歌手放入热门歌手里
                    map.hot.items.push(new Singer({
                        id:item.id,
                        name:item.name,
                        avatar:item.img1v1Url,
                        aliaName:item.alias.join('/')
                    }))
                }
                
                const key = item.initial
                if(!map[key]){//如果该歌手在Map不存在
                    map[key]={
                        title:key,
                        items:[]
                    }
                }
                map[key].items.push(new Singer({
                    id:item.id,
                    name:item.name,
                    avatar:item.img1v1Url,
                    aliaName:item.alias[0]
                }))
            })
            let hot=[]
            let ret=[]
            for(const key in map){
                let val = map[key]
                //match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
                if(val.title.match(/[A-Z]/)){
                    ret.push(val)
                }else if(val.title === HOT_NAME){
                    hot.push(val)
                }
            }
            ret.sort((a,b)=>{
                return a.title.charCodeAt(0)-b.title.charCodeAt(0)
            })
            return hot.concat(ret)//concat() 方法用于连接两个或多个数组。
        },
        ...mapMutations({
            setSinger:'SET_SINGER'
        })
    }
}
</script>

<style lang="stylus" scoped>
.singer
    position :fixed
    top:88px
    bottom:0
    width:100%
</style>