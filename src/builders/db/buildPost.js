import Post from "../../entities/Post/Post.js"

export default (obj, author, categories) => {
    return new Post(
        obj.id,
        author,
        obj.title,
        obj.publish_date,
        obj.status,
        obj.content,
        obj.rating,
        categories,
    )
}