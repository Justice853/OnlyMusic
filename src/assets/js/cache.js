//基础操作相关代码
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const FAVORITE_KEY='__favorite__'
const FAVORITE_MAX_LENGTH=200

const HESTORY_KEY='__hestory__'
const HESTORY_MAX_LENGTH=200

function insertArrey(arr,val,compare,maxlen){//数组，值，比较函数,最大值
    const index = arr.findIndex(compare)
    if(index ===  0){
        return
    }
    if(index > 0){//存在该数据
        arr.splice(index ,1)
    }
    arr.unshift(val)
    if(maxlen && arr.length>maxlen){
        arr.pop()
    }
}

function deleteFormArray (arr,compare){
    const index = arr.findIndex(compare)
    if(index > -1){
        arr.splice(index,1)
    }
}

export function saveSearch(query){
    let searches=storage.get(SEARCH_KEY,[])
    insertArrey(searches,query,(item)=>{
        return item === query
    },SEARCH_MAX_LENGTH)
    storage.set(SEARCH_KEY,searches)
    return searches
}

export function loadSearch() { 
    return storage.get(SEARCH_KEY,[])
 }



export function deleteSearch(query) { 
    let searches = storage.get(SEARCH_KEY,[])

    deleteFormArray(searches,(item)=>{
        return item===query
    })
    storage.set(SEARCH_KEY,searches)
    return searches
 }

 export function clearSearch () {
    storage.remove(SEARCH_KEY)
    return []
  }

 export function saveFavorite(song) { 
     let songs = storage.get(FAVORITE_KEY,[])
     insertArrey(songs,song,(item)=>{
         return song.id === item.id
     },FAVORITE_MAX_LENGTH)
     storage.set(FAVORITE_KEY,songs)
     return songs
  }

  export function deleteFavorite(song) {
      let songs = storage.get(FAVORITE_KEY,[])
      deleteFormArray(songs,(item)=>{
          return song.id===item.id
      })
      storage.set(FAVORITE_KEY,songs)
      return songs
    }

   export function loadFavorite() { 
       return storage.get(FAVORITE_KEY,[])
    }

    export function loadHestory() { 
        return storage.get(HESTORY_KEY,[])
     }


     export function saveHestory(song) { 
        let songs = storage.get(HESTORY_KEY,[])
        insertArrey(songs,song,(item)=>{
            return song.id === item.id
        },FAVORITE_MAX_LENGTH)
        storage.set(HESTORY_KEY,songs)
        return songs
     }

