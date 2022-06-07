const { infoLog, errorLog, warningLog } = require(`${__basedir}/utilities`);

module.exports = {
    name: ["testlogs"],
    developer: true,
    usage: [],
    async execute() {
        infoLog("TEST INFORMATION", `${__dirname}/${__filename}.js`, "TEST-INFO");
        errorLog([1, 2], `${__dirname}/${__filename}.js`, "1", "NOT A REAL ERROR", "TEST-ERROR", "TEST-ERROR");
        warningLog("TEST WARNING", `${__dirname}/${__filename}.js`, "NOT A REAL WARNING", "TEST-WARNING", "TEST-WARNING");
        return;
    }
};