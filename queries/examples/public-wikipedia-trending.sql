-- Explore BigQuery Public Datasets - Wikipedia Pageviews
-- This query works for anyone and shows real data immediately
-- No setup required - uses Google's public datasets

SELECT 
  title,
  views,
  datehour
FROM `bigquery-public-data.wikipedia.pageviews_2024`
WHERE datehour >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
  AND wiki = 'en'
  AND title NOT LIKE '%:%'  -- Exclude meta pages
ORDER BY views DESC
LIMIT 20
