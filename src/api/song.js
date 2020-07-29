import axios from 'axios'
import {HOST} from 'assets/js/config'
export function getSong (id) {
    const url = HOST + `/song/url?id=${id}`
  
    return axios.get(url)
  }

  export function getLyric (id) {
    const url = HOST + `/lyric?id=${id}`
  
    return axios.get(url)
  }

  export function getListDetail (id) {
    const url = HOST + `/playlist/detail?id=${id}`
    return axios.get(url)
  }
  