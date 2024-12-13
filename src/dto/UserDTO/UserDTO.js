export default class UserDTO {
    constructor(user) {
        this.id = user.id
        this.login = user.login
        this.fullName = user.fullName
        this.email = user.email
        this.profilePicture = user.profilePicture
        this.rating = user.rating
        this.role = user.role
        this.theme = user.theme
        this.colorSchema = user.colorSchema
    }
}
