// Description: 读取和写入配置文件
// Autor: oldcitynight
// Last-change: 2024/9/28 2:28
import { readFileSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';

class Configs {
    constructor() {
        this.api = {
            enable_api: true,
            api_url: 'http://127.0.0.1:8080/',
            enable_mirror: false,
        };
        this.env = {
            conda_env_name: "yunzai-fish-speech",
            conda_bin_path: false,
        };
        this.generate = {
            enable_gpu: false,
            default_voice_path: "./plugins/yunzai-fish-speech-plugin/datas/defaultVoice/voice.wav",
            default_voice_text: "说起来，深渊教团去奔狼领干嘛？难道又要重演特瓦林事件？啊——重复的灾难就别再来啦。",
            voice_path: "./plugins/yunzai-fish-speech-plugin/datas/customVoice/",
        };
        this.common = {
            name: "FishSpeech",
        };
    }
}

const readCfg = (point, config) => {
    let file;
    let cfg;
    try {
        file = readFileSync(`./plugins/yunzai-fish-speech-plugin/configs/${point}_config.yaml`, 'utf8');
        cfg = yaml.load(file);
    } catch (e) {
        console.log(`配置文件 ${point}_config.yaml 未找到或读取失败, 将使用默认配置`);
        return;
    }
    config[point] = cfg;
}

export const loadConfig = () => {
    const config = new Configs();
    readCfg('api', config);
    readCfg('env', config);
    readCfg('generate', config);
    readCfg('common', config);
    return config;
}

export const dumpConfig = (config) => {
    for (let key in config) {
        const cfgStr = yaml.dump(config[key]);
        writeFileSync(`./plugins/yunzai-fish-speech-plugin/configs/${key}.yaml`, cfgStr);
    }
}
