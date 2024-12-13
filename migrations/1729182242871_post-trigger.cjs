exports.up = (pgm) => {
    pgm.sql(`
        CREATE OR REPLACE FUNCTION update_category_number_of_posts()
        RETURNS TRIGGER 
        AS $$
            BEGIN            
                IF TG_OP = 'INSERT' THEN
                    UPDATE categories SET number_of_posts = number_of_posts + 1 WHERE id = NEW.category_id;
                ELSEIF TG_OP = 'DELETE' THEN
                    UPDATE categories SET number_of_posts = number_of_posts - 1 WHERE id = OLD.category_id;
                END IF;
                RETURN NULL;
            END;
        $$ 
        LANGUAGE plpgsql;
    `)

    pgm.sql(`
        CREATE TRIGGER update_post_category
        AFTER INSERT OR DELETE ON post_category
        FOR EACH ROW EXECUTE FUNCTION update_category_number_of_posts();        
    `)
};

exports.down = (pgm) => {
    pgm.sql('DROP TRIGGER IF EXISTS update_post_category ON post_category;');
    pgm.sql('DROP FUNCTION IF EXISTS update_category_number_of_posts();');
};
