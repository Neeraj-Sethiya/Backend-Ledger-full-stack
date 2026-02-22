const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlacklistModel = require("../models/blacklist.model")


const userRegisterController = async (req, res) => {
    const {email, name, password} = req.body;

    const isExist = await userModel.findOne({
        email: email,
    })

    if(isExist){
        return res.status(422).json({
            message: "user already exists with this email",
            status: "failed",
        })
    }

    const user = await userModel.create({
        email, password, name
    })

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"});

    res.cookie("token",token);

    res.status(201).json({
        message: "user created successfully",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
        },
        token,
    })

}

const userLoginController = async (req, res) => {
    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select("+password systemUser");

    if(!user){
        return res.status(401).json({
            message: "Invalid email",
        })
    }

    const isValid = await user.comparePassword(password);

    if(!isValid){
        return res.status(401).json({
            message: "Incorrect Password",
        })
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"});

    res.cookie("token",token);

    res.status(200).json({
        message: "logged in successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            systemUser: user.systemUser,
        },
        token
    })

    await emailService.userRegistrationEmail(user.email, user.name);
}

const userLogoutController = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(200).json({
            message: "logged out successfully",
        })
    }

    res.clearCookie("token");
    await tokenBlacklistModel.create({
        token,
    })
    
    res.status(200).json({
        message: "logged out successfully",
    })
}

module.exports = { userRegisterController, userLoginController, userLogoutController};