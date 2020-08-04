import express from "express"
import db from "../database/connection"

const router = express.Router()

router.get("/", async (req, res, next) => {
  const totalConn = await db("connections").count("* as total")
  const {total} = totalConn[0]

  res.json({total})
})

router.post("/", async (req, res, next) => {
  const { user_id } = req.body

  await db("connections").insert({
    user_id
  })

  res.status(201).send()
})

module.exports = router
