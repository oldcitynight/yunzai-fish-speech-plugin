// Description: 管理 API
// Autor: oldcitynight
// Last-change: 2024/9/30 21:11
import { spawn } from 'child_process';
import { Socket } from 'net';

export const startAPI = async (config) => {
    
    // 修正 Windows 下 sh 不存在的问题
    const shell = process.platform === 'win32' ? 'powershell.exe' : 'sh';

    // 创建终端实例
    const terminal = spawn(shell, [], {
        stdio: ['pipe', 'inherit', 'inherit']
    });

    // 激活 conda 环境
    if (config.env.conda_env_path) {
        let cmd = config.env.conda_env_path;
        cmd += `activate ${config.env.conda_env_name}`;
        terminal.stdin.write(`${cmd}\n`);
    } else {
        terminal.stdin.write(`conda activate ${config.env.conda_env_name}\n`);
    }

    // 切换到 API 目录
    terminal.stdin.write(`cd ./plugins/yunzai-fish-speech-plugin/fish-speech\n`);

    // 启动 API
    let cmd = "python -m tools.api";
    cmd += ' --listen 127.0.0.1:8080 --decoder-config-name firefly_gan_vq';
    cmd += ' --llama-checkpoint-path "checkpoints/fish-speech-1.4"';
    cmd += ' --decoder-checkpoint-path "checkpoints/fish-speech-1.4/firefly-gan-vq-fsq-8x1024-21hz-generator.pth"';
    if (!config.generate.enable_gpu) {
        cmd += ' --device "cpu"';
    }
    if (config.api.enable_mirror) {
        cmd = 'HF_ENDPOINT=https://hf-mirror.com ' + cmd;
    }

    terminal.stdin.write(`${cmd}\n`);

    // 异步等待端口被占用
    await new Promise((resolve) => {
        let time = 0;
        const checkPort = () => {

            if (time > 360) { throw new Error('API 启动超时') }

            const client = new Socket();
            client.once('connect', () => {
                client.end();
                resolve();
            });
            client.once('error', () => {
                time += 0.5;
                setTimeout(checkPort, 500);
            });
            client.connect(8080, '127.0.0.1');
        };
        checkPort();
    });

    return terminal;
}

export const shutdownAPI = async (terminal) => {
    // 向终端发送 Ctrl+C 信号
    terminal.stdin.write('\x03');
    terminal.stdin.end();
    await new Promise((resolve, _reject) => {
        terminal.on('exit', () => { resolve() })
    });
}

export const restartAPI = async (terminal) => { 

    await shutdownAPI(terminal);
    return await startAPI();
}
