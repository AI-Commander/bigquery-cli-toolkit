-- Query Performance Monitoring
-- Analyze your BigQuery job performance and costs

SELECT
  job_id,
  user_email,
  query,
  total_bytes_processed,
  total_slot_ms,
  TIMESTAMP_DIFF(end_time, start_time, SECOND) as duration_seconds,
  (total_bytes_processed / POW(10, 12)) * 5 as estimated_cost_usd,
  creation_time
FROM `your-project.region-us.INFORMATION_SCHEMA.JOBS_BY_PROJECT`
WHERE creation_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
  AND job_type = 'QUERY'
  AND state = 'DONE'
ORDER BY total_bytes_processed DESC
LIMIT 20
