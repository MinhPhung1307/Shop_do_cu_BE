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
            const comparePassword = bcrypt.compareSync(password, user.password);
            if(!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'Email hoặc mật khẩu không đúng.'
                })
            }   
            if(!user.state) {
                resolve({
                    status: 'ERR',
                    message: 'Tài khoản của bạn hiện đang bị khóa.'
                })
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
                message: 'Đăng nhập thành công',
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
                message: 'Cập nhật thông tin thành công',
                data: updatedUser
            }) 
        } catch (error) {
            reject(error)
        }
    })
}

const updatePassword = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { curPassword, newPassword } = data
            const user = await User.findOne({_id: id})
            if(user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(curPassword, user.password);
            if(!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'Mật khẩu cũ không đúng.'
                })
            }
            else {
                const hashPassword = bcrypt.hashSync(newPassword, 10);
                await User.findByIdAndUpdate(id, {password : hashPassword}, { new: true });
            }
            resolve({
                status: 'OK',
                message: 'Cập nhập mật khẩu thành công',
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
                message: 'Xóa người dùng thành công',
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
                message: 'Cập nhật thành công',
                data: user
            }) 
        } catch (error) {
            reject(error)
        }
    })
}

const updateStateUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({_id: id})
            if(user === null) {
                resolve({
                    status: 'OK',
                    message: 'Người dùng không được xác định'
                })
            }
            await User.findByIdAndUpdate(id, {state : !user.state}, { new: true });
            resolve({
                status: 'OK',
                message: 'Cập nhập trạng thái thành công',
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
    updatePassword,
    updateStateUser
}