const errorIds = {
    1: "MISSING PERMISSIONS",
    2: "MISSING ROLE",
    3: "MISSING CHANNEL",
    4: "MISSING DATABASE TABLE",
    5: "MISSING DATABASE ENTRY",
    6: "INCORRECT DATABASE ID",
    7: "MISSING MESSAGE",
    8: "INCORRECT ID (ROLE, CHANNEL, MESSAGE, USER)",
    9: "MISSING USER",
    10: "UNHANDLED REJECTION"
};

const date = new Date(new Date());

async function errorLog(errorId, errorOriginated, errorLevel, errorSolution, errorType, errorDetail) {
    let errorString = "";

    errorId.forEach(id => {
        errorString += `${errorIds[id]} `;
    });

    const logText = [
        "-----ERROR-START-----",
        `Level: ${errorLevel}`,
        `ID: ${errorId}`,
        `Error: ${errorString || "General Purpose Error (errorId not found)"}`,
        `Details: ${errorDetail || "None."}`,
        `Type: ${errorType}`,
        `Origin: ${errorOriginated}`,
        `Date: ${date.toUTCString()}`,
        `Possible solution(s): ${errorSolution}`,
        "-----ERROR-END------",
        "\n\n"
    ];

    logText.forEach(log => {
        console.log(log);
    });

    return logText;
}

async function infoLog(info, infoOriginated, infoType, infoDetail) {
    const logText = [
        "-----INFO-START-----",
        `Info: ${info || "No info given"}`,
        `Details: ${infoDetail || "None."}`,
        `Type: ${infoType}`,
        `Origin: ${infoOriginated}`,
        `Date: ${date.toUTCString()}`,
        "-----INFO-END-----",
        "\n\n"
    ];

    logText.forEach(log => {
        console.log(log);
    });

    return; 
}

async function warningLog(warning, warningOrigin, warningSolution, warningType, warningDetail) {
    const logText = [
        "-----WARNING-START-----",
        `Warning: ${warning || "No warning given"}`,
        `Details: ${warningDetail || "None."}`,
        `Type: ${warningType}`,
        `Origin: ${warningOrigin}`,
        `Date: ${date.toUTCString()}`,
        `Possible solution(s): ${warningSolution}`,
        "-----WARNING-END-----",
        "\n\n"
    ];

    logText.forEach(log => {
        console.log(log);
    });

    return; 
}

module.exports = {
    errorLog,
    infoLog,
    warningLog,
};