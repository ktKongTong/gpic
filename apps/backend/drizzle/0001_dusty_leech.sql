-- Custom SQL migration file, put your code below! --
INSERT INTO user (id, name, email, email_verified, image, created_at, updated_at)
VALUES ('anonymous',
        'anonymous',
        'anonymous@example.com',
        0,
        null,
        1744303096080,
        1744303096080);

INSERT INTO credit (user_id, balance, created_at, updated_at)
VALUES ('anonymous',
        '0',
        1744303096080,
        1744303096080);


-- Custom SQL migration file, put your code below! --

INSERT INTO style (id,
                   prompt,
                   created_at,
                   updated_at,
                   style_friendly_id,
                   prompt_version,
                   type,
                   reference)
VALUES ('style_ghibli',
        'make this ghibli style, please make sure obey the content policy',
        '2025-04-09 15:47:07',
        '2025-04-09 15:47:07',
        'system_ghibli',
        1,
        'system',
        '[]');

INSERT INTO style (id,
                   prompt,
                   created_at,
                   updated_at,
                   style_friendly_id,
                   prompt_version,
                   type,
                   reference)
VALUES ('style_ram',
        'make this rick and morty style, please make sure obey the content policy',
        '2025-04-09 15:50:43',
        '2025-04-09 15:50:43',
        'system_rick_and_morty',
        1,
        'system',
        '[]');


-- Custom SQL migration file, put your code below! --


INSERT INTO style_i18n (id, style_friendly_id, i18n, name, aliases, description, created_at, updated_at)
VALUES ('stl_i18n_ghibli_zh',
        'system_ghibli',
        'zh-CN',
        '吉卜力',
        '[]',
        '吉卜力风格',
        1744213686000,
        1744213686000);

INSERT INTO style_i18n (id, style_friendly_id, i18n, name, aliases, description, created_at, updated_at)
VALUES ('stl_i18n_ghibli_en',
        'system_ghibli',
        'en-US',
        'ghibli',
        '[]',
        'ghibli style',
        1744213686000,
        1744213686000);
INSERT INTO style_i18n (id, style_friendly_id, i18n, name, aliases, description, created_at, updated_at)
VALUES ('stl_i18n_rick_and_morty_zh',
        'system_rick_and_morty',
        'zh-CN',
        '瑞克和莫蒂',
        '[]',
        '瑞克和莫蒂',
        1744213686000,
        1744213686000);

INSERT INTO style_i18n (id, style_friendly_id, i18n, name, aliases, description, created_at, updated_at)
VALUES ('stl_i18n_rick_and_morty_en',
        'system_rick_and_morty',
        'en-US',
        'Rick and Morty',
        '[]',
        'Rick and Morty',
        1744213686000,
        1744213686000);