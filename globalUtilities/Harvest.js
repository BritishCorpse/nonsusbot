class Harvest {
    constructor() {
        this.crops = {};
    }

    set(id, object) {
        this.crops[id] = object;

        return this.crops[id];
    }

    remove(id) {
        return delete this.crops[id];
    }

    get(id) {
        if (this.crops[id]) {
            return this.crops[id];
        }

        return null;

    }
}

module.exports = Harvest;
