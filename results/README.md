# Results Directory

This directory contains the output files from BigQuery queries executed using the CLI tools.

## File Naming Convention

- **Auto-generated files**: `<query-name>_<timestamp>.csv`
- **Custom files**: As specified with `--output` option

## Examples

- `daily-metrics_2025-08-26_143022.csv` - Auto-generated from daily-metrics.sql
- `user-analysis.csv` - Custom filename specified with --output

## File Structure

Generated CSV files typically include:
- Header row with column names
- Data rows with query results
- UTF-8 encoding
- Comma-separated values

## Cleanup

Results are not automatically deleted. You may want to:
- Archive old results periodically
- Use descriptive filenames for important analyses  
- Keep a results log for important queries

## Git Ignore

This directory is included in .gitignore to prevent accidentally committing large data files to the repository.
