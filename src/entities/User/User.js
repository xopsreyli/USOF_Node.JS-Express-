export default class User {
    #id
    #login
    #password
    #fullName
    #email
    #profilePicture
    #rating
    #role
    #theme
    #colorSchema
    #refreshToken
    #isConfirmed

    constructor(id, login, password, fullName, email, profilePicture, rating, role, theme, colorSchema, refreshToken, isConfirmed) {
        this.#id = id
        this.#login = login
        this.#password = password
        this.#fullName = fullName
        this.#email = email
        this.#profilePicture = profilePicture
        this.#rating = rating
        this.#role = role
        this.#theme = theme
        this.#colorSchema = colorSchema
        this.#refreshToken = refreshToken
        this.#isConfirmed = isConfirmed
    }

    static create(login, password, email, role) {
        return new User(null, login, password, null, email, null, null, role, null, null, null, null)
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get login() {
        return this.#login;
    }

    set login(value) {
        this.#login = value;
    }

    get password() {
        return this.#password;
    }

    set password(value) {
        this.#password = value;
    }

    get fullName() {
        return this.#fullName;
    }

    set fullName(value) {
        this.#fullName = value;
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        this.#email = value;
    }

    get profilePicture() {
        return this.#profilePicture;
    }

    set profilePicture(value) {
        this.#profilePicture = value;
    }

    get rating() {
        return this.#rating;
    }

    set rating(value) {
        this.#rating = value;
    }

    get role() {
        return this.#role;
    }

    set role(value) {
        this.#role = value;
    }

    get theme() {
        return this.#theme;
    }

    set theme(value) {
        this.#theme = value;
    }

    get colorSchema() {
        return this.#colorSchema;
    }

    set colorSchema(value) {
        this.#colorSchema = value;
    }

    get refreshToken() {
        return this.#refreshToken;
    }

    set refreshToken(value) {
        this.#refreshToken = value;
    }

    get isConfirmed() {
        return this.#isConfirmed;
    }

    set isConfirmed(value) {
        this.#isConfirmed = value;
    }

    toJSON() {
        return {
            id: this.#id,
            login: this.#login,
            password: this.#password,
            fullName: this.#fullName,
            email: this.#email,
            profilePicture: this.#profilePicture,
            rating: this.#rating,
            role: this.#role,
            theme: this.#theme,
            colorSchema: this.#colorSchema,
            refreshToken: this.#refreshToken,
            isConfirmed: this.#isConfirmed,
        };
    }
}
