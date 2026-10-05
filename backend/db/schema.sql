CREATE TABLE IF NOT EXISTS users (
    user_id     SERIAL PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    username    VARCHAR(100) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ground_control_stations (
    gcs_id      SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    latitude    FLOAT NOT NULL,
    longitude   FLOAT NOT NULL,
    altitude    FLOAT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE if NOT EXISTS satellite_catalog (
    satid           INTEGER PRIMARY KEY,
    satname         VARCHAR(255),
    launchDate      DATE
);

CREATE TABLE IF NOT EXISTS satellite_postions (
    position_id         SERIAL PRIMARY KEY,
    satid               INTEGER NOT NULL REFERENCES satellite_catalog(satid) ON DELETE CASCADE,
    satlat              FLOAT NOT NULL,
    satlng              FLOAT NOT NULL,
    satalt              FLOAT NOT NULL,
    velocity            FLOAT,
    recorded_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE if NOT EXISTS gcs_satellites (
    satid               INTEGER NOT NULL REFERENCES satellite_catalog(satid) ON DELETE CASCADE,
    gcs_id              INTEGER NOT NULL REFERENCES ground_control_stations(gcs_id) ON DELETE CASCADE,
    PRIMARY KEY         (gcs_id, satid),
    signal_strength     FLOAT,
    battery_level       FLOAT,
    mode                VARCHAR(20) CONSTRAINT valid_mode CHECK (mode IN ('Normal', 'Safe')),
    updated_at          TIMESTAMP DEFAULT NOW()
);

