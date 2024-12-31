import { Database, DatabaseConfiguration } from '@hocuspocus/extension-database'

import { db, desc, eq } from '@valhalla/db'
import { documents } from '@valhalla/db/schema'

export class ValhallaDatabase extends Database {
  configuration: DatabaseConfiguration = {
    fetch: async ({ documentName }) => {
      return new Promise((resolve, reject) => {
        db.select()
          .from(documents)
          .where(eq(documents.name, documentName))
          .orderBy(desc(documents.id))
          .then((row) => {
            resolve(row[0]?.data)
          })
          .catch(reject)
      })
    },
    store: async ({ documentName, state }) => {
      await db
        .insert(documents)
        .values({
          name: documentName,
          data: state,
        })
        .onConflictDoUpdate({
          target: documents.name,
          set: {
            data: state,
          },
        })
    },
  }

  constructor(configuration?: Partial<DatabaseConfiguration>) {
    super({
      ...configuration,
    })
  }
}
