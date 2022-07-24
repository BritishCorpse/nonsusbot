class DatabaseManager {
    constructor() { }

    async find(schema, searchParams, createIfNotFound) {
        let databaseEntry = await schema.findOne(
            searchParams
        );

        if (databaseEntry === null) {
            if (createIfNotFound === false) return null;

            databaseEntry = await schema.create(searchParams);
        }
        
        return databaseEntry;
    }
}

module.exports = {
    DatabaseManager
};