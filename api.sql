DROP TABLE IF EXISTS theme;


CREATE TABLE theme (
  `themeid`   INTEGER PRIMARY KEY AUTO_INCREMENT,
  `name`      varchar(1024) DEFAULT '',
  `votes_yes` INT  NOT NULL DEFAULT 0,
  `votes_no`  INT NOT NULL DEFAULT 0

  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;;
