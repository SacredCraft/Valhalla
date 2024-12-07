import { z } from 'zod'

import { matchContextSchema } from '@valhalla/core/schema/layout'

export const matchLayoutInput = matchContextSchema

export type MatchLayoutInput = z.infer<typeof matchLayoutInput>
