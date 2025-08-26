#!/usr/bin/env node

/**
 * Safe BigQuery Query Runner with Cost Protection
 * Node.js version of safe-query.sh
 * 
 * Usage: node safe-query.js <query_file> [max_bytes]
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

// Helper function for colored output
function colorLog(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Helper function to convert bytes to human readable format
function formatBytes(bytes) {
    const TB = 1099511627776;
    const GB = 1073741824;
    const MB = 1048576;
    
    if (bytes >= TB) {
        return `${(bytes / TB).toFixed(2)}TB`;
    } else if (bytes >= GB) {
        return `${(bytes / GB).toFixed(2)}GB`;
    } else if (bytes >= MB) {
        return `${(bytes / MB).toFixed(2)}MB`;
    } else {
        return `${bytes} bytes`;
    }
}

// Helper function to calculate cost
function calculateCost(bytes) {
    const costPerTB = 5;
    const TB = 1099511627776;
    return (bytes / TB * costPerTB).toFixed(4);
}

// Main function
async function safeQuery() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        colorLog('red', 'Usage: node safe-query.js <query_file> [max_bytes]');
        console.log('Examples:');
        console.log('  node safe-query.js query.sql                    # 100MB limit');
        console.log('  node safe-query.js query.sql 1073741824        # 1GB limit');
        console.log('  node safe-query.js query.sql 10485760          # 10MB limit');
        process.exit(1);
    }
    
    const queryFile = args[0];
    const maxBytes = parseInt(args[1]) || 104857600; // Default 100MB
    
    // Check if query file exists
    if (!fs.existsSync(queryFile)) {
        colorLog('red', `❌ Query file not found: ${queryFile}`);
        process.exit(1);
    }
    
    colorLog('blue', '🔍 Validating query (dry run)...');
    
    try {
        // Read the query file
        const query = fs.readFileSync(queryFile, 'utf8');
        
        // Run dry run to estimate cost
        const dryRunCmd = `bq query --dry_run --use_legacy_sql=false --format=json`;
        
        let dryRunResult;
        try {
            dryRunResult = execSync(dryRunCmd, { 
                input: query,
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'pipe']
            });
        } catch (error) {
            colorLog('red', '❌ Query validation failed:');
            console.log(error.stderr || error.message);
            process.exit(1);
        }
        
        // Parse the dry run result
        let bytesProcessed;
        try {
            const result = JSON.parse(dryRunResult);
            bytesProcessed = parseInt(result.totalBytesProcessed || 0);
        } catch (parseError) {
            // Fallback: try to extract bytes from text output
            const bytesMatch = dryRunResult.match(/(\d+(?:,\d{3})*)\s+bytes\s+processed/);
            if (bytesMatch) {
                bytesProcessed = parseInt(bytesMatch[1].replace(/,/g, ''));
            } else {
                colorLog('red', '❌ Could not determine bytes processed');
                console.log('Dry run output:', dryRunResult);
                process.exit(1);
            }
        }
        
        const cost = calculateCost(bytesProcessed);
        
        colorLog('yellow', `📊 Query will process: ${formatNumber(bytesProcessed)} bytes`);
        colorLog('yellow', `💰 Estimated cost: $${cost}`);
        colorLog('yellow', `📏 Size: ${formatBytes(bytesProcessed)}`);
        
        // Check against limit
        if (bytesProcessed > maxBytes) {
            colorLog('red', `⚠️  Query exceeds limit of ${formatNumber(maxBytes)} bytes`);
            
            // Ask for confirmation
            const readline = require('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            const answer = await new Promise(resolve => {
                rl.question('Continue anyway? (y/N): ', resolve);
            });
            rl.close();
            
            if (answer.toLowerCase() !== 'y') {
                colorLog('green', '✅ Query cancelled for safety');
                process.exit(0);
            }
        }
        
        colorLog('blue', '▶️  Running query with byte limit...');
        
        // Run the actual query
        const queryCmd = `bq query --maximum_bytes_billed=${maxBytes} --use_legacy_sql=false`;
        
        const child = spawn('bq', [
            'query',
            `--maximum_bytes_billed=${maxBytes}`,
            '--use_legacy_sql=false'
        ], {
            stdio: ['pipe', 'inherit', 'inherit'],
            shell: true
        });
        
        child.stdin.write(query);
        child.stdin.end();
        
        child.on('close', (code) => {
            if (code === 0) {
                colorLog('green', '✅ Query completed');
            } else {
                colorLog('red', `❌ Query failed with exit code ${code}`);
                process.exit(code);
            }
        });
        
    } catch (error) {
        colorLog('red', `❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Run the script
safeQuery().catch(error => {
    colorLog('red', `❌ Unexpected error: ${error.message}`);
    process.exit(1);
});
