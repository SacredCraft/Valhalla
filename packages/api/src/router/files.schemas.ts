import { z } from 'zod'

import { matchContextSchema } from '@valhalla/core/schema/layout'

export const moveFileInput = matchContextSchema.extend({
  newPath: z.string(),
})

export const renameFileInput = matchContextSchema.extend({
  newName: z.string(),
})

export type RenameFileInput = z.infer<typeof renameFileInput>
export type MoveFileInput = z.infer<typeof moveFileInput>
