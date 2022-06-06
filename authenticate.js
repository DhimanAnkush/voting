require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    return new Promise((res, rej) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
            if (err) return rej(err);
            res(decoded);
        })
    })
}

module.exports = async (req, res, next) => {

    if (!req?.headers?.authorization)
        return res.status(400).send({ msg: "Please provide a valid token" });

    const bearerToken = req.headers.authorization;

    if (!bearerToken.startsWith("Bearer "))
        return res.status(400).send({ msg: "Please provide a valid token" });

    const token = bearerToken.split(" ")[1];
    let user;

    try {
        user = await verifyToken(token)
    }
    catch(err) {
        return res.status(401).send({msg : "The token is not valid"});
    }   

    req.user = user.user;
    next();
}