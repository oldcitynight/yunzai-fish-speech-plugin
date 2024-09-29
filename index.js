// Description: 注册应用
// Autor: oldcitynight
// Last-change: 2024/9/29 16:56
import * as fishSpeech from './apps/fish-speech.js'

let apps = {}

logger.info('正在载入插件: Yunzai-Fish-Speech-Plugin') 

apps['fishSpeech'] = fishSpeech[Object.keys(fishSpeech)[0]];

logger.info('插件载入完毕: Yunzai-Fish-Speech-Plugin')

export { apps }
