const { createEvent } = require("../Controllers/EventControllers/createEvent");
const { deleteEvent } = require("../Controllers/EventControllers/deleteEvent");
const { getAllEvents } = require("../Controllers/EventControllers/getAllEvents");
const { roleCheck } = require("../Middlewares/roleCheck");

const router = require("express").Router();

router.get("/", getAllEvents);
router.post("/", roleCheck(["admin"]), createEvent);
router.delete("/:eventId", roleCheck(["admin"]), deleteEvent);

module.exports = router;
