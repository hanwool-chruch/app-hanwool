CREATE TABLE `user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `image` VARCHAR(256) NULL,
  `create_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `email` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`user_id`)
);

CREATE TABLE `social_user` (
  `social_id` INT NOT NULL AUTO_INCREMENT,
  `social_email` VARCHAR(256) NOT NULL,
  `last_access_token` VARCHAR(45) NULL,
  `user_id` INT NOT NULL,
  `provider` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`social_id`),
  INDEX `fk_kakao_user_user1_idx` (`user_id`),
  CONSTRAINT `fk_kakao_user_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE `email_user` (
  `email_id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(256) NOT NULL,
  `user_id` INT NOT NULL,
  `password` VARCHAR(256) NOT NULL,
  `provider` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`email_id`),
  INDEX `fk_email_user_user_idx` (`user_id`),
  CONSTRAINT `fk_email_user_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

CREATE TABLE `role` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`role_id`)
);

CREATE TABLE `service` (
  `service_id` INT NOT NULL AUTO_INCREMENT,
  `service_name` VARCHAR(45) NOT NULL,
  `create_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`service_id`)
);

CREATE TABLE `take_service` (
  `user_role_service_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`user_role_service_id`),
  INDEX `fk_user_role_service_user1_idx` (`user_id`),
  INDEX `fk_user_role_service_service1_idx` (`service_id`),
  INDEX `fk_user_role_service_role1_idx` (`role_id`),
  CONSTRAINT `fk_user_role_service_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_user_role_service_service1`
    FOREIGN KEY (`service_id`)
    REFERENCES `service` (`service_id`)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `fk_user_role_service_role1`
    FOREIGN KEY (`role_id`)
    REFERENCES `role` (`role_id`)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

CREATE TABLE `category` (
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(45) NOT NULL,
  `delete_date` DATETIME NULL DEFAULT NULL,
  `create_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `service_id` INT NOT NULL,
  PRIMARY KEY (`category_id`),
  INDEX `fk_category_service1_idx` (`service_id`),
  CONSTRAINT `fk_category_service1`
    FOREIGN KEY (`service_id`)
    REFERENCES `service` (`service_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE `payment` (
  `payment_id` INT NOT NULL AUTO_INCREMENT,
  `payment_name` VARCHAR(45) NOT NULL,
  `delete_date` DATETIME NULL DEFAULT NULL,
  `create_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `service_id` INT NOT NULL,
  PRIMARY KEY (`payment_id`),
  INDEX `fk_payment_service1_idx` (`service_id`),
  CONSTRAINT `fk_payment_service1`
    FOREIGN KEY (`service_id`)
    REFERENCES `service` (`service_id`)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

CREATE TABLE `history` (
  `history_id` INT NOT NULL AUTO_INCREMENT,
  `price` INT NOT NULL,
  `content` VARCHAR(128) NOT NULL DEFAULT 'no content',
  `history_date` DATETIME NOT NULL,
  `delete_date` DATETIME NULL DEFAULT NULL,
  `create_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `payment_payment_id` INT NOT NULL,
  `category_category_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  PRIMARY KEY (`history_id`),
  INDEX `fk_history_payment1_idx` (`payment_payment_id`),
  INDEX `fk_history_category1_idx` (`category_category_id`),
  INDEX `fk_history_service1_idx` (`service_id`),
  INDEX `idx_history_date` (`history_date`),
  CONSTRAINT `fk_history_payment1`
    FOREIGN KEY (`payment_payment_id`)
    REFERENCES `payment` (`payment_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_history_category1`
    FOREIGN KEY (`category_category_id`)
    REFERENCES `category` (`category_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_history_service1`
    FOREIGN KEY (`service_id`)
    REFERENCES `service` (`service_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
