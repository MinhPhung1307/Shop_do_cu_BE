const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService');
const { sendVerificationEmail } = require('./emailService');


const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, address, phone } = newUser;
        try {
            const CheckEmail = await User.findOne({email})
            if(CheckEmail !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is alrealy'
                })
            }
            const hash = bcrypt.hashSync(password, 10);
            const createdUser = new User({
                name, 
                email, 
                password: hash, 
                address,
                phone
            });
            await createdUser.save();
            const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const link = `http://localhost:3000/verify-email/${token}`;
            sendVerificationEmail(email, link);
            if(createdUser) {
                resolve({
                    status: 'OK',
                    message: 'Vui lòng kiểm tra email để xác thực.',
                    data: createdUser
                }) 
            }
        } catch (error) {
            reject(error)
        }
    })
}

const verifyEmail = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if(!user) {
                resolve({
                    status: 'ERR',
                    title: 'Xác minh thất bại!',
                    message: 'Rất tiếc, chúng tôi không thể xác thực email của bạn. Vui lòng kiểm tra lại thông tin hoặc thử lại sau.'
                })
            }
            if(user.isVerified) {
                resolve({
                    status: 'OK',
                    title: 'Xác minh thành công!',               
                    message: 'Email của bạn đã được xác minh trước đó. Tài khoản của bạn hiện đang được kích hoạt và sẵn sàng sử dụng.',

                })
            }
            user.isVerified = true;
            await user.save();
            resolve({
                status: 'OK',
                title: 'Xác minh thành công!',
                message: 'Email của bạn đã được xác minh thành công. Tài khoản của bạn hiện đã được kích hoạt và sẵn sàng sử dụng.',
                data: user
            }) 
        } catch (error) {
            resolve({
                status: 'ERR',
                title: 'Xác minh thất bại!',
                message: 'Rất tiếc, chúng tôi không thể xác thực email của bạn. Vui lòng kiểm tra lại thông tin hoặc thử lại sau.'
            })
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            const user = await User.findOne({email})
            if(user === null) {
                resolve({
                    status: 'ERR',
                    message: 'Tài khoản không tồn tại.'
                })
            }
            if(!user.isVerified) {
                resolve({
                    status: 'ERR',
                    message: 'Email chưa được xác thực. Vui lòng kiểm tra hộp thư và xác thực email trước khi đăng nhập.'
                })
            }
            if(!user.isAdmin) {
                const comparePassword = bcrypt.compareSync(password, user.password);
                if(!comparePassword) {
                    resolve({
                        status: 'ERR',
                        message: 'Email hoặc mật khẩu không đúng.'
                    })
                }      
            }
            const access_token = await genneralAccessToken({
                id: user._id,
                isAdmin: user.isAdmin
            })
            const refresh_token = await genneralRefreshToken({
                id: user._id,
                isAdmin: user.isAdmin
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
    verifyEmail,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
}