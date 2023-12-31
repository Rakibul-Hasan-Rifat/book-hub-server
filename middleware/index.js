import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv({ path: '../.env' })

const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).send('You are not an authorized user!!');
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).send('You don\'t have the data access!!');
        }
        if (decoded.email === req.query.email) return next()
    })
}

export { verifyToken }