CREATE TABLE properties (
    id SERIAL NOT NULL,
    user_id text not null,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zip text NOT NULL,
    application_fee decimal,
    reservation_fee decimal,
    admin_fee decimal,
    parking_fee decimal,
    pet_fee decimal,
    custom_text text
);
ALTER TABLE ONLY properties ADD CONSTRAINT pk_properties_id PRIMARY KEY (id);
CREATE INDEX idx_properties_user_id ON properties (user_id);