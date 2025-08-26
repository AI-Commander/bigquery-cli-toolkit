# BigQuery CLI Toolkit

A powerful Node.js toolkit for running BigQuery analytics with cost protection, automated organization, and comprehensive data analysis capabilities. Perfect for data analysts, engineers, and anyone working with BigQuery at scale.

Built with [Desktop Commander](https://desktopcommander.app/) to provide seamless BigQuery integration and automated analytics workflows.

## 🚀 Quick Start (0 to Results in 5 Minutes)

### Required Software

#### Node.js
- **Version**: 14.0.0 or higher
- **Installation**:
  - **macOS**: `brew install node` or download from [nodejs.org](https://nodejs.org/)
  - **Windows**: Download from [nodejs.org](https://nodejs.org/) or use `winget install OpenJS.NodeJS`
  - **Linux**: 
    ```bash
    # Ubuntu/Debian
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # CentOS/RHEL/Fedora
    sudo dnf install npm nodejs
    ```

#### Google Cloud SDK with BigQuery CLI
- **Installation**:
  - **macOS**: `brew install google-cloud-sdk`
  - **Windows**: Download from [cloud.google.com/sdk](https://cloud.google.com/sdk/)
  - **Linux**:
    ```bash
    curl https://sdk.cloud.google.com | bash
    exec -l $SHELL
    gcloud init
    ```

#### Authentication Setup
```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your project (replace with your actual project ID)
gcloud config set project your-bigquery-project-id

# Test BigQuery access
bq ls

# If you need application default credentials
gcloud auth application-default login
```

### Verify Installation
```bash
# Check Node.js version
node --version  # Should be 14.0.0+

# Check if BigQuery CLI works
bq version

# Test authentication
bq ls  # Should list your datasets

# Run installation test
node test-installation.js
```

### Step 1: Clone and Setup
```bash
# Clone the repository
git clone https://github.com/desktop-commander/bigquery-cli-toolkit.git
cd bigquery-cli-toolkit

# 🚀 QUICK: Try the interactive demo immediately (works with any Google account)
npm run demo

# OR test your system setup
node test-installation.js
```

### Step 2: Authenticate with Google Cloud
```bash
# Install Google Cloud SDK (if not already installed)
# macOS: brew install google-cloud-sdk
# Windows: Download from https://cloud.google.com/sdk/
# Linux: curl https://sdk.cloud.google.com | bash

# Authenticate and set up your project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud auth application-default login

# Verify BigQuery access
bq ls
```

### Step 3: Run Interactive Demo (Get Results Immediately!)
```bash
# 🎯 NEW: Run the interactive demo to see everything in action
node interactive-demo.js

# Or run individual examples:

# Try the built-in test query (works with any project)
node run-query.js queries/test-query.sql

# 🔥 Try these public dataset queries (no setup needed):

# See trending Wikipedia articles from the past week
node run-query.js queries/examples/public-wikipedia-trending.sql

# Analyze programming language popularity on GitHub  
node run-query.js queries/examples/public-github-languages.sql

# Web analytics insights from Google Analytics sample data
node run-query.js queries/examples/public-google-analytics.sql

# Business intelligence with NYC taxi data
node run-query.js queries/examples/public-nyc-taxi-insights.sql

# Check your BigQuery usage and costs
node run-query.js queries/examples/query-performance.sql
```

### Step 4: Real-World Examples
Choose your use case:

#### 📊 **E-commerce Analytics** (if you have transaction data)
```bash
# Analyze daily sales metrics
node run-query.js queries/examples/daily-metrics.sql --output sales-report.csv
```

#### 👥 **User Behavior Analysis** (if you have user event data)  
```bash
# Run cohort analysis
node run-query.js queries/templates/user-cohort-analysis.sql --output cohorts.csv
```

#### 💰 **Cost Monitoring** (works for any project)
```bash
# Analyze your BigQuery usage and costs
node run-query.js queries/examples/cost-analysis.sql --output cost-report.csv
```

#### 🔍 **Data Exploration** (works with any dataset)
```bash
# Check data freshness across your tables
node run-query.js queries/examples/data-freshness-check.sql
```

### Step 5: Customize for Your Data
```bash
# Copy a template and modify it for your needs
cp queries/examples/daily-metrics.sql my-custom-analysis.sql
# Edit my-custom-analysis.sql with your table names and columns
node run-query.js my-custom-analysis.sql --output my-results.csv
```

**🎉 You're now running BigQuery analytics with cost protection and automated CSV output!**


## 🛠️ Core Tools

### 1. Safe Query Runner (`safe-query.js`)
Runs BigQuery queries with cost protection and dry-run validation.

```bash
# Basic usage
node safe-query.js queries/user-analysis.sql

# Custom byte limit (default: 100MB)
node safe-query.js queries/large-analysis.sql 1073741824  # 1GB limit

# Get help
node safe-query.js --help
```

**Features:**
- 🛡️ Cost protection with customizable byte limits
- 🔍 Dry-run validation before execution
- 💰 Cost estimation display
- ⚡ Interactive confirmation for expensive queries

### 2. Universal Query Runner (`run-query.js`)
Runs queries with automatic CSV output and intelligent analysis.

```bash
# Basic usage
node run-query.js queries/analytics.sql

# Advanced options
node run-query.js queries/report.sql --output reports/data.csv
node run-query.js queries/big-query.sql --limit 20000000000  # 20GB limit
node run-query.js queries/test.sql --dry-run
node run-query.js queries/sample.sql --preview 20
```

**Features:**
- 📁 Automatic CSV output with timestamps
- 🔍 Preview of results
- 📊 Smart data analysis and pattern detection
- ⚙️ Configurable byte limits and output options

### 3. View Creator (`create-view.js`)
Creates and manages BigQuery views for complex analyses.

```bash
node create-view.js queries/create-summary-view.sql
```

## 📁 Project Structure

```
bigquery-cli-toolkit/
├── 🔧 Core Scripts
│   ├── package.json           # Project configuration
│   ├── safe-query.js          # Cost-protected query runner
│   ├── run-query.js           # Universal query runner
│   ├── create-view.js         # BigQuery view creator
│   └── test-installation.js   # Installation verification
│
├── 🔍 queries/               # SQL query files
│   ├── examples/             # Example queries
│   ├── templates/            # Query templates
│   └── test-query.sql        # Basic test query
│
├── 📊 results/               # Query output directory
│   └── (generated CSV files)
│
├── 📈 dashboards/            # HTML visualizations (optional)
│   └── (dashboard files)
│
├── ⚙️ scripts/               # Helper utilities
│   └── (automation scripts)
│
├── 📚 documentation/         # Guides and examples
│   ├── query-examples.md     # SQL query examples
│   ├── best-practices.md     # BigQuery best practices
│   └── troubleshooting.md    # Common issues
│
└── 🔧 Configuration
    ├── .gitignore            # Git ignore rules
    ├── LICENSE               # MIT license
    ├── CONTRIBUTING.md       # Contribution guidelines
    └── CHANGELOG.md          # Version history
```

## 🎯 Common Use Cases

### Daily Analytics Routine
```bash
# Check data freshness
node run-query.js queries/examples/data-freshness-check.sql

# Run standard reports
node run-query.js queries/examples/daily-metrics.sql --output reports/daily.csv

# Monitor query performance
node safe-query.js queries/examples/performance-metrics.sql
```

### Weekly Deep Analysis
```bash
# Comprehensive data analysis
node run-query.js queries/examples/weekly-analysis.sql --output weekly/analysis.csv

# Cost analysis
node run-query.js queries/examples/cost-analysis.sql --output weekly/costs.csv

# Performance trends
node run-query.js queries/examples/performance-trends.sql --output weekly/performance.csv
```

### Cost-Conscious Analysis
```bash
# Test expensive queries safely
node safe-query.js queries/large-dataset-analysis.sql 5368709120  # 5GB limit

# Dry-run before execution
node run-query.js queries/expensive-query.sql --dry-run

# Preview results before full execution
node run-query.js queries/sample-analysis.sql --preview 100
```

## 🔧 Configuration Options

### Environment Variables
Create a `.env` file for custom configuration:

```bash
# BigQuery Configuration
BIGQUERY_PROJECT_ID=your-project-id
BIGQUERY_DATASET=your-dataset
BIGQUERY_DEFAULT_LOCATION=US

# Cost Protection
MAX_QUERY_BYTES=104857600  # 100MB default
SAFE_MODE_ENABLED=true

# Output Settings
DEFAULT_OUTPUT_DIR=./results
CSV_DELIMITER=,
INCLUDE_HEADERS=true
```

### Command-Line Options

#### safe-query.js Options
```bash
node safe-query.js query.sql [max_bytes] [--help]
```

#### run-query.js Options
```bash
node run-query.js query.sql [options]
  --output <file>      Custom output filename
  --limit <bytes>      Maximum bytes to process
  --dry-run           Validate query without executing
  --preview <rows>    Show preview of results
  --no-analysis       Skip automatic data analysis
  --format <type>     Output format (csv, json, table)
```

## 📊 Example Queries

### Basic Data Exploration
```sql
-- queries/examples/basic-exploration.sql
SELECT 
  COUNT(*) as total_rows,
  COUNT(DISTINCT column_name) as unique_values,
  MIN(date_column) as earliest_date,
  MAX(date_column) as latest_date
FROM `your-project.your-dataset.your-table`
WHERE date_column >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
```

### Performance Monitoring
```sql
-- queries/examples/query-performance.sql
SELECT
  job_id,
  query,
  total_bytes_processed,
  total_slot_ms,
  creation_time
FROM `your-project.region-us.INFORMATION_SCHEMA.JOBS_BY_PROJECT`
WHERE creation_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)
ORDER BY total_bytes_processed DESC
LIMIT 10
```

### Cost Analysis
```sql
-- queries/examples/cost-analysis.sql
SELECT
  DATE(creation_time) as query_date,
  COUNT(*) as total_queries,
  SUM(total_bytes_processed) as total_bytes,
  AVG(total_bytes_processed) as avg_bytes_per_query
FROM `your-project.region-us.INFORMATION_SCHEMA.JOBS_BY_PROJECT`
WHERE creation_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
GROUP BY DATE(creation_time)
ORDER BY query_date DESC
```

## 🚨 Troubleshooting

### Common Issues

#### Authentication Problems
```bash
# Re-authenticate
gcloud auth login
gcloud auth application-default login

# Check current authentication
gcloud auth list

# Test BigQuery access
bq ls
```

#### Node.js Version Issues
```bash
# Check version
node --version

# Update Node.js (macOS)
brew upgrade node

# Update Node.js (Windows)
winget upgrade OpenJS.NodeJS
```

#### Query Execution Errors
```bash
# Validate query syntax
node run-query.js your-query.sql --dry-run

# Check with cost protection
node safe-query.js your-query.sql

# Enable debug mode
DEBUG=1 node run-query.js your-query.sql
```

#### Permission Issues
```bash
# Check BigQuery permissions
bq show your-dataset-name

# List accessible projects
gcloud projects list

# Set correct project
gcloud config set project your-project-id
```

### Performance Optimization

#### For Large Queries
1. **Use date filters** to limit data volume
2. **Sample data** for exploratory analysis
3. **Break complex queries** into smaller parts
4. **Use views** for frequently accessed data combinations

#### Cost Management
1. **Always dry-run expensive queries first**
2. **Set appropriate byte limits**
3. **Use streaming exports** for large result sets
4. **Monitor query costs** in the Google Cloud Console

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Add your changes and tests
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature-name`
6. Submit a Pull Request

### Development Setup
```bash
# Clone and setup
git clone https://github.com/desktop-commander/bigquery-cli-toolkit.git
cd bigquery-cli-toolkit

# Test installation
node test-installation.js

# Run tests
npm test

# Lint code
npm run lint
```

## 🔗 Desktop Commander Integration

This toolkit was built with [Desktop Commander](https://desktopcommander.app/), an AI-powered command-line interface that brings natural language interaction to your development workflow.

### Using with Desktop Commander

Desktop Commander enables you to:
- **Run queries naturally**: "Analyze user engagement for the last 30 days"
- **Generate reports automatically**: "Create a CSV report of daily metrics"
- **Monitor costs**: "Check if this query is safe to run"
- **Schedule analyses**: "Run this analysis every morning"

### Installation for Desktop Commander Users

```bash
# Clone this toolkit to your workspace
git clone https://github.com/desktop-commander/bigquery-cli-toolkit.git

# Desktop Commander can now help you:
# - Run queries with cost protection
# - Generate and customize analytics reports
# - Automate BigQuery workflows
# - Create custom dashboards
```

Learn more about Desktop Commander at [desktopcommander.app](https://desktopcommander.app/)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏷️ Version

Current version: 1.0.0

---

*A powerful toolkit for BigQuery analytics with built-in safety and automation. Built with [Desktop Commander](https://desktopcommander.app/) to enable seamless BigQuery integration and workflow automation.*
