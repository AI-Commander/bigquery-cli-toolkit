# BigQuery SQL Query Examples

This document provides practical examples of common BigQuery queries that can be used with the CLI toolkit.

## Table of Contents

1. [Basic Data Exploration](#basic-data-exploration)
2. [Aggregation and Grouping](#aggregation-and-grouping)
3. [Time Series Analysis](#time-series-analysis)
4. [Window Functions](#window-functions)
5. [Joins and Subqueries](#joins-and-subqueries)
6. [Performance Monitoring](#performance-monitoring)

## Basic Data Exploration

### Row Counts and Basic Statistics
```sql
SELECT 
  COUNT(*) as total_rows,
  COUNT(DISTINCT user_id) as unique_users,
  MIN(created_date) as earliest_date,
  MAX(created_date) as latest_date,
  AVG(metric_value) as avg_metric
FROM `your-project.dataset.table`
```

### Data Quality Checks
```sql
SELECT 
  column_name,
  COUNT(*) as total_values,
  COUNT(column_name) as non_null_values,
  COUNT(*) - COUNT(column_name) as null_values,
  COUNT(DISTINCT column_name) as unique_values
FROM `your-project.dataset.table`
GROUP BY column_name
```

## Aggregation and Grouping

### Daily Aggregations
```sql
SELECT 
  DATE(timestamp_column) as date,
  COUNT(*) as daily_events,
  COUNT(DISTINCT user_id) as active_users,
  SUM(value_column) as total_value,
  AVG(metric_column) as avg_metric
FROM `your-project.dataset.events`
WHERE DATE(timestamp_column) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY DATE(timestamp_column)
ORDER BY date DESC
```

### Top N Analysis
```sql
SELECT 
  category,
  COUNT(*) as frequency,
  PERCENT_RANK() OVER (ORDER BY COUNT(*) DESC) as percentile_rank
FROM `your-project.dataset.table`
GROUP BY category
ORDER BY frequency DESC
LIMIT 20
```

## Time Series Analysis

### Moving Averages
```sql
WITH daily_data AS (
  SELECT 
    DATE(timestamp_column) as date,
    COUNT(*) as daily_count
  FROM `your-project.dataset.events`
  GROUP BY DATE(timestamp_column)
)
SELECT 
  date,
  daily_count,
  AVG(daily_count) OVER (
    ORDER BY date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as seven_day_avg,
  AVG(daily_count) OVER (
    ORDER BY date 
    ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
  ) as thirty_day_avg
FROM daily_data
ORDER BY date DESC
```

### Growth Rates
```sql
WITH monthly_data AS (
  SELECT 
    DATE_TRUNC(DATE(timestamp_column), MONTH) as month,
    COUNT(*) as monthly_count
  FROM `your-project.dataset.events`
  GROUP BY DATE_TRUNC(DATE(timestamp_column), MONTH)
)
SELECT 
  month,
  monthly_count,
  LAG(monthly_count) OVER (ORDER BY month) as prev_month_count,
  (monthly_count - LAG(monthly_count) OVER (ORDER BY month)) / 
    LAG(monthly_count) OVER (ORDER BY month) * 100 as growth_rate_percent
FROM monthly_data
ORDER BY month DESC
```

## Window Functions

### Ranking and Percentiles
```sql
SELECT 
  user_id,
  total_purchases,
  RANK() OVER (ORDER BY total_purchases DESC) as rank,
  PERCENT_RANK() OVER (ORDER BY total_purchases) as percentile,
  NTILE(10) OVER (ORDER BY total_purchases) as decile
FROM (
  SELECT 
    user_id,
    COUNT(*) as total_purchases
  FROM `your-project.dataset.purchases`
  GROUP BY user_id
)
ORDER BY total_purchases DESC
```

### Running Totals
```sql
SELECT 
  date,
  daily_revenue,
  SUM(daily_revenue) OVER (
    ORDER BY date 
    ROWS UNBOUNDED PRECEDING
  ) as cumulative_revenue
FROM (
  SELECT 
    DATE(purchase_date) as date,
    SUM(amount) as daily_revenue
  FROM `your-project.dataset.purchases`
  GROUP BY DATE(purchase_date)
)
ORDER BY date
```

## Joins and Subqueries

### User Activity Analysis
```sql
SELECT 
  u.user_id,
  u.signup_date,
  COUNT(e.event_id) as total_events,
  MIN(e.event_timestamp) as first_activity,
  MAX(e.event_timestamp) as last_activity,
  DATE_DIFF(MAX(DATE(e.event_timestamp)), 
           DATE(u.signup_date), DAY) as days_active
FROM `your-project.dataset.users` u
LEFT JOIN `your-project.dataset.events` e 
  ON u.user_id = e.user_id
WHERE u.signup_date >= '2024-01-01'
GROUP BY u.user_id, u.signup_date
ORDER BY total_events DESC
```

## Performance Monitoring

### Query Costs Analysis
```sql
SELECT
  DATE(creation_time) as query_date,
  user_email,
  COUNT(*) as total_queries,
  SUM(total_bytes_processed) / POW(10, 9) as total_gb_processed,
  SUM(total_bytes_processed) / POW(10, 12) * 5 as estimated_cost_usd
FROM `your-project.region-us.INFORMATION_SCHEMA.JOBS_BY_PROJECT`
WHERE creation_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
  AND job_type = 'QUERY'
  AND state = 'DONE'
GROUP BY DATE(creation_time), user_email
ORDER BY query_date DESC, estimated_cost_usd DESC
```

### Slow Query Identification
```sql
SELECT
  job_id,
  user_email,
  TIMESTAMP_DIFF(end_time, start_time, SECOND) as duration_seconds,
  total_bytes_processed / POW(10, 9) as gb_processed,
  total_slot_ms / 1000 / 60 as slot_minutes,
  SUBSTR(query, 1, 100) as query_preview
FROM `your-project.region-us.INFORMATION_SCHEMA.JOBS_BY_PROJECT`
WHERE creation_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
  AND job_type = 'QUERY'
  AND state = 'DONE'
  AND TIMESTAMP_DIFF(end_time, start_time, SECOND) > 30
ORDER BY duration_seconds DESC
LIMIT 20
```

## Usage with CLI Tools

### Running Examples
```bash
# Run a basic exploration query
node run-query.js queries/examples/basic-exploration.sql

# Run with custom output
node run-query.js queries/examples/daily-metrics.sql --output reports/daily.csv

# Test expensive queries safely
node safe-query.js queries/examples/large-analysis.sql 5000000000
```

### Best Practices
1. Always test queries with `--dry-run` first
2. Use appropriate byte limits for cost control
3. Add WHERE clauses to limit data processing
4. Use partitioned tables when possible
5. Preview results before running large queries

---

*For more examples and advanced patterns, see the template queries in `queries/templates/`*
