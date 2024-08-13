import {
  Database,
  DatabaseConfiguration,
} from "@hocuspocus/extension-database";
import { db } from "@sacred-craft/valhalla-database";

export class ValhallaDatabase extends Database {
  configuration: DatabaseConfiguration = {
    fetch: async ({ documentName }) => {
      return new Promise((resolve, reject) => {
        db.documents
          .findMany({
            where: {
              name: documentName,
            },
            orderBy: {
              id: "desc",
            },
            select: {
              data: true,
            },
          })
          .then((row) => {
            resolve((row as any[])[0]?.data);
          })
          .catch(reject);
      });
    },

    store: async ({ documentName, state }) => {
      await db.documents.upsert({
        where: {
          name: documentName,
        },
        update: {
          data: state,
        },
        create: {
          name: documentName,
          data: state,
        },
      });
    },
  };

  constructor(configuration?: Partial<DatabaseConfiguration>) {
    super({
      ...configuration,
    });
  }
}
