import fs from 'node:fs'


let ret = []
const files = fs
  .readdirSync('./plugins/yunzai-fish-speech-plugin/apps')
  .filter((file) => file.endsWith('.js'))

  files.forEach((file) => {
    ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

logger.info('正在载入插件: Yunzai-Fish-Speech-Plugin') 

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')
  
  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
    }
    apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

logger.info('插件载入完毕: Yunzai-Fish-Speech-Plugin')

export { apps }
