const express = require("express");


const app = express();

app.get("/", (req, res) => {
    console.log("App was pinged.");
    return res.send("Hello");
});

const server = app.listen(process.env.PORT || 8000, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`App listening at https://${host}:${port}`);
});
