-- Funnel Analysis Template
-- Track user progression through defined steps

WITH funnel_events AS (
  SELECT 
    user_id,
    event_type,
    timestamp_column,
    ROW_NUMBER() OVER (PARTITION BY user_id, event_type ORDER BY timestamp_column) as event_sequence
  FROM `your-project.your-dataset.events-table`
  WHERE event_type IN ('step_1', 'step_2', 'step_3', 'step_4')
    AND timestamp_column >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
),

user_funnel AS (
  SELECT 
    user_id,
    MAX(CASE WHEN event_type = 'step_1' THEN 1 ELSE 0 END) as reached_step_1,
    MAX(CASE WHEN event_type = 'step_2' THEN 1 ELSE 0 END) as reached_step_2,
    MAX(CASE WHEN event_type = 'step_3' THEN 1 ELSE 0 END) as reached_step_3,
    MAX(CASE WHEN event_type = 'step_4' THEN 1 ELSE 0 END) as reached_step_4
  FROM funnel_events
  WHERE event_sequence = 1  -- Only first occurrence of each event
  GROUP BY user_id
)

SELECT 
  'Step 1' as step,
  SUM(reached_step_1) as users,
  SUM(reached_step_1) / COUNT(*) as conversion_rate
FROM user_funnel
UNION ALL
SELECT 
  'Step 2' as step,
  SUM(reached_step_2) as users,
  SUM(reached_step_2) / SUM(reached_step_1) as conversion_rate
FROM user_funnel
UNION ALL
SELECT 
  'Step 3' as step,
  SUM(reached_step_3) as users,
  SUM(reached_step_3) / SUM(reached_step_2) as conversion_rate
FROM user_funnel
UNION ALL
SELECT 
  'Step 4' as step,
  SUM(reached_step_4) as users,
  SUM(reached_step_4) / SUM(reached_step_3) as conversion_rate
FROM user_funnel
ORDER BY step
