-- Google Analytics Sample Data - Web Traffic Analysis
-- Analyze web traffic patterns using Google's sample GA data
-- Perfect for learning web analytics - works immediately

SELECT 
  DATE(PARSE_DATE('%Y%m%d', date)) as visit_date,
  SUM(totals.visits) as total_visits,
  SUM(totals.pageviews) as total_pageviews,
  SUM(totals.bounces) / SUM(totals.visits) * 100 as bounce_rate_percent,
  COUNT(DISTINCT fullVisitorId) as unique_visitors,
  ROUND(AVG(totals.timeOnSite), 2) as avg_session_duration_seconds
FROM `bigquery-public-data.google_analytics_sample.ga_sessions_*`
WHERE _TABLE_SUFFIX BETWEEN '20170701' AND '20170731'  -- July 2017
  AND totals.visits > 0
GROUP BY DATE(PARSE_DATE('%Y%m%d', date))
ORDER BY visit_date
