import { z } from 'zod'

import { matchContextSchema } from '@valhalla/core/schema/layout'

export const moveFileInput = matchContextSchema.extend({
  newPath: z.string(),
})

export const renameFileInput = matchContextSchema.extend({
  newName: z.string(),
})

export const uploadFileInput = z.object({
  resourceName: z.string(),
  resourceFolder: z.string(),
  targetPath: z.string(),
  file: z.instanceof(File),
})

export type RenameFileInput = z.infer<typeof renameFileInput>
export type MoveFileInput = z.infer<typeof moveFileInput>
export type UploadFileInput = z.infer<typeof uploadFileInput>
