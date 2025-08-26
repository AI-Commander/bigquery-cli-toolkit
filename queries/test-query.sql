-- Test Query for BigQuery CLI Installation
-- This is a simple, safe query to test the CLI tools

SELECT 
  'Hello from BigQuery CLI!' as message,
  CURRENT_TIMESTAMP() as current_time,
  'BigQuery Analytics Toolkit' as project_name,
  1 as test_value,
  CURRENT_DATE() as today
