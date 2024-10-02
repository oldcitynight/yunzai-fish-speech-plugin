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
        let c = 0;
        help += `${c++}. ${this.config.common.name}合成[文字] - 合成文字为语音\n`;
        help += `${c++}. ${this.config.common.name}[名字]说[文字] - 以指定名字合成文字为语音\n`;
        help += `${c++}. ${this.config.common.name}自定义合成[参数名1][参数值1] [参数名2][参数值2] 文本[文本内容]`;
        help += `${c++}. ${this.config.common.name}音色列表 - 获取支持的音色列表\n`;
        help += `${c++}. ${this.config.common.name}帮助 - 获取帮助\n`;
        
        if (e.isMaster) {
            help += `${c++}. ${this.config.common.name}部署本地API - 自动部署语音合成 API\n`;
            help += `${c++}. ${this.config.common.name}启动本地API - 启动本地语音合成 API\n`;
            help += `${c++}. ${this.config.common.name}关闭本地API - 关闭本地语音合成 API\n`;
            help += `${c++}. ${this.config.common.name}重启本地API - 重启本地语音合成 API\n`;
            help += `${c++}. ${this.config.common.name}测试API - 测试语音合成 API\n`;
            help += `${c++}. ${this.config.common.name}查看配置 - 查看当前配置`;
        };

        return e.reply(help);
    }
}
