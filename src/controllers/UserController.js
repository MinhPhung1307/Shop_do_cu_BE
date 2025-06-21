const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');

const createUser = async (req, res) => {
    try {
        const { name, MSSV, password, confirmPassword, phone } = req.body;
        const isCheckMSSV =  MSSV.includes('@ut.edu.vn');
        if(!name || !MSSV || !password || !confirmPassword || !phone){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }else if(!isCheckMSSV) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is MSSV'
            });
        }else if(password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The password is equal confirmPassword'
            });
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { MSSV, password } = req.body;
        if( !MSSV || !password ){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }
        const response = await UserService.loginUser(req.body);
        const { refresh_token, ...newResponse } = response;
        res.cookie('refresh_token', refresh_token, {
            HttpOnly: true,
            Secure: true,
        })
        return res.status(200).json(newResponse)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if(!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user is required'
            });
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if(!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user is required'
            });
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
} 

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if(!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user is required'
            });
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
} 

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if(!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            });
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
} 

module.exports = {    
    createUser, 
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken
}