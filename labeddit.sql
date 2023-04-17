-- Active: 1678280340320@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT(DATETIME())
);

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    comments INTEGER DEFAULT(0) NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT(0) NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
);

CREATE TABLE comments (
    id TEXT PRIMARY KEY UNIQUE NOT NULL, 
    creator_id TEXT NOT NULL, 
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL, 
    dislikes INTEGER DEFAULT(0) NOT NULL, 
    created_at TEXT DEFAULT(DATETIME()) NOT NULL, 
    updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
    post_id TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);

CREATE TABLE likes_dislikes_posts (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);

CREATE TABLE likes_dislikes_comments (
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (comment_id) REFERENCES comments (id)
);

INSERT INTO users (id, nickname, email, password, role)
    VALUES
        ("u001", "Karine", "karine@gmail.com", "k0123", "ADMIN"),
        ("u002", "Marcos Benhur", "marcosbenhur@gmail.com", "mb1234", "USER"),
        ("u003", "Marcos Daniel", "marcos_daniel@gmail.com", "md2345", "USER"),
        ("u004", "Flávia_Rafaela", "gemeasdobarulho@gmail.com", "fr3456", "USER");

INSERT INTO posts (id, creator_id, content)
    VALUES
        ("p001", "u001", "Formatura Chegou! Realizada com cada conquista alcançada!"),
        ("p002", "u002", "Interessado na área da programção, por onde começo?"),
        ("p003", "u003", "Meu projeto de futuro é ser programador, doido para começar essa jornada!"),
        ("p004", "u004", "Como é a rotina de trabalho de um programador?");

INSERT INTO comments (id, creator_id, content, post_id)
    VALUES
        ("c001", "u002", "Parabéns pela realização!", "p001"),
        ("c002", "u004", "Parabéns Mãe! Nós te amamos!", "p001"),
        ("c003", "u003", "Também quero dicas de por onde começar!", "p002"),
        ("c004", "u001", "Depende de onde e como vc vai trabalhar!", "p004");

INSERT INTO likes_dislikes_posts (user_id, post_id, like)
    VALUES
        ("u001", "p002", 1),
        ("u001", "p004", 1),
        ("u002", "p001", 1),
        ("u002", "p003", 1),
        ("u003", "p001", 1),
        ("u003", "p004", 1),
        ("u004", "p002", 1),
        ("u004", "p003", 1);


INSERT INTO likes_dislikes_comments (user_id, comment_id, like)
    VALUES
        ("u001", "c002", 1),
        ("u002", "c002", 1),
        ("u003", "c001", 1),
        ("u004", "c003", 1);

UPDATE users
SET role = "ADMIN"
WHERE ID = "";

SELECT comments.id, 
comments.content,
comments.likes,
comments.dislikes,
comments.created_at,
comments.updated_at,
users.id,
users.nickname
FROM comments LEFT JOIN users
ON users.id = comments.creator_id;

SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM comments;

SELECT * FROM likes_dislikes_posts;

SELECT * FROM likes_dislikes_comments;

DROP TABLE users;






