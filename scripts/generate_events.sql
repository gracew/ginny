CREATE TABLE generate_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID not null,
    user_id text not null,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    filename text not null,
    data jsonb
);