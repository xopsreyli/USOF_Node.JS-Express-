import jwt from 'jsonwebtoken'

export default (isAuthRequired = true) => (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        if (isAuthRequired) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized: No token provided',
            })
        }

        req.user = null
        return next()
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 403,
                message: 'Forbidden: Token is invalid'
            })
        }

        req.user = user
        next()
    })
}
