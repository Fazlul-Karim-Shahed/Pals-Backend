

const fs = require('fs');
const path = require('path');
const { DepartmentModel } = require("../../Models/DepartmentModel");
const formidable = require('formidable');
const { formDataToObj } = require('../../Functions/formDataToObj');
const { saveAndGetFile } = require('../../Functions/SaveAndGetFile');
const { cleanObject } = require('../../Functions/cleanObject');


const createDepartment = async (req, res) => {

    const form = new formidable.IncomingForm();
    form.keepExtensions = true


    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send(err);
        }

        fields = cleanObject(formDataToObj(fields));

        let department = new DepartmentModel(fields)


        let promotionalImage = files.promotionalImage ? saveAndGetFile(files.promotionalImage[0]) : null


        saveAndGetFile(files.featureImage[0]).then(featureImage => {

            department.featureImage = featureImage

            if (promotionalImage) {

                promotionalImage.then(promotionalImage => {
                    
                    department.promotionalImage = promotionalImage

                    department.save()
                        .then(department => {
                            res.send({ message: 'Department created successfully', error: false, data: department });
                        })
                        .catch(err => {
                            res.send({ message: 'Something went wrong', error: true, data: err.message });
                        });
                })
            }
            else {
                department.save()
                    .then(department => {
                        res.send({ message: 'Department created successfully', error: false, data: department });
                    })
                    .catch(err => {
                        res.send({ message: 'Something went wrong', error: true, data: err.message });
                    });
            }

        })

    });



}

module.exports.createDepartment = createDepartment

// const department = new DepartmentModel({
//     name: fields.name,
//     description: fields.description,
//     featureImage: {
//         contentType: file.mimeType,
//         name: file.name,
//         data: fs.readFileSync(newPath)
//     },
//     status: fields.status,
//     verified: fields.verified,
//     promotionalImage: {
//         contentType: fields.promotionalImageContentType,
//         name: fields.promotionalImageName,
//         data: fs.readFileSync(fields.promotionalImagePath)
//     },
//     promotionalDescription: fields.promotionalDescription,
//     promotionalLink: fields.promotionalLink
// });

// department.save()
//     .then(department => {
//         res.send({ message: 'Department created successfully', error: false, data: department });
//     })
//     .catch(err => {
//         res.send({ message: 'Something went wrong', error: true, data: err.message });
//     });