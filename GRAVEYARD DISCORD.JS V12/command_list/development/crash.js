module.exports = {
    name: ["crash"],
    description: "Sends an unhandled error.",
    developer: true,
    
    usage: [
    ],

    async execute () {
        throw "Intentionally causing an error.";
    }
};
