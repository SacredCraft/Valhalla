import { Configuration, Extension } from '@hocuspocus/server'

import { ValhallaAuth } from './auth'
import { ValhallaDatabase } from './database'

export const extensions = [
  new ValhallaDatabase(),
  new ValhallaAuth(),
] as Extension[]

export const configuration = (
  configuration?: Partial<Configuration>
): Partial<Configuration> => {
  return {
    name: 'ValhallaCollaboration',
    extensions,
    ...configuration,
  }
}
