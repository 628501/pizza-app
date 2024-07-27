import { UNAUTHORIZED } from "../Constants/httpStatus.js";
import authMid from "./auth.mid.js";

const adminMid = (req, res, next) => {
    if(!req.user.admin) {
        res.status(UNAUTHORIZED).send("Unauthorized access");
    }
    return next();
}

export default [authMid, adminMid];