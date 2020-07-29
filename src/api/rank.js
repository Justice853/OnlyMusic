import axios from 'axios'
import {HOST} from 'assets/js/config'


export function getTopList(){
  const url = HOST + `/toplist`

  return axios.get(url)
}

  