import Comment from "../../entities/Comment/Comment.js"

export default (obj, author) => {
    return new Comment(
        obj.id,
        author,
        obj.post_id,
        obj.publish_date,
        obj.content,
    )
}
