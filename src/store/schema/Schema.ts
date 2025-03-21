export const BusinessSchema = {
    version: 0,
    title: 'business',
    description: 'A business schema',
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100,
        },
        name: {
            type: 'string',
        },
    },
};

export const ArticleSchema = {
    version: 0,
    title: 'article',
    description: 'An article schema',
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100,
        },
        name: {
            type: 'string',
        },
        qty: {
            type: 'number',
        },
        selling_price: {
            type: 'number',
        },
        business_id: {
            type: 'string',
            maxLength: 100,
        },
    },
};