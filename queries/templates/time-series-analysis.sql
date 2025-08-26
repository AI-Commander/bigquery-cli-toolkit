-- Time Series Analysis Template  
-- Analyze trends over time with moving averages

WITH daily_metrics AS (
  SELECT 
    DATE(timestamp_column) as date,
    COUNT(*) as daily_events,
    COUNT(DISTINCT user_column) as daily_users,
    AVG(metric_column) as daily_avg_metric
  FROM `your-project.your-dataset.your-table`
  WHERE timestamp_column >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
  GROUP BY DATE(timestamp_column)
)

SELECT 
  date,
  daily_events,
  daily_users,
  daily_avg_metric,
  AVG(daily_events) OVER (
    ORDER BY date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as weekly_avg_events,
  AVG(daily_users) OVER (
    ORDER BY date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as weekly_avg_users,
  daily_events - LAG(daily_events, 7) OVER (ORDER BY date) as week_over_week_change
FROM daily_metrics
ORDER BY date DESC
