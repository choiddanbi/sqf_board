--DROP TABLE IF EXISTS USER;
--DROP TABLE IF EXISTS ROLE;
--DROP TABLE IF EXISTS USER_ROLES;
--
--CREATE TABLE USER (
--    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
--    username VARCHAR(255) UNIQUE NOT NULL,
--    password VARCHAR(255) not null,
--    name VARCHAR(255) not null,
--    email VARCHAR(255) not null,
--    img TEXT not null DEFAULT 'https://firebasestorage.googleapis.com/v0/b/userprofile-34d52.appspot.com/o/user%2Fdefault.png?alt=media&token=4da24567-16f6-4c71-803e-71ec2136383d'
--);
--
--CREATE TABLE ROLE (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    name VARCHAR(255) UNIQUE not null
--);
--
--INSERT INTO ROLE
--VALUES  (DEFAULT, 'ROLE_USER'),
--        (DEFAULT, 'ROLE_MANAGER'),
--        (DEFAULT, 'ROLE_ADMIN');
--
--CREATE TABLE USER_ROLES (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    user_id BIGINT not null,
--    role_id BIGINT not null
--);

--CREATE TABLE OAUTH2_USER (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    user_id BIGINT not null,
--    oauth2_name VARCHAR(255) UNIQUE not null,
--    provider VARCHAR(255) not null
--);

--CREATE TABLE BOARD (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY not null,
--    title VARCHAR(255) not null,
--    content LONGTEXT not null,
--    user_id BIGINT not null
--);
--

CREATE TABLE BOARD_LIKE (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT not null,
    user_id BIGINT not null
);


--ALTER TABLE BOARD ADD COLUMN view_count INT not null DEFAULT 0;








