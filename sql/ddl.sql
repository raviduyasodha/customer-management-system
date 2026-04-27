-- Master data tables
CREATE TABLE country (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE city (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    country_id  INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES country(id)
);

-- Core customer table
CREATE TABLE customer (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    dob         DATE NOT NULL,
    nic_number  VARCHAR(50)  NOT NULL UNIQUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Mobile numbers (multiple per customer)
CREATE TABLE customer_mobile (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    mobile      VARCHAR(20) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);

-- Addresses (multiple per customer)
CREATE TABLE customer_address (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id  BIGINT NOT NULL,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city_id      INT,
    country_id   INT,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
    FOREIGN KEY (city_id)     REFERENCES city(id),
    FOREIGN KEY (country_id)  REFERENCES country(id)
);

-- Family members (self-referencing many-to-many through customer IDs)
CREATE TABLE customer_family (
    customer_id       BIGINT NOT NULL,
    family_member_id  BIGINT NOT NULL,
    PRIMARY KEY (customer_id, family_member_id),
    FOREIGN KEY (customer_id)      REFERENCES customer(id) ON DELETE CASCADE,
    FOREIGN KEY (family_member_id) REFERENCES customer(id) ON DELETE CASCADE
);
