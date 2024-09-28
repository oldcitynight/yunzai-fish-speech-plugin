// Description: 本地部署 API
// Autor: oldcitynight
// Last-change: 2024/9/28 9:15
import { platform as _platform } from 'os';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { spawn, exec } from 'child_process';

const getSystemType = () => {
    const platform = _platform();

    switch (platform) {
        case 'win32':
            return 'Windows';
        case 'darwin':
            return 'MacOS';
        case 'linux':
            return 'Linux';
        default:
            return 'Unknown';
    }
};

const checkConda = async (config) => {
    let cond = false
    
    if (config.env.conda_env_path) {
        exec(`${config.env.conda_env_path} --version`, (error, stdout, _stderr) => {
            if (error) { return }
            else {
                const version = stdout.split(' ')[1];
                if (version < '4.10.3') { return };
                cond = true;
            }
        });
    } else {
        exec('conda --version', (error, stdout, _stderr) => {
            if (error) { return }
            else {
                const version = stdout.split(' ')[1];
                if (version < '4.10.3') { return };
                cond = true;
            }
        });
    }

    return cond;
}

const createCondaEnv = async (config) => {
    let cond = false;
    const cmd = config.env.conda_env_path || 'conda';
    cmd += `create -n ${config.env.conda_env_name} python=3.10`;
    exec(cmd, (error, _stdout, stderr) => {
        if (error) { return }
        if (stderr) { return }
        cond = true;
    });
    return cond;
}

const cloneFishSpeech = async () => {
    const cd = 'cd ./plugins/yunzai-fish-speech-plugin \n';
    const clone = 'git clone https://github.com/fishaudio/fish-speech.git \n';
    const cmd = `${cd} && ${clone}`;
    
    let cond = false;
    exec(cmd, (error, _stdout, _stderr) => {
        if (error) { return }
        cond = true;
    });
    return cond;
}

const installCondaPkg = async (config) => {

    let activate = config.env.conda_env_path || 'conda';
    activate += `activate ${config.env.conda_env_name} \n`;

    let cmd = 'pip3 install';
    cmd += ' -i https://mirrors.aliyun.com/pypi/simple/' ? config.api.use_mirror : '';
    cmd += 'torch torchvision torchaudio \n';

    const terminal = spawn('sh', [], {
        stdio: ['pipe', 'inherit', 'inherit']
    });
    terminal.stdin.write(activate);
    terminal.stdin.write(cmd);

    if (!existsSync('./plugins/yunzai-fish-speech-plugin/fish-speech')) {
        if (!cloneFishSpeech()) { throw new Error('拉取 fish-speech 仓库失败'); };
    }

    const cd = 'cd ./plugins/yunzai-fish-speech-plugin/fish/speech \n';
    
    let install = 'pip3 install';
    install += ' -i https://mirrors.aliyun.com/pypi/simple/' ? config.api.use_mirror : '';
    install += ' -e .[stable]'

    terminal.stdin.write(cd);
    terminal.stdin.write(install);
    terminal.stdin.end();
    await new Promise((resolve, _reject) => {
        terminal.on('exit', () => { resolve() })
    });

    return true;
}

const checkDebian = async () => {
    try {
        const data = await readFile('/etc/os-release', 'utf8');
    } catch (err) {
        return;
    }
    if (data.includes('ID=debian') || data.includes('ID_LIKE=debian')) {
        const cmd = 'apt update && apt install -y libsox-dev ffmpeg';
        exec(cmd, (_error, _stdout, _stderr) => {
            if (_stdout.includes('are you root?')) {
                throw new Error('暂不支持在非 root 环境下执行，后续将寻找方式支持');
            } else if (_stdout.includes('It is held by process')) {
                throw new Error('apt 被占用，请稍后再试');
            } else if (_stdout.includes('Unable to fetch some archives')) {
                throw new Error('无法连接 apt 源，请检查网络连接或更换 apt 源');
            } else {
                throw new Error(`未知错误: ${_stdout}`);
            }
        });
    };
}

const pullModel = async (config) => {
    let activate = config.env.conda_env_path || 'conda';
    activate += `activate ${config.env.conda_env_name} \n`;

    const cd = 'cd ./plugins/yunzai-fish-speech-plugin/fish-speech \n';
    let pull = 'HF_ENDPOINT=https://hf-mirror.com' ? config.api.use_mirror : '';
    pull += 'huggingface-cli download fishaudio/fish-speech-1.4 --local-dir checkpoints/fish-speech-1.4 \n';

    const terminal = spawn('sh', [], {
        stdio: ['pipe', 'inherit', 'inherit']
    });
    terminal.stdin.write(activate);
    terminal.stdin.write(cd);
    terminal.stdin.end();
    await new Promise((resolve, _reject) => {
        terminal.on('exit', () => { resolve() })
    });
}

export const Install = async (config) => {
    const system = getSystemType();
    if (system === 'Linux') {
        await checkDebian();

        let cond = await checkConda(config)
        if (!cond) { throw new Error('未找到 conda 环境，请检查 conda 是否安装或配置环境变量'); };

        cond = await createCondaEnv(config);
        if (!cond) { throw new Error('创建 conda 环境失败'); };

        cond = await installCondaPkg(config);
        if (!cond) { throw new Error('配置 conda 环境失败'); };

        await pullModel(config);
    }
}
