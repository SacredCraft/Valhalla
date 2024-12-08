export type LifeCycle = 'beforeInit' | 'afterInit'

export const lifeCycle: Record<LifeCycle, (() => void)[]> = {
  beforeInit: [],
  afterInit: [],
}

export const registerLifeCycle = (key: LifeCycle, fn: () => void) => {
  lifeCycle[key].push(fn)
}

export const runLifeCycle = (key: LifeCycle) => {
  lifeCycle[key].forEach((fn) => fn())
}

export const initLifeCycle = () => {
  runLifeCycle('beforeInit')
  runLifeCycle('afterInit')
}
