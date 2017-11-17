/**
 * Created by admin on 2017/11/17.
 */
const model = require('..models');

const verifySelectExist = ({ code, name, value, text }) => {
    (async () => {
        try {
            let select = await model.select_list.findAll({
                where: {
                    $and: [
                        {
                            code : code
                        },
                        {
                            name : name
                        }
                    ],
                    $or: [
                        {
                            value : value
                        },
                        {
                            text: text
                        }
                    ]
                }
            });
            if (select.length) {
                return {
                    result: false,
                    code: 10001,
                    error: 'username or account has already exist'
                }
            } else {
                return {
                    result: true,
                    code: 200,
                    error: ''
                }
            }
        } catch (err) {
            return {
                result: false,
                code: 101,
                error: err
            }
        }
    })();
}

const addSelect = ({ code, name, value, text }) => {

}