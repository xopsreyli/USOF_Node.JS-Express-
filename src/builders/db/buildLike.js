import Like from "../../entities/Like/Like.js"

export default (obj, author) => {
    return new Like(
        obj.id,
        author,
        obj.publish_date,
        obj.entity_id,
        obj.type,
    )
}