

const { EventModel } = require("../../Models/EventModel")


const getAllEvents = async (req, res) => {

    let event = await EventModel.find()

    if (event.length != 0) {

        res.status(200).send({ message: 'All event', error: false, data: event })
    }
    else {
        res.send({ message: 'No event found', error: true })
    }


}
 
module.exports.getAllEvents = getAllEvents;