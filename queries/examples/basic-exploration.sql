-- Basic Data Exploration Query Template
-- Replace placeholders with your actual table and column names

SELECT 
  COUNT(*) as total_rows,
  COUNT(DISTINCT your_id_column) as unique_records,
  MIN(your_date_column) as earliest_date,
  MAX(your_date_column) as latest_date,
  COUNT(DISTINCT DATE(your_date_column)) as days_of_data
FROM `your-project.your-dataset.your-table`
WHERE your_date_column >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
  AND your_date_column IS NOT NULL
