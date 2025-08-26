-- Daily Metrics Analysis
-- Shows daily aggregated metrics for the past 30 days

SELECT
  DATE(timestamp_column) as date,
  COUNT(*) as daily_count,
  COUNT(DISTINCT user_id_column) as unique_users,
  AVG(metric_column) as avg_metric,
  SUM(value_column) as total_value
FROM `your-project.your-dataset.your-events-table`
WHERE timestamp_column >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
  AND timestamp_column IS NOT NULL
GROUP BY DATE(timestamp_column)
ORDER BY date DESC
