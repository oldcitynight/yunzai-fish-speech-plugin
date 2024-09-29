// Description: 管理 API
// Autor: oldcitynight
// Last-change: 2024/9/30 22:05
import { loadConfig } from '../components/dealConfig.js';
import { startAPI, shutdownAPI, restartAPI } from '../components/manageAPI.js';
import { SimpleAudio } from '../components/makeAudio.js';
import { Install } from '../components/deployAPI.js';

export default class ManageAPI extends plugin {
    constructor(e) {

        const config = loadConfig();

        super({
            name: 'manageAPI',
            dsc: 'manageAPI',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: `^#?${config.common.name}自动搭建 API$`,
                    fnc: 'installAPI',
                    permission: 'master',
                },
                {
                    reg: `^#?${config.common.name}启动本地 API$`,
                    fnc: 'StartAPI',
                    permission: 'master',
                },
                {
                    reg: `^#?${config.common.name}关闭本地 API$`,
                    fnc: 'ShutdownAPI',
                    permission: 'master',
                },
                {
                    reg: `^#?${config.common.name}重启本地 API$`,
                    fnc: 'RestartAPI',
                    permission: 'master',
                },
                {
                    reg: `^#?${config.common.name}测试 API$`,
                    fnc: 'testAPI',
                    permission: 'master'
                },
            ],
        });

        this.config = config;
    }

    async installAPI(e) {
        if (!e.isMaster) { return false };
        
        try {
            await Install(this.config);
        } catch (err) {
            await this.reply('API搭建失败，错误如下');
            await this.reply(err.message);
            await this.reply('请检查控制台查看全部输出，建议手动搭建');
        }
        return await e.reply('API搭建成功');
    }

    async StartAPI(e) {
        if (!e.isMaster) { return false };
        
        try {
            this.APIterminal = await startAPI(this.config);
        } catch (err) {
            return await e.reply(`API启动失败，错误：${err.message}`);
        }
        return await e.reply('API启动成功');
    }

    async ShutdownAPI(e) {
        if (!e.isMaster) { return false };
        
        try {
            await shutdownAPI(this.APIterminal);
        } catch (err) {
            return await e.reply(`API关闭失败，错误：${err.message}`);
        }
        return await e.reply('API关闭成功');
    }

    async RestartAPI(e) {
        if (!e.isMaster) { return false };
        
        try {
            await restartAPI(this.APIterminal);
        } catch (err) {
            return await e.reply(`API重启失败，错误：${err.message}`);
        }
        return await e.reply('API重启成功');
    }

    async testAPI(e) {
        if (!e.isMaster) { return false };
        
        let audio;
        try {
            audio = await SimpleAudio('你好呀，做一个测试', this.config);
        } catch (err) {
            return await e.reply(`API测试失败，错误：${err.message}`);
        }
        await e.reply(segment.record(audio));
        return await e.reply('API测试完成，若语音已发送且可播放即正常');
    }
}
