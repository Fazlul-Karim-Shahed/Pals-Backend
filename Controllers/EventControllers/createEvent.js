const fs = require("fs");
const path = require("path");
const { EventModel } = require("../../Models/EventModel");
const formidable = require("formidable");
const { formDataToObj } = require("../../Functions/formDataToObj");
const { saveAndGetFile } = require("../../Functions/saveAndGetFile");
const { cleanObject } = require("../../Functions/cleanObject");

const createEvent = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send(err);
        }

        fields = cleanObject(formDataToObj(fields));

        let event = new EventModel(fields);

        let promotionalImage = files.promotionalImage ? saveAndGetFile(files.promotionalImage[0]) : null;

        if (promotionalImage) {
            promotionalImage.then((promotionalImage) => {
                event.promotionalImage = promotionalImage;

                event
                    .save()
                    .then((event) => {
                        res.send({ message: "image Slider created successfully", error: false, data: event });
                    })
                    .catch((err) => {
                        res.send({ message: err.message, error: true });
                    });
            });
        } else {
            event
                .save()
                .then((event) => {
                    res.send({ message: "image Slider created successfully", error: false, data: event });
                })
                .catch((err) => {
                    res.send({ message: err.message, error: true, data: err.message });
                });
        }
    });
};

module.exports.createEvent = createEvent;
