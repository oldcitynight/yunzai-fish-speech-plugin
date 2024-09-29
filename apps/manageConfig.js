// Description: 管理配置
// Autor: oldcitynight
// Last-change: 2024/9/29 16:56
import { loadConfig, dumpConfig } from '../components/dealConfig.js';

export default class ManageConfig extends plugin { 
    constructor(e) {
        const config = loadConfig();

        super({
            name: 'ManageConfig',
            dsc: 'ManageConfig',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: `^#?${config.common.name}查看配置$`,
                    rule: 'showConfig',
                    permission: 'master',
                }
            ],
        });

        this.config = config;
    }

    async showConfig(e) {
        if (!e.isMaster) { return false };
        
        let message = '当前配置：\n';
        message += JSON.stringify(this.config, null, 4);
        return await e.reply(message);
    }
}