export default class Like {
    #id
    #author
    #publishDate
    #entityId
    #type

    constructor(id, author, publishDate, entityId, type) {
        this.#id = id
        this.#author = author
        this.#publishDate = publishDate
        this.#entityId = entityId
        this.#type = type
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

    get publishDate() {
        return this.#publishDate;
    }

    set publishDate(value) {
        this.#publishDate = value;
    }

    get entityId() {
        return this.#entityId;
    }

    set entityId(value) {
        this.#entityId = value;
    }

    get type() {
        return this.#type;
    }

    set type(value) {
        this.#type = value;
    }

    toJSON() {
        return {
            id: this.#id,
            author: this.#author,
            publishDate: this.#publishDate,
            entityId: this.#entityId,
            type: this.#type,
        }
    }
}
