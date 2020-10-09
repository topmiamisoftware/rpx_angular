'user strict'

export const API = 'api/'
export const RESOURCES = 'http://localhost:8000/'
export const DEFAULTS = 'http://localhost:8000/defaults/'
export const FRONT_END = '/'

export const CHAT = 'https://express.spotbie.com:8080'

var today = new Date()
var date = today.getFullYear()+'.'+(today.getMonth()+1)+'.'+today.getDate()
export const VERSION = "Version: Beta " + date

// export const LOGIN_USER_API = "https://www.spotbie.com/"