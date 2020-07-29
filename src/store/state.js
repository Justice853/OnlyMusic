import {playMode} from 'assets/js/config'
import {loadSearch,loadFavorite,loadHestory} from 'assets/js/cache'
const state ={
    singer:{},
    playing:false,//播放
    fullScreen:false,//播放器展开和收起
    playlist:[],//播放列表
    sequenceList:[],//歌曲播放列表
    mode:playMode.sequence,//模式
    currentIndex:-1,//当前播放歌曲位置
    disc:{},
    topList: {} ,
    searchHistory:loadSearch(),
    favoriteList:loadFavorite(),
    playHistory:loadHestory()
}

export default state