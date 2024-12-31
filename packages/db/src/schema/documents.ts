// model Documents {
//   id   Int    @id @default(autoincrement())
//   name String @unique
//   data Bytes
// }

import { customType, pgTable, serial, text } from 'drizzle-orm/pg-core'

const bytea = customType<{ data: Buffer; default: false }>({
  dataType() {
    return 'bytea'
  },
})

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  name: text('name').unique(),
  data: bytea('data'),
})
