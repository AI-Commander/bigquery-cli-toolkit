#!/usr/bin/env node

/**
 * BigQuery View Creator
 * Usage: node create-view.js <view-name> <query.sql> [options]
 * 
 * Creates BigQuery views from SQL files
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

function showUsage() {
    colorLog('cyan', 'BigQuery View Creator');
    console.log();
    console.log('Usage: node create-view.js <view-name> <query.sql> [options]');
    console.log();
    console.log('Options:');
    console.log('  --dataset <name>    Dataset name (default: mcp)');
    console.log('  --project <name>    Project ID (default: airy-runway-456110-g5)');
    console.log('  --description <text> View description');
    console.log('  --replace           Replace existing view');
    console.log('  --dry-run          Show the command without executing');
    console.log('  --help             Show this help');
    console.log();
    console.log('Examples:');
    console.log('  node create-view.js docker_trends docker-dual-trends.sql');
    console.log('  node create-view.js client_averages docker-client-averages.sql --description "Docker client daily averages"');
    console.log('  node create-view.js test_view query.sql --dataset analytics --replace');
    console.log();
    console.log('The view will be created as: project.dataset.view_name');
}

function parseArgs() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        showUsage();
        process.exit(0);
    }
    
    const viewName = args[0];
    const queryFile = args[1];
    
    if (!viewName || !queryFile) {
        colorLog('red', '❌ Both view name and query file are required');
        showUsage();
        process.exit(1);
    }
    
    const options = {
        dataset: 'mcp',
        project: 'airy-runway-456110-g5',
        description: '',
        replace: false,
        dryRun: false
    };
    
    for (let i = 2; i < args.length; i++) {
        switch (args[i]) {
            case '--dataset':
                options.dataset = args[++i];
                break;
            case '--project':
                options.project = args[++i];
                break;
            case '--description':
                options.description = args[++i];
                break;
            case '--replace':
                options.replace = true;
                break;
            case '--dry-run':
                options.dryRun = true;
                break;
        }
    }
    
    return { viewName, queryFile, options };
}

async function createView() {
    try {
        const { viewName, queryFile, options } = parseArgs();
        
        // Resolve file path
        const fullQueryPath = path.isAbsolute(queryFile) ? queryFile : path.join(__dirname, queryFile);
        
        if (!fs.existsSync(fullQueryPath)) {
            colorLog('red', `❌ Query file not found: ${fullQueryPath}`);
            process.exit(1);
        }
        
        const fullViewName = `${options.project}.${options.dataset}.${viewName}`;
        
        colorLog('cyan', '🔨 BigQuery View Creator');
        colorLog('blue', `📄 Query file: ${queryFile}`);
        colorLog('blue', `🎯 View name: ${fullViewName}`);
        colorLog('blue', `📝 Description: ${options.description || 'No description'}`);
        
        // Read and prepare the query
        const query = fs.readFileSync(fullQueryPath, 'utf8').trim();
        
        // Create temp file for the view creation
        const tempQuery = `temp_view_${Date.now()}.sql`;
        
        // Build the CREATE VIEW statement
        let viewStatement = '';
        
        if (options.replace) {
            viewStatement += `CREATE OR REPLACE VIEW \`${fullViewName}\``;
        } else {
            viewStatement += `CREATE VIEW \`${fullViewName}\``;
        }
        
        if (options.description) {
            viewStatement += `\nOPTIONS(description="${options.description}")`;
        }
        
        viewStatement += '\nAS\n' + query;
        
        fs.writeFileSync(tempQuery, viewStatement);
        
        if (options.dryRun) {
            colorLog('yellow', '🔍 Dry run - Command that would be executed:');
            console.log();
            console.log(viewStatement);
            console.log();
            colorLog('blue', `bq query --use_legacy_sql=false < ${tempQuery}`);
        } else {
            colorLog('blue', '▶️  Creating BigQuery view...');
            
            const cmd = `bq query --use_legacy_sql=false < ${tempQuery}`;
            
            try {
                const result = execSync(cmd, { 
                    encoding: 'utf8', 
                    stdio: ['pipe', 'pipe', 'pipe'],
                    shell: true
                });
                
                colorLog('green', '✅ View created successfully!');
                colorLog('green', `🎯 View: ${fullViewName}`);
                
                // Test the view with a simple query
                colorLog('blue', '🧪 Testing view with SELECT * LIMIT 5...');
                const testCmd = `echo "SELECT * FROM \`${fullViewName}\` LIMIT 5" | bq query --use_legacy_sql=false`;
                
                try {
                    const testResult = execSync(testCmd, { 
                        encoding: 'utf8', 
                        stdio: ['pipe', 'pipe', 'pipe'],
                        shell: true
                    });
                    
                    colorLog('green', '✅ View test successful!');
                    console.log('\nSample results:');
                    console.log(testResult);
                    
                } catch (testError) {
                    colorLog('yellow', '⚠️  View created but test failed - check the view manually');
                }
                
            } catch (execError) {
                if (execError.stdout && execError.stdout.trim()) {
                    colorLog('yellow', '⚠️  View creation completed with warnings...');
                    console.log(execError.stdout);
                } else {
                    colorLog('red', `❌ View creation failed: ${execError.message}`);
                    if (execError.stderr) {
                        console.log('Error details:', execError.stderr);
                    }
                }
            }
        }
        
        // Cleanup
        try { fs.unlinkSync(tempQuery); } catch (e) {}
        
        if (!options.dryRun) {
            console.log();
            colorLog('yellow', '💡 Usage tips:');
            console.log(`   • Query the view: SELECT * FROM \`${fullViewName}\``);
            console.log(`   • In code: FROM \`${options.project}.${options.dataset}.${viewName}\``);
            console.log(`   • Delete view: DROP VIEW \`${fullViewName}\``);
        }
        
    } catch (error) {
        colorLog('red', `❌ Script Error: ${error.message}`);
        process.exit(1);
    }
}

createView();