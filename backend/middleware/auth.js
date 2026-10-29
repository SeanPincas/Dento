import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorized. Login Again",
        });
    }

    try {
        console.log("Incoming token:", token);
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded:", token_decode);

        if (!req.body) {req.body = {};}
        req.body.userId = token_decode.id;
        
        next();
    } catch (error) {
        return res.json({
            success: false,
            message: "Error Token",
        });
    }
};

export default authMiddleware;
