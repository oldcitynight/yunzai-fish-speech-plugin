// Description: 生成音频
// Autor: oldcitynight
// Last-change: 2024/9/30 22:36
import { Reference, Params, RequestForAudio } from './RequestAPI.js';
import { readFile, readdir, access } from 'fs/promises';

const buildRef = async (ref_id, voice_list, references, signal) => {
    // 暂时避免嵌套数组
    if (signal >= 2) {
        throw new Error('Not Allowed Method');
    }

    let reference = new Reference();
    if (typeof ref_id === 'number' && ref_id < voice_list.length) {
        reference.text = await readFile(`${customVoicePath}/${voice_list[ref_id]}.txt`, 'utf8');
        reference.audio = await readFile(`${customVoicePath}/${voice_list[ref_id]}.wav`);
    } else if (typeof ref_id === 'string' && voice_list.includes(ref_id)) {
        reference.text = await readFile(`${customVoicePath}/${ref_id}.txt`, 'utf8');
        reference.audio = await readFile(`${customVoicePath}/${ref_id}.wav`);
    } else if (Array.isArray(ref_id)) {
        for (let e of ref_id) {
            await buildRef(e, voice_list, references, signal + 1);
        }
    } else {
        throw new Error('Not Found Reference');
    }
    references.push(reference);
}

export const SimpleAudio = async (text, config) => {
    const reference = new Reference();
    reference.audio = await readFile(config.generate.default_voice_path);
    reference.text = config.generate.default_voice_text;

    const params = new Params(config);
    params.text = text;
    params.references = [reference];
    return await RequestForAudio(params, config);
}

export const MakeAudio = async (ref_id, text, config) => {
    const customVoicePath = `${config.generate.voice_path}/${ref_id}`;

    const list = await readdir(customVoicePath);
    const voice_list = [];
    
    for (const f of list) {
        let cond = f.endwith('.wav');
        cond = cond && await access(f.replace('.wav', '.txt'));
        if (cond) { voice_list.push(f.replace('.wav', '')) };
    }
    
    const params = new Params(config);
    params.text = text;
    params.references = [];
    await buildRef(ref_id, voice_list, params.references, 0);

    return await RequestForAudio(params, config);
}

export const customAudio = async (params, config) => {
    return await RequestForAudio(params, config);
}
