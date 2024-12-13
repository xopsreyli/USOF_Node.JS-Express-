import {ADMIN_ROLE} from "../enums/UserRoleEnum.js"

export default (req, res, next) => {
    if (req.user.role !== ADMIN_ROLE) {
        return res.status(403).json({
            status: 403,
            message: 'You do not have permission to access this resource'
        })
    }

    next()
}
