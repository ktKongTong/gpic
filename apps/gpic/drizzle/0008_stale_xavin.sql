-- Custom SQL migration file, put your code below! --

INSERT INTO user (id, name, email, email_verified, image, created_at, updated_at) VALUES
(
    'anonymous',
    'anonymous',
    'anonymous@example.com',
    0,
    null,
    1744303096080,
    1744303096080
);

INSERT INTO credit (user_id, balance, created_at, updated_at) VALUES (
             'anonymous',
             '0',
             1744303096080,
             1744303096080
         );
