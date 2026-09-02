INSERT INTO locations(id,name,geom,elevation_m,slope_deg) VALUES
('zone-01','Riverside Ward',ST_SetSRID(ST_Point(77.2090,28.6139),4326)::geography,212,2.8),
('zone-02','Central Market',ST_SetSRID(ST_Point(77.2180,28.6219),4326)::geography,218,2.8),
('zone-03','North Junction',ST_SetSRID(ST_Point(77.2110,28.6329),4326)::geography,224,2.8),
('zone-04','East Industrial',ST_SetSRID(ST_Point(77.2280,28.6079),4326)::geography,230,2.8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO drainage_nodes(id,name,geom,capacity_m3s,utilization_pct,blockage_pct,status) VALUES
('dr-01','Riverside Main',ST_SetSRID(ST_Point(77.2095,28.6142),4326)::geography,120,91,18,'OVERLOADED'),
('dr-02','Market Collector',ST_SetSRID(ST_Point(77.2185,28.6222),4326)::geography,95,82,12,'HIGH'),
('dr-03','North Trunk',ST_SetSRID(ST_Point(77.2115,28.6332),4326)::geography,140,76,9,'HIGH'),
('dr-04','East Channel',ST_SetSRID(ST_Point(77.2285,28.6082),4326)::geography,110,62,15,'NORMAL')
ON CONFLICT (id) DO NOTHING;
INSERT INTO water_bodies(id,name,type,current_level_pct,inflow_rate,overflow_risk,connected_drain_ids) VALUES
('wb-01','Central Lake','lake',78,14,'HIGH',ARRAY['dr-02']),
('wb-02','East Canal','canal',61,9,'MODERATE',ARRAY['dr-04'])
ON CONFLICT (id) DO NOTHING;
INSERT INTO rainfall_records(recorded_at,intensity_mm_hr,accumulation_mm,source) VALUES (NOW(),68,112,'synthetic');
INSERT INTO rainfall_forecasts(forecast_at,intensity_mm_hr,source) VALUES (NOW()+INTERVAL '30 minutes',72,'synthetic'),(NOW()+INTERVAL '1 hour',76,'synthetic'),(NOW()+INTERVAL '2 hours',82,'synthetic'),(NOW()+INTERVAL '3 hours',77,'synthetic');
INSERT INTO alerts(id,severity,title,message,area,status) VALUES
('al-01','CRITICAL','Riverside Ward flood risk critical','Predicted depth may reach 0.74 m within 2 hours.','Riverside Ward','ACTIVE'),
('al-02','HIGH','Riverside Main drain overloaded','Drain utilization is above 90%.','Riverside Ward','ACTIVE')
ON CONFLICT (id) DO NOTHING;
INSERT INTO data_sources(name,source_type,status,is_synthetic) VALUES ('Synthetic rainfall + terrain + drainage seed','seed','READY',TRUE);

INSERT INTO users(email,password_hash,role_id)
SELECT 'admin@jalrakshak.local', crypt('Jal@1234', gen_salt('bf')), id FROM roles WHERE name='ADMIN'
ON CONFLICT (email) DO NOTHING;
INSERT INTO users(email,password_hash,role_id)
SELECT 'authority@jalrakshak.local', crypt('Jal@1234', gen_salt('bf')), id FROM roles WHERE name='AUTHORITY'
ON CONFLICT (email) DO NOTHING;
