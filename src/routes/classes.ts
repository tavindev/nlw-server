import express from "express"
import db from "../database/connection"
import hour_to_seconds from '../utils/hour_to_seconds'

const router = express.Router()

interface ScheduleItem {
  week_day: number,
  from: string,
  to: string
}

router.get("/", async (req, res, next) => {
  const filters = req.query

  const subject = filters.subject as string
  const week_day = filters.week_day as string
  const time = filters.time as string

  if (!filters.week_day || !filters.subject || !filters.time) {
    res.status(400).json({
      error: "Missing Required Infomations"
    })
  }

  const timeInSec = hour_to_seconds(time)

  const classes = await db("classes")
  .whereExists(function(){
    this.select("class_schedule.*")
        .from("class_schedule")
        .whereRaw("`class_schedule`.`class_id`")
        .whereRaw("`class_schedule`.`week_day` = ??", [Number(week_day)])
        .whereRaw("`class_schedule`.`from` <= ??", [timeInSec])
        .whereRaw("`class_schedule`.`to` > ??", [timeInSec])
  })
  .where("classes.subject", "=", subject)
  .join("users", "classes.user_id", "=", "users.id")
  .select(["classes.*", "users.*"])

  res.json(classes)
})

router.post("/", async (req, res, next) => {
  const {
    name,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
    schedule
  } = req.body

  const trx = await db.transaction()

  try {
    const user_id = (await trx('users').insert({
      name,
      avatar,
      whatsapp,
      bio
    }))[0]


    const class_id = (await trx("classes").insert({
      subject,
      cost,
      user_id
    }))[0]

    const classSchedule = schedule.map((i: ScheduleItem) => {
      return {
        week_day: i.week_day,
        from: hour_to_seconds(i.from),
        to: hour_to_seconds(i.to),
        class_id
      }
    })

    await trx("class_schedule").insert(classSchedule)

    await trx.commit();

    res.status(201).send()

  } catch (e) {
    await trx.rollback()

    res.status(400).json({
      error: "Unexpected error while creating new class"
    })
  }
})

module.exports = router
