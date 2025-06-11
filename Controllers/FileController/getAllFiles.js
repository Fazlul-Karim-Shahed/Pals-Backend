

const { CurriculumModel } = require("../../Models/CurriculumModel")
const fs = require('fs')
const path = require('path')
const { SubjectModel } = require("../../Models/SubjectModel")
const { ChapterModel } = require("../../Models/ChapterModel")
const { ModuleModel } = require("../../Models/ModuleModel")
const { AssignmentModel } = require("../../Models/AssignmentModel")
const { BatchModel } = require("../../Models/BatchModel")
const { BroadQuestionModel } = require("../../Models/BroadQuestionModel")
const { ExamModel } = require("../../Models/ExamModel")
const { FocusModel } = require("../../Models/FocusModel")
const { MCQModel } = require("../../Models/McqModel")
const { ResourceModel } = require("../../Models/ResourceModel")
const { TeacherModel } = require("../../Models/TeacherModel")

const getAllFiles = async (req, res) => {

    let filesInDatabase = []
    let allFiles = []

    await fs.readdir(path.join(process.cwd(), "uploads"), (err, files) => {
        if (!err) {
            files.map(file => allFiles.push(file))
        }
    })



    await CurriculumModel.find({}).then(data => {
        data.map(item => {
            item.outlines.map(file => {
                filesInDatabase.push(file.name)
            })
        })

    })

    await SubjectModel.find({}).then(data => {
        data.map(item => {
            item.outlines.map(file => {
                filesInDatabase.push(file.name)
            })

            item.materials.map(file => {
                filesInDatabase.push(file.name)
            })
        })

    })

    await ChapterModel.find({}).then(data => {
        data.map(item => {
            item.materials.map(file => {
                filesInDatabase.push(file.name)
            })
        })

    })

    await ModuleModel.find({}).then(data => {
        data.map(item => {
            item.materials.map(file => {
                filesInDatabase.push(file.name)
            })
        })

    })

    await AssignmentModel.find({}).then(data => {
        data.map(item => {
            item.answer.map(file => {
                filesInDatabase.push(file.name)
            })

            filesInDatabase.push(item.assignment.name)
        })

    })

    await BatchModel.find({}).then(data => {
        data.map(item => {
            item.announcements.map(announcements => {
                announcements.materials.map(file => {
                    filesInDatabase.push(file.name)
                })

            })
        })

    })


    await BroadQuestionModel.find({}).then(data => {
        data.map(item => {
            if (item.questionAttachment) filesInDatabase.push(item.questionAttachment.name)
            if (item.answerAttachment) filesInDatabase.push(item.answerAttachment.name)
        })

    })

    await MCQModel.find({}).then(data => {
        data.map(item => {
            if (item.questionAttachment) filesInDatabase.push(item.questionAttachment.name)
            if (item.answerAttachment) filesInDatabase.push(item.answerAttachment.name)
        })

    })



    await ExamModel.find({}).then(data => {
        data.map(item => {
            item.participants.map(file => {
                if (file.script) filesInDatabase.push(file.script.name)
            })

            if (item.solution) filesInDatabase.push(item.solution.name)
            if (item.attachment) filesInDatabase.push(item.attachment.name)
        })

    })


    await FocusModel.find({}).then(data => {
        data.map(item => {
            if (item.attachment) filesInDatabase.push(item.attachment.name)
        })

    })

    await ResourceModel.find({}).then(data => {
        data.map(item => {
            filesInDatabase.push(item.attachment.name)
        })

    })

    await TeacherModel.find({}).then(data => {
        data.map(item => {
            if (item.image) filesInDatabase.push(item.image.name)
        })

    })








    res.send({ message: 'All files in database', error: false, data: { filesInDatabase, allFiles } })




}

module.exports.getAllFiles = getAllFiles
