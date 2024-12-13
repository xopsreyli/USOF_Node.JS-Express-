import Category from "../../entities/Category/Category.js"

export default (obj) => {
    return new Category(
        obj.id,
        obj.title,
        obj.description,
        obj.number_of_posts,
    )
}
