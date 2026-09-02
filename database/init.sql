CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(32) UNIQUE NOT NULL
);
INSERT INTO roles(name) VALUES ('ADMIN'),('AUTHORITY'),('OPERATOR'),('VIEWER') ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role_id INT NOT NULL REFERENCES roles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS locations (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  geom GEOGRAPHY(POINT,4326),
  elevation_m DOUBLE PRECISION,
  slope_deg DOUBLE PRECISION
);
CREATE INDEX IF NOT EXISTS locations_geom_gix ON locations USING GIST (geom);

CREATE TABLE IF NOT EXISTS roads (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  geom GEOGRAPHY(LINESTRING,4326),
  elevation_m DOUBLE PRECISION,
  status VARCHAR(32) DEFAULT 'OPEN'
);
CREATE INDEX IF NOT EXISTS roads_geom_gix ON roads USING GIST (geom);

CREATE TABLE IF NOT EXISTS rainfall_records (
  id BIGSERIAL PRIMARY KEY,
  recorded_at TIMESTAMPTZ NOT NULL,
  intensity_mm_hr DOUBLE PRECISION NOT NULL,
  accumulation_mm DOUBLE PRECISION DEFAULT 0,
  source VARCHAR(64) NOT NULL DEFAULT 'synthetic'
);
CREATE INDEX IF NOT EXISTS rainfall_records_time_idx ON rainfall_records(recorded_at);

CREATE TABLE IF NOT EXISTS rainfall_forecasts (
  id BIGSERIAL PRIMARY KEY,
  forecast_at TIMESTAMPTZ NOT NULL,
  intensity_mm_hr DOUBLE PRECISION NOT NULL,
  source VARCHAR(64) NOT NULL DEFAULT 'synthetic'
);
CREATE INDEX IF NOT EXISTS rainfall_forecasts_time_idx ON rainfall_forecasts(forecast_at);

CREATE TABLE IF NOT EXISTS terrain_cells (
  id VARCHAR(64) PRIMARY KEY,
  geom GEOGRAPHY(POLYGON,4326),
  elevation_m DOUBLE PRECISION NOT NULL,
  slope_deg DOUBLE PRECISION DEFAULT 0
);
CREATE INDEX IF NOT EXISTS terrain_cells_geom_gix ON terrain_cells USING GIST (geom);

CREATE TABLE IF NOT EXISTS drainage_nodes (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  geom GEOGRAPHY(POINT,4326),
  capacity_m3s DOUBLE PRECISION DEFAULT 0,
  utilization_pct DOUBLE PRECISION DEFAULT 0,
  blockage_pct DOUBLE PRECISION DEFAULT 0,
  status VARCHAR(32) DEFAULT 'NORMAL'
);
CREATE INDEX IF NOT EXISTS drainage_nodes_geom_gix ON drainage_nodes USING GIST (geom);

CREATE TABLE IF NOT EXISTS drainage_edges (
  id VARCHAR(64) PRIMARY KEY,
  from_node_id VARCHAR(64) REFERENCES drainage_nodes(id),
  to_node_id VARCHAR(64) REFERENCES drainage_nodes(id),
  geom GEOGRAPHY(LINESTRING,4326),
  capacity_m3s DOUBLE PRECISION DEFAULT 0
);
CREATE INDEX IF NOT EXISTS drainage_edges_geom_gix ON drainage_edges USING GIST (geom);

CREATE TABLE IF NOT EXISTS water_bodies (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(16) NOT NULL CHECK (type IN ('pond','lake','canal','river','ocean')),
  geom GEOGRAPHY(POLYGON,4326),
  capacity DOUBLE PRECISION DEFAULT 0,
  current_level_pct DOUBLE PRECISION DEFAULT 0,
  inflow_rate DOUBLE PRECISION DEFAULT 0,
  overflow_risk VARCHAR(32) DEFAULT 'LOW',
  connected_drain_ids TEXT[] DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS water_bodies_geom_gix ON water_bodies USING GIST (geom);

CREATE TABLE IF NOT EXISTS flood_predictions (
  id BIGSERIAL PRIMARY KEY,
  location_id VARCHAR(64) REFERENCES locations(id),
  predicted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  horizon_minutes INT NOT NULL DEFAULT 0,
  flood_probability DOUBLE PRECISION NOT NULL,
  risk_level VARCHAR(32) NOT NULL,
  confidence_score DOUBLE PRECISION,
  model_version VARCHAR(64)
);
CREATE INDEX IF NOT EXISTS flood_predictions_location_time_idx ON flood_predictions(location_id,predicted_at);

CREATE TABLE IF NOT EXISTS water_depth_predictions (
  id BIGSERIAL PRIMARY KEY,
  location_id VARCHAR(64) REFERENCES locations(id),
  predicted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  horizon_minutes INT NOT NULL DEFAULT 0,
  depth_m DOUBLE PRECISION NOT NULL,
  model_version VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS historical_floods (
  id BIGSERIAL PRIMARY KEY,
  location_id VARCHAR(64) REFERENCES locations(id),
  event_date DATE NOT NULL,
  peak_depth_m DOUBLE PRECISION,
  rainfall_mm DOUBLE PRECISION,
  source VARCHAR(64) NOT NULL DEFAULT 'synthetic'
);

CREATE TABLE IF NOT EXISTS alerts (
  id VARCHAR(64) PRIMARY KEY,
  severity VARCHAR(32) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  area VARCHAR(255),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rainfall_mm_hr DOUBLE PRECISION NOT NULL,
  blockage_pct DOUBLE PRECISION NOT NULL,
  before_risk DOUBLE PRECISION,
  after_risk DOUBLE PRECISION,
  before_depth_m DOUBLE PRECISION,
  after_depth_m DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  priority VARCHAR(32) NOT NULL,
  distance_km DOUBLE PRECISION,
  eta_minutes INT,
  safety_score DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name VARCHAR(255) NOT NULL,
  version VARCHAR(64) NOT NULL,
  accuracy DOUBLE PRECISION,
  precision_score DOUBLE PRECISION,
  recall DOUBLE PRECISION,
  f1 DOUBLE PRECISION,
  mae DOUBLE PRECISION,
  rmse DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_sources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  source_type VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'READY',
  is_synthetic BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO data_sources(name,source_type,status,is_synthetic)
VALUES ('Synthetic pilot-city dataset','seed','READY',TRUE)
ON CONFLICT DO NOTHING;
