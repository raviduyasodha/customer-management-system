-- Seed countries
INSERT INTO country (name) VALUES ('Sri Lanka'), ('India'), ('United States'), ('United Kingdom');

-- Seed cities
INSERT INTO city (name, country_id) VALUES
    ('Colombo', 1), ('Kandy', 1), ('Galle', 1),
    ('Mumbai', 2), ('Delhi', 2),
    ('New York', 3), ('Los Angeles', 3),
    ('London', 4), ('Manchester', 4);
