import path from 'path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import fs from 'fs-extra'
import yaml from 'yaml'
import { z } from 'zod'

import { resolvePath } from '@valhalla/utils/path'

import { Config } from './schema/configs'
import { systemConfigMeta } from './schema/system-config'

export * from './schema/system-config'

// 配置文件路径常量
const CONFIG_PATH = resolvePath('configs')

/**
 * 监听配置文件变更
 * @param path 配置文件路径
 * @param schema 配置文件验证模式
 * @param onUpdate 配置更新回调函数
 */
const watchConfig = <T extends Config>(
  config: T,
  onUpdate: (config: z.infer<T['content']>) => void
): void => {
  const watcher = chokidar.watch(resolvePath(CONFIG_PATH, config.path), {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100,
    },
  })

  watcher.on('change', async () => {
    try {
      const newConfig = loadConfig(config)
      onUpdate(newConfig)
      console.log(` ${chalk.green('✓')} 配置文件 ${config.name} 已重新加载`)
    } catch (error) {
      console.error(
        ` ${chalk.red('✗')} 重新加载配置文件 ${config.name} 失败:`,
        error
      )
    }
  })
}

/**
 * 将对象的 kebab-case 键转换为 camelCase
 */
const kebabToCamelCase = (obj: unknown): unknown => {
  if (typeof obj !== 'object' || obj === null) return obj

  if (Array.isArray(obj)) {
    return obj.map(kebabToCamelCase)
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
      kebabToCamelCase(value),
    ])
  )
}

/**
 * 加载并验证配置文件
 * @param path 配置文件路径
 * @param schema 配置文件验证模式
 * @returns 验证后的配置对象
 * @throws 当配置文件加载或验证失败时抛出错误
 */
const loadConfig = <T extends Config>(
  config: T,
  watch: boolean = false,
  defaultValue: unknown = {}
): z.infer<T['content']> => {
  try {
    let content: string
    try {
      content = fs.readFileSync(resolvePath(CONFIG_PATH, config.path), 'utf8')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // 如果文件不存在,创建目录和空文件
        const fullPath = resolvePath(CONFIG_PATH, config.path)
        const dir = path.dirname(fullPath)
        fs.ensureDirSync(dir)
        fs.writeFileSync(fullPath, yaml.stringify(defaultValue))
        content = yaml.stringify(defaultValue)
      } else {
        throw error
      }
    }

    // 先转换命名风格，再进行 schema 验证
    const rawConfig = yaml.parse(content)
    const camelCaseConfig = kebabToCamelCase(rawConfig)
    const parsedConfig = config.content.parse(camelCaseConfig)

    if (watch) {
      watchConfig(config, (newConfig) => {
        Object.assign(parsedConfig as object, newConfig)
      })
    }

    return parsedConfig
  } catch (error) {
    console.error(` ${chalk.red('✗')} 加载配置文件 ${config.name} 失败:`, error)
    throw error
  }
}

// 系统配置单例
const systemConfig = loadConfig(systemConfigMeta, true)

export { watchConfig, loadConfig }

export { systemConfig }
