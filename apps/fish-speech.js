// Description: 注册应用
// Autor: oldcitynight
// Last-change: 2024/9/28 11:13
import { loadConfig, dumpConfig } from '../components/dealConfig.js';
import { Install } from '../components/deployAPI.js';
import { SimpleAudio, MakeAudio } from '../components/makeAudio.js';
import { startAPI, shutdownAPI, restartAPI } from '../components/manageAPI.js';
import { readdir, access } from 'fs/promises';

export default class FishSpeechPlugin extends plugin {
    constructor(e) {

        const rules = [];

        super({
            name: 'FishSpeech',
            dsc: 'FishSpeech',
            event: 'message',
            priority: 100,
            rule: rules,
        });

        this.fishConfig = loadConfig();

        rules.push({
            reg: `^#?${this.fishConfig.common.name}(帮助|help|HELP|指南|bangzhu|说明)$`,
            rule: 'help',
        });
        
        rules.push({
            reg: `^#?${this.fishConfig.common.name}合成(.+)$`,
            rule: 'simpleMake',
        });

        rules.push({
            reg: `^#?${this.fishConfig.common.name}合成(.+)$`,
            rule: 'simpleMake',
        });

        rules.push({
            reg: `^#?${this.fishConfig.common.name}(.+)说(.+)$`,
            rule: 'MakeVoice',
        });

        rules.push({
            reg: `^#?${this.fishConfig.common.name}音色列表$`,
            rule: 'getList',
        });
                      
        rules.push({
            reg: `^#?${this.fishConfig.common.name}自动搭建 API$`,
            rule: 'installAPI',
            permission: 'master',
        })
        
        rules.push({
            reg: `^#?${this.fishConfig.common.name}启动本地 API$`,
            rule: 'StartAPI',
            permission: 'master',
        });
        rules.push({
            reg: `^#?${this.fishConfig.common.name}关闭本地 API$`,
            rule: 'ShutdownAPI',
            permission: 'master',
        });
        rules.push({
            reg: `^#?${this.fishConfig.common.name}重启本地 API$`,
            rule: 'RestartAPI',
            permission: 'master',
        });
        rules.push({
            reg: `^#?${this.fishConfig.common.name}测试 API$`,
            rule: 'testAPI',
            permission: 'master',
        });
        rules.push({
            reg: `^#?${this.fishConfig.common.name}查看配置$`,
            rule: 'showConfig',
            permission: 'master',
        });
    }

    async help(e) {

        const help_msg = `${this.fishConfig.common.name}帮助：
1. 使用默认音色生成语音：
${this.fishConfig.common.name}合成[文本]
2. 使用自定义音色生成语音：
${this.fishConfig.common.name}[音色ID]说[文本]
3. 查看音色列表：
${this.fishConfig.common.name}音色列表
4. 再次查看本帮助：
${this.fishConfig.common.name}帮助`

        const help_msg_master = `
5. 自动搭建API(仅支持 Linux，大概率会失败)
${this.fishConfig.common.name}自动搭建 API
6. 启动 API
${this.fishConfig.common.name}启动本地 API
7. 重启 API
${this.fishConfig.common.name}重启本地 API
8. 关闭 API
${this.fishConfig.common.name}关闭本地 API
9. 测试 API
${this.fishConfig.common.name}测试 API
10. 查看当前配置信息
${this.fishConfig.common.name}查看配置
`

        let msg = help_msg;
        if (e.isMaster) {
            msg += help_msg_master;
        }
        return await e.reply(msg);
    }

    async simpleMake(e) {
        let msg = e.msg.replace('#', '').replace(this.fishConfig.common.name, '');
        let text = msg.match(/合成(.+)/)[1].trim();
        
        let audio;
        try {
            audio = await SimpleAudio(text, this.fishConfig);
        } catch (e) {
            return await e.reply(`合成失败，错误：${e.message}`);
        }
        return await e.reply(segment.record(audio));
    }

    async MakeVoice(e) {
        let msg = e.msg.replace('#', '').replace(this.fishConfig.common.name, '');
        let [raw_ref_id, raw_text] = msg.match(/(.+)说(.+)/);
        
        const text = raw_text.trim();
        const ref_id = raw_ref_id.trim();
        
        let audio;
        try {
            audio = await MakeAudio(ref_id, text, this.fishConfig);
        } catch (err) {
            return await e.reply(`合成失败，错误：${err.message}`);
        }
        return await e.reply(segment.record(audio));
    }

    async getList(e) {
        const raw_list = await readdir(this.fishConfig.generate.voice_path);
        let list = [];
        for (const f of raw_list) {
            if (f.endwith('.wav') && await access(f.replace('.wav', '.txt'))) {
                list.push(f.replace('.wav', ''));
            }
        }
        let message = '音色列表: \n'
        for (const f of list) {
            message += f.replace('wav', '');
            message += '\n';
        }
        return await e.reply(message);
    }

    async installAPI(e) {
        if (!e.isMaster) { return false };
        
        try {
            await Install(this.fishConfig);
        } catch (e) {
            await e.reply('API搭建失败，错误如下');
            await e.reply(e.message);
            await e.reply('请检查控制台查看全部输出，建议手动搭建');
        }
        return await e.reply('API搭建成功');
    }

    async StartAPI(e) {
        if (!e.isMaster) { return false };
        
        try {
            await startAPI(this.fishConfig);
        } catch (e) {
            return await e.reply(`API启动失败，错误：${e.message}`);
        }
        return await e.reply('API启动成功');
    }

    async ShutdownAPI(e) {
        if (!e.isMaster) { return false };
        
        try {
            await shutdownAPI(this.fishConfig);
        } catch (e) {
            return await e.reply(`API关闭失败，错误：${e.message}`);
        }
        return await e.reply('API关闭成功');
    }

    async RestartAPI(e) {
        if (!e.isMaster) { return false };
        
        try {
            await restartAPI(this.fishConfig);
        } catch (e) {
            return await e.reply(`API重启失败，错误：${e.message}`);
        }
        return await e.reply('API重启成功');
    }

    async testAPI(e) {
        if (!e.isMaster) { return false };
        
        let audio;
        try {
            audio = await SimpleAudio('你好呀，做一个测试', this.fishConfig);
        } catch (e) {
            return await e.reply(`API测试失败，错误：${e.message}`);
        }
        await e.reply('API测试完成，若语音已发送且可播放即正常');
        return await e.reply(segment.record(audio));
    }

    async showConfig(e) {
        if (!e.isMaster) { return false };
        
        let config = this.fishConfig;
        let message = '当前配置信息：\n';
        for (let key in config) {
            message += key + ': ' + JSON.stringify(config[key]) + '\n';
        }
        return await e.reply(message);
    }
}
