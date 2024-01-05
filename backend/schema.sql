CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    current_chat_box INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_signin_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    new_signin_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_boxes (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY,
    order_id INTEGER DEFAULT 1,
    user_id UUID NOT NULL,
    chat_box_id UUID NOT NULL,
    chat_box_name TEXT NOT NULL,
    user_input TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (chat_box_id) REFERENCES chat_boxes (id)
);
