// Description: 合成语音
// Autor: oldcitynight
// Last-change: 2024/9/30 19:09
import { SimpleAudio, MakeAudio } from "../components/makeAudio.js";
import fs from 'fs/promises';

export default class MakeVoice extends plugin {

    static config;

    constructor(e) {
        super({
            name: 'MakeVoice',
            dsc: 'MakeVoice',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: `^#?${MakeVoice.config.common.name}合成(.+)$`,
                    fnc: 'simpleMake',
                },
                {
                    reg: `^#?${MakeVoice.config.common.name}(.+)说(.+)$`,
                    fnc: 'MakeVoice',
                },
                {
                    reg: `^#?${MakeVoice.config.common.name}音色列表$`,
                    fnc: 'getList',
                },
            ],
        });

        this.config = MakeVoice.config;

    }

    async simpleMake(e) {
        let msg = e.msg.replace('#', '').replace(this.config.common.name, '');
        let text = msg.match(/合成(.+)/)[1].trim();
        
        let audio;

        logger.debug('收到语音合成命令，准备发送请求到后端')
        const start = new Date().getTime();

        try {
            audio = await SimpleAudio(text, this.config);
        } catch (err) {
            return await e.reply(`合成失败，错误：${e.message}`);
        }

        const end = new Date().getTime();
        logger.debug(`语音合成成功，用时 ${(end - start)/1000}s`)

        return await e.reply(segment.record(audio));
    }

    async MakeVoice(e) {
        let msg = e.msg.replace('#', '').replace(this.config.common.name, '');
        let [raw_ref_id, raw_text] = msg.match(/(.+)说(.+)/);
        
        const text = raw_text.trim();
        const ref_id = raw_ref_id.trim();
        
        let audio;
        try {
            audio = await MakeAudio(ref_id, text, this.config);
        } catch (err) {
            return await e.reply(`合成失败，错误：${err.message}`);
        }
        return await e.reply(segment.record(audio));
    }

    async getList(e) {
        const raw_list = await fs.readdir(this.config.generate.voice_path);
        let list = [];
        for (const f of raw_list) {
            if (f.endsWith('.wav') && await fs.access(f.replace('.wav', '.txt'))) {
                list.push(f.replace('.wav', ''));
            }
        }
        let message = '音色列表: \n'
        for (const f of list) {
            message += f.replace('.wav', '');
            message += '\n';
        }
        return await e.reply(message);
    }
}
