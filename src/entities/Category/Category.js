export default class Category {
    #id
    #title
    #description
    #numberOfPosts

    constructor(id, title, description, numberOfPosts) {
        this.#id = id
        this.#title = title
        this.#description = description
        this.#numberOfPosts = numberOfPosts
    }

    static create(title, description) {
        return new Category(null, title, description, null)
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get title() {
        return this.#title;
    }

    set title(value) {
        this.#title = value;
    }

    get description() {
        return this.#description;
    }

    set description(value) {
        this.#description = value;
    }

    get numberOfPosts() {
        return this.#numberOfPosts;
    }

    set numberOfPosts(value) {
        this.#numberOfPosts = value;
    }

    toJSON() {
        return {
            id: this.#id,
            title: this.#title,
            description: this.#description,
            numberOfPosts: this.#numberOfPosts
        }
    }
}
