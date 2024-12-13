export default class Post {
    #id
    #author
    #title
    #publishDate
    #status
    #content
    #rating
    #categories = []

    constructor(id, author, title, publishDate, status, content, rating, categories) {
        this.#id = id
        this.#author = author
        this.#title = title
        this.#publishDate = publishDate
        this.#status = status
        this.#content = content
        this.#rating = rating
        this.#categories = categories
    }

    static create(title, content) {
        return new Post(null, null, title, null, null, content, null, null)
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get author() {
        return this.#author;
    }

    set author(value) {
        this.#author = value;
    }

    get title() {
        return this.#title;
    }

    set title(value) {
        this.#title = value;
    }

    get publishDate() {
        return this.#publishDate;
    }

    set publishDate(value) {
        this.#publishDate = value;
    }

    get status() {
        return this.#status;
    }

    set status(value) {
        this.#status = value;
    }

    get content() {
        return this.#content;
    }

    set content(value) {
        this.#content = value;
    }

    get rating() {
        return this.#rating;
    }

    set rating(value) {
        this.#rating = value;
    }

    get categories() {
        return this.#categories;
    }

    set categories(value) {
        this.#categories = value;
    }

    toJSON() {
        return {
            id: this.#id,
            author: this.#author,
            title: this.#title,
            publishDate: this.#publishDate,
            status: this.#status,
            content: this.#content,
            rating: this.#rating,
            categories: this.#categories,
        }
    }
}
