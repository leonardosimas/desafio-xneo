CREATE TABLE todo_list (
	id INT AUTO_INCREMENT PRIMARY KEY,
	description VARCHAR(255),
	completed TINYINT(1) DEFAULT 0
);

DROP TABLE todo_list;