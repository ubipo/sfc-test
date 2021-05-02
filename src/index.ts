import { createSSRApp, createApp } from 'vue'

import Main from './Main.vue'

const appElem = document.getElementById('app')
if (appElem === null) throw "App mount point not found"
const shouldHydrate = appElem.innerHTML !== ''
if (shouldHydrate) console.info('Hydrating...')
const mainProps = { }
const app = shouldHydrate
  ? createSSRApp(Main, mainProps)
  : createApp(Main, mainProps)


app.mount(appElem) 
