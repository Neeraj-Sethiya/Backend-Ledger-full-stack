const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");


const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Token Unthorized",
        })
    }
    
    const isBlacklisted = await tokenBlacklistModel.findOne({token});

    if(isBlacklisted){
        return res.status(401).json({
            message: "Unthorized, token is Invalid",
        })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);

        req.user = user;
        return next()
        
    } catch (err) {
        res.status(401).json({
            message: "tum galat banda hai",
        })
    }
    

}

async function authMiddlewareSystemUser(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Token Unthorized",
        })
    }

    const isBlacklisted = await tokenBlacklistModel.findOne({token});

    if(isBlacklisted){
        return res.status(401).json({
            message: "Unthorized, token is Invalid",
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("+systemUser");
        if(!user.systemUser){
            return res.status(403).json({
                success: false,
                message: "Forbidden, you are not system user",
            })
        }
        req.user = user;
        return next()
    } catch (err) {
        res.status(401).json({
            message: "tum galat banda hai",
        })
    }
}

module.exports = {authMiddleware, authMiddlewareSystemUser};