CREATE TABLE IF NOT EXISTS users (
    user_id     SERIAL PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    username    VARCHAR(100) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    has_logged_in BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ground_control_stations (
    gcs_id      SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    latitude    FLOAT NOT NULL,
    longitude   FLOAT NOT NULL,
    altitude    FLOAT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS satellites (
    satellite_id        SERIAL PRIMARY KEY,
    gcs_id              INT NOT NULL REFERENCES ground_control_stations(gcs_id) ON DELETE CASCADE,
    satid               INTEGER NOT NULL,
    satname             VARCHAR(255),
    launch_date         DATE,
    satlat              FLOAT,
    satlng              FLOAT,
    satalt              FLOAT,
    velocity            FLOAT,
    last_contact_time   TIMESTAMP,
    signal_strength     FLOAT,
    battery_level       FLOAT,
    mode                VARCHAR(20) CONSTRAINT valid_mode CHECK (mode IN ('Normal', 'Safe')),
    updated_at          TIMESTAMP DEFAULT NOW(),
    UNIQUE (gcs_id, satid)
);