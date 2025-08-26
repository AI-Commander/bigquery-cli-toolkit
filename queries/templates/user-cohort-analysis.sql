-- User Cohort Analysis Template
-- Analyze user behavior over time by cohort

WITH user_cohorts AS (
  SELECT 
    user_id,
    DATE(MIN(first_activity_timestamp)) as cohort_date,
    DATE_DIFF(DATE(activity_timestamp), 
              DATE(MIN(first_activity_timestamp) OVER (PARTITION BY user_id)), 
              DAY) as days_since_first_activity
  FROM `your-project.your-dataset.user-activity-table`
  WHERE activity_timestamp >= '2024-01-01'
  GROUP BY user_id, activity_timestamp
)

SELECT 
  cohort_date,
  days_since_first_activity,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(DISTINCT user_id) / FIRST_VALUE(COUNT(DISTINCT user_id)) 
    OVER (PARTITION BY cohort_date ORDER BY days_since_first_activity 
          ROWS UNBOUNDED PRECEDING) as retention_rate
FROM user_cohorts
WHERE days_since_first_activity <= 30
GROUP BY cohort_date, days_since_first_activity
ORDER BY cohort_date, days_since_first_activity
