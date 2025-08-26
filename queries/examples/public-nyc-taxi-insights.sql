-- NYC Taxi Data - Business Intelligence Example
-- Analyze NYC taxi trips for business insights
-- Great example of real-world BI analytics

SELECT 
  EXTRACT(HOUR FROM pickup_datetime) as pickup_hour,
  COUNT(*) as trip_count,
  AVG(trip_distance) as avg_distance_miles,
  AVG(fare_amount) as avg_fare_dollars,
  AVG(tip_amount) as avg_tip_dollars,
  ROUND(AVG(tip_amount / fare_amount * 100), 2) as avg_tip_percent
FROM `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2016`
WHERE pickup_datetime >= '2016-01-01'
  AND pickup_datetime < '2016-02-01'  -- January 2016 sample
  AND fare_amount > 0
  AND trip_distance > 0
GROUP BY EXTRACT(HOUR FROM pickup_datetime)
ORDER BY pickup_hour
