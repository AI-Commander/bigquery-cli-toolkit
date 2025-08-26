#!/usr/bin/env node

/**
 * Universal BigQuery Runner
 * Usage: node run-query.js <query.sql> [options]
 * 
 * Takes any SQL file and outputs CSV with automatic cost handling
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

function colorLog(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
           new Date().toTimeString().split(' ')[0].replace(/:/g, '');
}

function showUsage() {
    colorLog('cyan', 'Universal BigQuery Runner');
    console.log();
    console.log('Usage: node run-query.js <query.sql> [options]');
    console.log();
    console.log('Options:');
    console.log('  --limit <bytes>     Set byte limit (default: 15000000000 = 15GB)');
    console.log('  --output <file>     Set output filename (default: auto-generated)');
    console.log('  --preview <lines>   Preview first N lines (default: 10)');
    console.log('  --dry-run          Only run dry run, don\'t execute');
    console.log('  --help             Show this help');
    console.log();
    console.log('Examples:');
    console.log('  node run-query.js my-analysis.sql');
    console.log('  node run-query.js top-10-records.sql --output results.csv');
    console.log('  node run-query.js large-query.sql --limit 20000000000');
    console.log('  node run-query.js test.sql --dry-run');
    console.log();
    console.log('Auto-generated output: <query-name>_<timestamp>.csv');
}

function parseArgs() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        showUsage();
        process.exit(0);
    }
    
    const queryFile = args[0];
    const options = {
        limit: 15000000000, // 15GB default
        output: null,
        preview: 10,
        dryRun: false
    };
    
    for (let i = 1; i < args.length; i++) {
        switch (args[i]) {
            case '--limit':
                options.limit = parseInt(args[++i]) || options.limit;
                break;
            case '--output':
                options.output = args[++i];
                break;
            case '--preview':
                options.preview = parseInt(args[++i]) || options.preview;
                break;
            case '--dry-run':
                options.dryRun = true;
                break;
        }
    }
    
    return { queryFile, options };
}

function generateOutputFilename(queryFile) {
    const timestamp = getTimestamp();
    const baseName = path.basename(queryFile, '.sql');
    return `${baseName}_${timestamp}.csv`;
}

function runDryRun(tempQuery) {
    try {
        colorLog('blue', '💰 Running dry run to check cost...');
        const dryCmd = `bq query --dry_run --use_legacy_sql=false --format=json < ${tempQuery}`;
        const dryResult = execSync(dryCmd, { 
            encoding: 'utf8', 
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true
        });
        
        const result = JSON.parse(dryResult);
        const bytesProcessed = parseInt(result.totalBytesProcessed || 0);
        const costEstimate = (bytesProcessed / 1099511627776 * 5).toFixed(4);
        const sizeGB = (bytesProcessed / 1073741824).toFixed(2);
        
        colorLog('yellow', `📊 Will process: ${sizeGB}GB`);
        colorLog('yellow', `💰 Estimated cost: $${costEstimate}`);
        
        return { bytesProcessed, costEstimate };
        
    } catch (error) {
        colorLog('yellow', '⚠️  Dry run failed, proceeding anyway...');
        return { bytesProcessed: 0, costEstimate: '0.0000' };
    }
}

function analyzeResults(content, queryFile) {
    const lines = content.split('\n').filter(l => l.trim());
    
    if (lines.length <= 1) {
        colorLog('yellow', '⚠️  No data returned');
        return;
    }
    
    const dataLines = lines.slice(1);
    colorLog('green', `📊 Results: ${dataLines.length} rows`);
    
    // Try to detect data patterns for better analysis
    const header = lines[0].toLowerCase();
    const firstRow = dataLines[0]?.split(',') || [];
    
    if (header.includes('user') || header.includes('client')) {
        console.log('\n👥 User/Client Analysis Detected:');
        const entities = new Set();
        dataLines.forEach(line => {
            const cols = line.split(',');
            const entityIdx = header.split(',').findIndex(h => h.includes('user') || h.includes('client'));
            if (entityIdx >= 0 && cols[entityIdx]) {
                entities.add(cols[entityIdx]);
            }
        });
        console.log(`   Unique entities: ${entities.size}`);
        if (entities.size <= 10) {
            console.log(`   Entities: ${Array.from(entities).join(', ')}`);
        }
    }
    
    if (header.includes('count') || header.includes('total') || header.includes('sum')) {
        console.log('\n📈 Metrics Analysis Detected:');
        let totalValue = 0;
        dataLines.forEach(line => {
            const cols = line.split(',');
            const valueIdx = header.split(',').findIndex(h => h.includes('count') || h.includes('total') || h.includes('sum'));
            if (valueIdx >= 0) {
                totalValue += parseInt(cols[valueIdx]) || 0;
            }
        });
        if (totalValue > 0) {
            console.log(`   Total value: ${totalValue.toLocaleString()}`);
        }
    }
    
    if (header.includes('date') || header.includes('timestamp')) {
        console.log('\n📅 Time Series Detected:');
        const dates = new Set();
        dataLines.forEach(line => {
            const cols = line.split(',');
            const dateIdx = header.split(',').findIndex(h => h.includes('date') || h.includes('timestamp'));
            if (dateIdx >= 0 && cols[dateIdx]) {
                dates.add(cols[dateIdx]);
            }
        });
        console.log(`   Time points: ${dates.size}`);
    }
}

async function runQuery() {
    try {
        const { queryFile, options } = parseArgs();
        
        // Resolve file path
        const fullQueryPath = path.isAbsolute(queryFile) ? queryFile : path.join(__dirname, queryFile);
        
        if (!fs.existsSync(fullQueryPath)) {
            colorLog('red', `❌ Query file not found: ${fullQueryPath}`);
            process.exit(1);
        }
        
        // Generate output filename
        const outputFile = options.output || generateOutputFilename(queryFile);
        const fullOutputPath = path.isAbsolute(outputFile) ? outputFile : path.join(__dirname, outputFile);
        
        // Create results directory if it doesn't exist
        const outputDir = path.dirname(fullOutputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        colorLog('cyan', '🚀 Universal BigQuery Runner');
        colorLog('blue', `📄 Query: ${queryFile}`);
        colorLog('blue', `📁 Output: ${outputFile}`);
        colorLog('blue', `💰 Limit: ${(options.limit / 1073741824).toFixed(1)}GB`);
        
        // Prepare query
        const query = fs.readFileSync(fullQueryPath, 'utf8');
        const tempQuery = `temp_universal_${Date.now()}.sql`;
        fs.writeFileSync(tempQuery, query);
        
        // Run dry run
        const dryRunResult = runDryRun(tempQuery);
        
        if (options.dryRun) {
            colorLog('green', '✅ Dry run completed');
            try { fs.unlinkSync(tempQuery); } catch (e) {}
            return;
        }
        
        // Run actual query
        colorLog('blue', '▶️  Running BigQuery...');
        const cmd = `bq query --use_legacy_sql=false --format=csv --maximum_bytes_billed=${options.limit} < ${tempQuery}`;
        
        try {
            const result = execSync(cmd, { 
                encoding: 'utf8', 
                stdio: ['pipe', 'pipe', 'pipe'],
                shell: true
            });
            
            colorLog('green', '✅ Query completed successfully!');
            fs.writeFileSync(fullOutputPath, result);
            
            const stats = fs.statSync(fullOutputPath);
            colorLog('green', `📁 Saved: ${outputFile} (${(stats.size/1024).toFixed(1)}KB)`);
            
            // Show preview
            const content = fs.readFileSync(fullOutputPath, 'utf8');
            const lines = content.split('\n').filter(l => l.trim());
            
            if (lines.length > 1) {
                console.log(`\n📋 Preview (first ${options.preview} rows):`);
                console.log('=' .repeat(80));
                console.log(lines[0]); // Header
                console.log('-'.repeat(80));
                
                lines.slice(1, options.preview + 1).forEach((line, i) => {
                    console.log(`${(i+1).toString().padStart(2)}: ${line.length > 120 ? line.substring(0, 120) + '...' : line}`);
                });
                
                if (lines.length > options.preview + 1) {
                    console.log(`    ... and ${lines.length - options.preview - 1} more rows`);
                }
                
                // Auto-analyze results
                analyzeResults(content, queryFile);
            }
            
        } catch (execError) {
            if (execError.stdout && execError.stdout.trim()) {
                colorLog('yellow', '⚠️  Query completed with warnings...');
                fs.writeFileSync(fullOutputPath, execError.stdout);
                colorLog('green', `📁 Results saved: ${outputFile}`);
                
                // Show error details if it's a meaningful error
                if (execError.stderr && !execError.stderr.includes('Waiting on bqjob')) {
                    console.log('\nError details:');
                    console.log(execError.stderr);
                }
            } else {
                colorLog('red', `❌ BigQuery Error: ${execError.message}`);
            }
        }
        
        // Cleanup
        try { fs.unlinkSync(tempQuery); } catch (e) {}
        
    } catch (error) {
        colorLog('red', `❌ Script Error: ${error.message}`);
        process.exit(1);
    }
}

runQuery();
