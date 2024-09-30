// Description: 注册应用
// Autor: oldcitynight
// Last-change: 2024/9/30 19:15
import fs from 'fs/promises';
import { loadConfig } from './components/dealConfig.js';

const pack = await fs.readFile('./plugins/yunzai-fish-speech-plugin/package.json', 'utf-8')
logger.info(`[Yunzai-Fish-Speech-Plugin] 插件初始化中，当前版本 v${JSON.parse(pack).version}`)

import Help from './apps/help.js'
import MakeVoice from './apps/makeVoice.js';
import ManageAPI from './apps/manageAPI.js';
import ManageConfig from './apps/manageConfig.js';

const config = loadConfig();

const apps = {
    'Help': Help,
    'MakeVoice': MakeVoice,
    'ManageAPI': ManageAPI,
    'ManageConfig': ManageConfig,
}

for (let [_, app] of Object.entries(apps)) {
    app.config = config;
}

logger.debug(`[Yunzai-Fish-Speech-Plugin] 插件配置载入完成`)

export { apps }
