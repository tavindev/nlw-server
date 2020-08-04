import express from "express"
import cors from "cors"

const app = express();

const index = require("./routes/index")
const classes = require("./routes/classes")
const connections = require("./routes/connections")

app.use(cors())
app.use(express.json())

// Definindo Rotas
app.use("/", index)
app.use("/classes", classes)
app.use("/connections", connections)

app.listen(5000)
