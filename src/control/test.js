const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');

const test = async () => {
    try {
        let data = await model.fitting.findAll({
            where: {

            },
            include: [
                {
                    model: model.use_record,
                    as: 'records',
                    include: [
                        {
                            model: model.user
                        }
                    ]
                }
            ]
        });
        console.log(data[0].records)
    } catch (err) {
        console.log(err)
    }
}

const test1 = async () => {
    try {
        let dd = await model.use_record.findAll({
            include: [
                {
                    model: model.user
                }
            ]
        });
        //let aa = await model.use_record.getUsers()
        console.log(dd[0])
    } catch (err) {
        console.log(err)
    }
}

test1()