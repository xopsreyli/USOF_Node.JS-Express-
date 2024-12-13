exports.up = (pgm) => {
    pgm.sql(`
        CREATE OR REPLACE FUNCTION update_author_rating_on_like()
        RETURNS TRIGGER 
        AS $$
            DECLARE
                author_id INT;
            BEGIN
                IF TG_TABLE_NAME = 'post_likes' THEN 
                    SELECT user_id INTO author_id FROM posts WHERE id = NEW.entity_id;
                    IF NEW.type = 'like' THEN 
                        UPDATE posts SET rating = rating + 1 WHERE id = NEW.entity_id;
                    ELSEIF NEW.type = 'dislike' THEN 
                        UPDATE posts SET rating = rating - 1 WHERE id = NEW.entity_id;
                    END IF;
                ELSEIF TG_TABLE_NAME = 'comment_likes' THEN
                    SELECT user_id INTO author_id FROM comments WHERE id = NEW.entity_id;
                END IF;
            
                IF NEW.type = 'like' THEN
                    UPDATE users SET rating = rating + 1 WHERE id = author_id;
                ELSEIF NEW.type = 'dislike' THEN
                    UPDATE users SET rating = rating - 1 WHERE id = author_id;
                END IF;
                RETURN NULL;
            END;
        $$ 
        LANGUAGE plpgsql;
    `)

    pgm.sql(`
        CREATE OR REPLACE FUNCTION update_author_rating_on_unlike()
        RETURNS TRIGGER 
        AS $$
            DECLARE
                author_id INT;
            BEGIN
                IF TG_TABLE_NAME = 'post_likes' THEN 
                    SELECT user_id INTO author_id FROM posts WHERE id = OLD.entity_id;
                    IF OLD.type = 'like' THEN 
                        UPDATE posts SET rating = rating - 1 WHERE id = OLD.entity_id;
                    ELSEIF OLD.type = 'dislike' THEN 
                        UPDATE posts SET rating = rating + 1 WHERE id = OLD.entity_id;
                    END IF;
                ELSEIF TG_TABLE_NAME = 'comment_likes' THEN
                    SELECT user_id INTO author_id FROM comments WHERE id = OLD.entity_id;
                END IF;
            
                IF OLD.type = 'like' THEN
                    UPDATE users SET rating = rating - 1 WHERE id = author_id;
                ELSEIF OLD.type = 'dislike' THEN
                    UPDATE users SET rating = rating + 1 WHERE id = author_id;
                END IF;
                RETURN NULL;
            END;
        $$ 
        LANGUAGE plpgsql;
    `)

    pgm.sql(`
        CREATE TRIGGER like_post
        AFTER INSERT ON post_likes
        FOR EACH ROW EXECUTE FUNCTION update_author_rating_on_like();        
    `)

    pgm.sql(`
        CREATE TRIGGER like_comment
        AFTER INSERT ON comment_likes
        FOR EACH ROW EXECUTE FUNCTION update_author_rating_on_like();        
    `)

    pgm.sql(`
        CREATE TRIGGER unlike_post
        AFTER DELETE ON post_likes
        FOR EACH ROW EXECUTE FUNCTION update_author_rating_on_unlike();        
    `)

    pgm.sql(`
        CREATE TRIGGER unlike_comment
        AFTER DELETE ON comment_likes
        FOR EACH ROW EXECUTE FUNCTION update_author_rating_on_unlike();        
    `)
};

exports.down = (pgm) => {
    pgm.sql('DROP TRIGGER IF EXISTS like_post ON post_likes;');
    pgm.sql('DROP TRIGGER IF EXISTS like_comment ON comment_likes;');
    pgm.sql('DROP TRIGGER IF EXISTS unlike_post ON post_likes;');
    pgm.sql('DROP TRIGGER IF EXISTS unlike_comment ON comment_likes;');
    pgm.sql('DROP FUNCTION IF EXISTS update_author_rating_on_like();');
    pgm.sql('DROP FUNCTION IF EXISTS update_author_rating_on_unlike();');
};
