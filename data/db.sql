# Users
CREATE TABLE users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  firstname VARCHAR(32) NOT NULL,
  lastname VARCHAR(32) NOT NULL,
  email VARCHAR(32) NOT NULL,
  password VARCHAR(60) NOT NULL,
  manager TINYINT(1) NOT NULL DEFAULT 0,
  registered BIGINT(13) NOT NULL,
  PRIMARY KEY (id)
);

# Tokens
CREATE TABLE tokens (
  id INT(11) NOT NULL AUTO_INCREMENT,
  user_id INT(11) NOT NULL,
  token VARCHAR(64) NOT NULL,
  created BIGINT(13) NOT NULL,
  expiry BIGINT(13) NOT NULL,
  PRIMARY KEY (id)
);

# Customers
CREATE TABLE customers (
  id INT(11) NOT NULL AUTO_INCREMENT,
  firstname VARCHAR(32) NOT NULL,
  lastname VARCHAR(32) NOT NULL,
  email VARCHAR(32) NOT NULL,
  address TEXT NOT NULL,
  PRIMARY KEY (id)
);

# Routes
CREATE TABLE routes (
  id INT(11) NOT NULL AUTO_INCREMENT,
  origin INT(11) NOT NULL,
  destination INT(11) NOT NULL,
  company INT(11) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  max_weight DECIMAL(10, 4) NOT NULL,
  max_volume DECIMAL(10, 4) NOT NULL,
  route_type VARCHAR(10) NOT NULL,
  priority INT(10) NOT NULL DEFAULT 0,
  duration BIGINT(13) NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
);

# Deliveries
CREATE TABLE deliveries (
  id INT(11) NOT NULL AUTO_INCREMENT,
  sender INT(11) NOT NULL,
  recipient INT(11) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  weight DECIMAL(10, 4) NOT NULL,
  volume DECIMAL(10, 4) NOT NULL,
  origin INT(11) NOT NULL,
  destination INT(11) NOT NULL,
  route INT(11) NOT NULL,
  time BIGINT(13) NOT NULL,
  PRIMARY KEY (id)
);

# Cities
CREATE TABLE cities (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(32) NOT NULL,
  PRIMARY KEY (id)
);

# Companies
CREATE TABLE companies (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(32) NOT NULL,
  city INT(11) NOT NULL,
  PRIMARY KEY (id)
);
