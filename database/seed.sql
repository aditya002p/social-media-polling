-- Insert Sample Users
INSERT INTO users (id, email, password_hash, username, full_name, bio, is_verified, is_admin)
VALUES
    (uuid_generate_v4(), 'user1@example.com', 'hashedpassword1', 'user1', 'User One', 'Bio for user one', TRUE, FALSE),
    (uuid_generate_v4(), 'user2@example.com', 'hashedpassword2', 'user2', 'User Two', 'Bio for user two', FALSE, FALSE);

-- Insert Sample Categories
INSERT INTO categories (id, name, description)
VALUES
    (uuid_generate_v4(), 'Technology', 'Polls related to technology'),
    (uuid_generate_v4(), 'Sports', 'Polls related to sports');

-- Insert Sample Polls
INSERT INTO polls (id, creator_id, title, description, category_id, start_date, end_date, total_votes)
VALUES
    (uuid_generate_v4(), (SELECT id FROM users WHERE username = 'user1'), 'Best Programming Language?', 'Vote for your favorite language.', (SELECT id FROM categories WHERE name = 'Technology'), NOW(), NOW() + INTERVAL '7 days', 0),
    (uuid_generate_v4(), (SELECT id FROM users WHERE username = 'user2'), 'Favorite Sport?', 'Choose your favorite sport.', (SELECT id FROM categories WHERE name = 'Sports'), NOW(), NOW() + INTERVAL '7 days', 0);

-- Insert Sample Poll Options
INSERT INTO poll_options (id, poll_id, option_text)
VALUES
    (uuid_generate_v4(), (SELECT id FROM polls WHERE title = 'Best Programming Language?'), 'Python'),
    (uuid_generate_v4(), (SELECT id FROM polls WHERE title = 'Best Programming Language?'), 'JavaScript'),
    (uuid_generate_v4(), (SELECT id FROM polls WHERE title = 'Favorite Sport?'), 'Football'),
    (uuid_generate_v4(), (SELECT id FROM polls WHERE title = 'Favorite Sport?'), 'Basketball');

-- Insert Sample Votes
INSERT INTO poll_votes (id, poll_id, option_id, user_id)
VALUES
    (uuid_generate_v4(), (SELECT id FROM polls WHERE title = 'Best Programming Language?'), (SELECT id FROM poll_options WHERE option_text = 'Python'), (SELECT id FROM users WHERE username = 'user1')),
    (uuid_generate_v4(), (SELECT id FROM polls WHERE title = 'Favorite Sport?'), (SELECT id FROM poll_options WHERE option_text = 'Football'), (SELECT id FROM users WHERE username = 'user2'));

-- Insert Sample Comments
INSERT INTO comments (id, content, author_id, poll_id)
VALUES
    (uuid_generate_v4(), 'Python is the best for AI!', (SELECT id FROM users WHERE username = 'user1'), (SELECT id FROM polls WHERE title = 'Best Programming Language?')),
    (uuid_generate_v4(), 'Football is the most popular sport!', (SELECT id FROM users WHERE username = 'user2'), (SELECT id FROM polls WHERE title = 'Favorite Sport?'));
