-- Cost Analysis Query
-- Analyze BigQuery costs by day, user, and query type

SELECT
  DATE(creation_time) as query_date,
  user_email,
  COUNT(*) as total_queries,
  SUM(total_bytes_processed) as total_bytes,
  AVG(total_bytes_processed) as avg_bytes_per_query,
  SUM((total_bytes_processed / POW(10, 12)) * 5) as estimated_daily_cost_usd
FROM `your-project.region-us.INFORMATION_SCHEMA.JOBS_BY_PROJECT`
WHERE creation_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
  AND job_type = 'QUERY'
  AND state = 'DONE'
  AND total_bytes_processed > 0
GROUP BY DATE(creation_time), user_email
ORDER BY query_date DESC, estimated_daily_cost_usd DESC
