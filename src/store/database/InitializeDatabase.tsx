import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageMemory } from 'rxdb/plugins/memory';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

import { BusinessSchema, ArticleSchema } from '../schema/Schema';

export const STORAGE = getRxStorageMemory();
const dbName = 'businessappdatabase';

export const businessCollectionName = 'business';
export const articleCollectionName = 'article';

const isDevelopment = process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true';

const initializeDB = async () => {
  if (isDevelopment) {
    addRxPlugin(RxDBDevModePlugin);
  }

  let db: any;

  try {
    db = await createRxDatabase({
      name: dbName,
      storage: STORAGE,
      multiInstance: false,
      ignoreDuplicate: true,
    });
  } catch (err) {
    console.log('ERROR CREATING DATABASE', err);
  }

  try {
    await db.addCollections({
      [businessCollectionName]: {
        schema: BusinessSchema,
      },
      [articleCollectionName]: {
        schema: ArticleSchema,
      },
    });
  } catch (err) {
    console.log('ERROR CREATING COLLECTION', err);
  }

  await db[businessCollectionName].insert({
    id: `business_${Date.now()}`,
    name: 'Sample Business',
  });

  await db[articleCollectionName].insert({
    id: `article_${Date.now()}`,
    name: 'Sample Article',
    qty: 10,
    selling_price: 100,
    business_id: `business_${Date.now()}`,
  });

  return db;
};

export default initializeDB;