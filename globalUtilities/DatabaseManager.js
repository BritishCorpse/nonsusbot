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

    async findAll(schema, searchParams, createIfNotFound) {
        let databaseEntry = await schema.find(
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

    delete(schema, params) {
        return schema.deleteOne(
            params,
        );
    }
}

module.exports = {
    DatabaseManager,
};
