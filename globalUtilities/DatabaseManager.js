class DatabaseManager {
    async find(schema, searchParams, createIfNotFound) {
        let databaseEntry = await schema.findOne(
            searchParams,
        );

        if (databaseEntry === null) {
            if (createIfNotFound === false) return null;

            databaseEntry = await schema.create(searchParams);
        }

        return databaseEntry;
    }

    create(schema, params) {
        return schema.create(
            params,
        );
    }
}

module.exports = {
    DatabaseManager,
};
