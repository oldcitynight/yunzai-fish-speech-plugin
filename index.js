// Description: 注册应用
// Autor: oldcitynight
// Last-change: 2024/9/29 19:38
import fs from 'fs/promises';

fs.readFile('./plugins/yunzai-fish-speech-plugin/package.json', 'utf-8')
    .then((data) => {
        return JSON.parse(data).version
    })
    .then((version) => {
        logger.info(`[Yunzai-Fish-Speech-Plugin] 插件初始化中，当前版本 v${version}`)
    });

import Help from './apps/help.js'
import MakeVoice from './apps/makeVoice.js';
import ManageAPI from './apps/manageAPI.js';
import ManageConfig from './apps/manageConfig.js';

const apps = {
    'Help': Help,
    'MakeVoice': MakeVoice,
    'ManageAPI': ManageAPI,
    'ManageConfig': ManageConfig,
}

export { apps }
