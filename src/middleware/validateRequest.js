export default (schema) => async (req, res, next) => {
    try {
        req.body = await schema.validateAsync(req.body)

        next()
    } catch (e) {
        res.status(400).json({
            status: 400,
            message: e.details[0].message
        })
    }
}
