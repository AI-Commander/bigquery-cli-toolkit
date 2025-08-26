-- Data Freshness Check
-- Monitor how fresh your data is across different tables

SELECT 
  table_catalog,
  table_schema,
  table_name,
  TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), 
    TIMESTAMP_MILLIS(last_modified_time), HOUR) as hours_since_update,
  row_count,
  size_bytes / POW(10, 9) as size_gb
FROM `your-project.your-dataset.__TABLES__`
WHERE table_name NOT LIKE '%temp%'
  AND table_name NOT LIKE '%test%'
ORDER BY last_modified_time DESC
