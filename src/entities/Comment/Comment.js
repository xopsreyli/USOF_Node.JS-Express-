export default class Comment {
    #id
    #author
    #postId
    #publishDate
    #content
    #status

    constructor(id, author, postId, publishDate, content, status) {
        this.#id = id
        this.#author = author
        this.#postId = postId
        this.#publishDate = publishDate
        this.#content = content
        this.#status = status
    }

    static create(postId, content) {
        return new Comment(null, null, postId, null, content, null)
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

    get postId() {
        return this.#postId;
    }

    set postId(value) {
        this.#postId = value;
    }

    get publishDate() {
        return this.#publishDate;
    }

    set publishDate(value) {
        this.#publishDate = value;
    }

    get content() {
        return this.#content;
    }

    set content(value) {
        this.#content = value;
    }

    get status() {
        return this.#status;
    }

    set status(value) {
        this.#status = value;
    }

    toJSON() {
        return {
            id: this.#id,
            author: this.#author,
            postId: this.#postId,
            publishDate: this.#publishDate,
            content: this.#content,
        }
    }
}
