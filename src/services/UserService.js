const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService');


const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, MSSV, password, confirmPassword, phone } = newUser;
        try {
            const CheckMSSV = await User.findOne({MSSV})
            if(CheckMSSV !== null) {
                resolve({
                    status: 'OK',
                    message: 'The MSSV is alrealy'
                })
            }
            const hash = bcrypt.hashSync(password, 10);
            const createdUser = await User.create({
                name, 
                MSSV, 
                password: hash, 
                phone
            })
            if(createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                }) 
            }
        } catch (error) {
            reject(error)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { MSSV, password } = userLogin;
        try {
            const CheckMSSV = await User.findOne({MSSV})
            if(CheckMSSV === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, CheckMSSV.password);
            if(!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The user or password is incorrect'
                })
            }      
            const access_token = await genneralAccessToken({
                id: CheckMSSV._id,
                isAdmin: CheckMSSV.isAdmin
            })
            const refresh_token = await genneralRefreshToken({
                id: CheckMSSV._id,
                isAdmin: CheckMSSV.isAdmin
            })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            }) 
        } catch (error) {
            reject(error)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const CheckUser = await User.findOne({_id: id})
            if(CheckUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            }) 
        } catch (error) {
            reject(error)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const CheckUser = await User.findOne({_id: id})
            if(CheckUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            await User.findByIdAndDelete(id);
            resolve({
                status: 'OK',
                message: 'delete user is success',
            }) 
        } catch (error) {
            reject(error)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'get all user is success',
                data: allUser
            }) 
        } catch (error) {
            reject(error)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({_id: id})
            if(user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: user
            }) 
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {    
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
}