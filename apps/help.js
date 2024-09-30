// Description: 获取帮助
// Autor: oldcitynight
// Last-change: 2024/9/30 19:09
export default class Help extends plugin {

    static config;

    constructor(e) {
        super({
            name: 'Help',
            dsc: 'Help',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: `^#?${Help.config.common.name}(帮助|help|HELP|指南|bangzhu|说明)$`,
                    fnc: 'help',
                },
            ],
        });

        this.config = Help.config;

    }

    async help(e) {
        logger.debug('已触发 Help 事件监听')
        let help = 'FishSpeech 语音合成插件帮助\n';
        help += `1. ${this.config.common.name}合成[文字] - 合成文字为语音\n`;
        help += `2. ${this.config.common.name}[名字]说[文字] - 以指定名字合成文字为语音\n`;
        help += `3. ${this.config.common.name}音色列表 - 获取支持的音色列表\n`;
        help += `4. ${this.config.common.name}帮助 - 获取帮助\n`;
        
        if (e.isMaster) {
            help += `5. ${this.config.common.name}部署本地 API - 自动部署语音合成 API\n`;
            help += `6. ${this.config.common.name}启动本地 API - 启动本地语音合成 API\n`;
            help += `7. ${this.config.common.name}关闭本地 API - 关闭本地语音合成 API\n`;
            help += `8. ${this.config.common.name}重启本地 API - 重启本地语音合成 API\n`;
            help += `9. ${this.config.common.name}测试 API - 测试语音合成 API\n`;
            help += `10. ${this.config.common.name}查看配置 - 查看当前配置`;
        };

        return e.reply(help);
    }
}
