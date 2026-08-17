PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,

    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    cover_url TEXT,
    description TEXT,
    publisher TEXT,
    published_date TEXT,
    page_count INTEGER,

    status TEXT NOT NULL,
    started_at TIMESTAMP,
    finished_at TIMESTAMP,

    rating INTEGER,
    review TEXT,
    notes TEXT,

    is_public BOOLEAN NOT NULL DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    CHECK (status IN (
        'currently_reading',
        'finished',
        'abandoned'
    )),

    CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),

    CHECK (page_count IS NULL OR page_count > 0)
);

CREATE INDEX idx_books_user_id ON books(user_id);