// Description: 管理配置
// Autor: oldcitynight
// Last-change: 2024/9/30 19:46
import { dumpConfig } from "../components/dealConfig.js";

export default class ManageConfig extends plugin { 

    static config;

    constructor(e) {
        super({
            name: 'ManageConfig',
            dsc: 'ManageConfig',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: `^#?${ManageConfig.config.common.name}查看配置$`,
                    fnc: 'showConfig',
                    permission: 'master',
                }
            ],
        });

        this.config = ManageConfig.config;
        
    }

    async showConfig(e) {
        if (!e.isMaster) { return false };
        
        let message = '当前配置：\n';
        message += JSON.stringify(this.config, null, 4);
        return await e.reply(message);
    }
}
