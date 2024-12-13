import User from "../../entities/User/User.js"

export default obj => {
    return new User(
        obj.id,
        obj.login,
        obj.password,
        obj.full_name,
        obj.email,
        obj.profile_picture,
        obj.rating,
        obj.role,
        obj.theme,
        obj.color_schema,
        obj.refresh_token,
        obj.is_confirmed,
    )
}
