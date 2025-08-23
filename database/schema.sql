CREATE DATABASE IF NOT EXISTS college_portal;
USE college_portal;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
);

CREATE playlist (
    playlist_name VARCHAR(100),
    playlist_link TEXT,
);

CREATE
CREATE TABLE syllabus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(100),
    subject VARCHAR(100),
    link TEXT
);

CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(100),
    note_title VARCHAR(200),
    file_link TEXT
);

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(100),
    year INT,
    file_link TEXT
);
