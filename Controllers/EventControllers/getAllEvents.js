const { EventModel } = require("../../Models/EventModel");

const getAllEvents = async (req, res) => {
    console.log(req.params);

    const today = new Date();

    let event = await EventModel.find(
        req.params && req.params.today != 'undefined'
            ? {
                  startDate: { $lte: today },
                  endDate: { $gte: today },
              }
            : {}
    );

    if (event.length != 0) {
        res.status(200).send({ message: "All event", error: false, data: event });
    } else {
        res.send({ message: "No event found", error: true });
    }
};

module.exports.getAllEvents = getAllEvents;
