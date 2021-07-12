CREATE EXTENSION pgcrypto;
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text not null,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zip text NOT NULL,
    application_fee decimal,
    reservation_fee decimal,
    admin_fee decimal,
    trash_fee decimal,
    pet_fee decimal,
    custom_text text
);
CREATE INDEX idx_properties_user_id ON properties (user_id);