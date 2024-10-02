// Description: 请求 API 返回音频
// Autor: oldcitynight
// Last-change: 2024/9/30 18:21
import fetch from 'node-fetch';
import msgpack from '@msgpack/msgpack';

// 参考音频格式
export class Reference {
    constructor() {
        this.audio = Buffer;
        this.text = String;
    }
}

export class Params {
    constructor(config = {}) {
        this.text = "你好呀，做一个测试"; // 生成音频的内容
        this.references = undefined; // 参考音频
        this.reference_id = undefined; // 参考模型 id
        this.normalize = true; // 是否对音频进行归一化处理
        this.format = "wav"; // 音频格式，可选 wav, mp3, flac
        this.mp3_bitrate = 64; // mp3 格式的比特率
        this.opus_bitrate = -1000; // opus 格式的比特率
        this.max_new_tokens = 1024; // 最大生成 token 数
        this.chunk_length = 100; // 合成的块长度
        this.top_p = 0.7; // top-p 采样参数
        this.repetition_penalty = 1.2; // 重复惩罚参数
        this.temperature = 0.7; // 采样温度?
        this.speaker = undefined; // 用于语音合成的说话人 ID
        this.emotion = undefined; // 说话人情感
        this.streaming = false; // 是否启用流式合成

        if (config) {
            Object.assign(this, config.params);
        }
    }
}

export const RequestForAudio = async (params, config) => {
    let url = config.api.api_url;

    url += url.endsWith('/') ? 'v1/tts' : '/v1/tts';

    let options = {
        method: 'POST',
        headers: {
            "authorization": "Bearer YOUR_API_KEY",
            'Content-Type': 'application/msgpack',
        },
        body: msgpack.encode(params),
    };

    const res = await fetch(url, options);

    if (res.status !== 200) {
        throw new Error(`请求失败，错误信息：${res.statusText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
}
