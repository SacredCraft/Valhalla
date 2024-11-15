import path from 'path'

const cwd = path.resolve(process.cwd(), '../..')

const resolvePath = (...paths: string[]) => path.resolve(cwd, ...paths)

export { cwd, resolvePath }
