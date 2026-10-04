require("dotenv").config()
const express = require("express");
const cors = require("cors");
const dbConnection = require("./configaration/dbConnection");
const routes = require("./routes");
const dns = require("node:dns/promises");


const app = express();
const PORT = process.env.PORT || 8000;

dns.setServers(["8.8.8.8", "8.8.4.4"]);
app.use(cors());
app.use(express.json());
app.use(routes);

app.get("/", function(req, res) {
    res.send("auth API");
});

async function startServer() {
await dbConnection();

app.listen(PORT, () => {
    console.log(`Server is running on: ${PORT}`);
});

}

startServer().catch((error) => {
    console.error("failed to startServer", error.message);
    process.exit(1);
})

