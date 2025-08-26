#!/usr/bin/env node

/**
 * BigQuery CLI Toolkit - Interactive Demo
 * Runs through key examples to showcase the toolkit capabilities
 */

const { execSync } = require('child_process');
const readline = require('readline');

// Colors for output
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

async function askUser(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

async function runDemo() {
    console.clear();
    colorLog('cyan', '🚀 Welcome to BigQuery CLI Toolkit Demo!');
    console.log();
    
    colorLog('blue', 'This interactive demo will show you:');
    console.log('  📊 Real-world analytics queries');
    console.log('  💰 Cost protection features');
    console.log('  📈 Automatic CSV output and analysis');
    console.log('  🔍 Public dataset exploration');
    console.log();
    
    const examples = [
        {
            name: '📺 Trending Wikipedia Articles',
            file: 'queries/examples/public-wikipedia-trending.sql',
            description: 'See what\'s trending on Wikipedia right now'
        },
        {
            name: '💻 GitHub Programming Languages',
            file: 'queries/examples/public-github-languages.sql', 
            description: 'Analyze programming language popularity from GitHub data'
        },
        {
            name: '📊 Web Analytics Insights',
            file: 'queries/examples/public-google-analytics.sql',
            description: 'Business analytics with Google Analytics sample data'
        },
        {
            name: '🚕 NYC Taxi Business Intelligence',
            file: 'queries/examples/public-nyc-taxi-insights.sql',
            description: 'Real-world BI analysis with NYC taxi data'
        },
        {
            name: '💰 Your BigQuery Usage & Costs',
            file: 'queries/examples/query-performance.sql',
            description: 'Monitor your BigQuery usage and spending'
        }
    ];
    
    colorLog('yellow', 'Choose examples to run (or type "all" to run everything):');
    console.log();
    
    examples.forEach((example, i) => {
        console.log(`  ${i + 1}. ${example.name}`);
        console.log(`     ${example.description}`);
    });
    console.log();
    console.log('  all. Run all examples');
    console.log('  exit. Skip demo');
    console.log();
    
    const choice = await askUser('Enter your choice (1-5, all, or exit): ');
    
    if (choice.toLowerCase() === 'exit') {
        colorLog('green', '👋 Thanks for trying BigQuery CLI Toolkit!');
        process.exit(0);
    }
    
    let selectedExamples = [];
    
    if (choice.toLowerCase() === 'all') {
        selectedExamples = examples;
    } else {
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < examples.length) {
            selectedExamples = [examples[index]];
        } else {
            colorLog('red', '❌ Invalid choice');
            process.exit(1);
        }
    }
    
    console.log();
    colorLog('blue', '🔍 Running queries with cost protection...');
    console.log();
    
    for (const example of selectedExamples) {
        colorLog('cyan', `\n▶️  Running: ${example.name}`);
        colorLog('yellow', `📄 Query: ${example.file}`);
        
        try {
            // Use safe-query for cost protection and preview
            const result = execSync(`node run-query.js "${example.file}" --preview 5`, {
                encoding: 'utf8',
                stdio: 'inherit'
            });
            
            colorLog('green', '✅ Query completed successfully!');
            
            if (selectedExamples.length > 1) {
                await askUser('\nPress Enter to continue to next example...');
            }
            
        } catch (error) {
            colorLog('yellow', `⚠️  Query skipped (may need authentication): ${example.name}`);
        }
    }
    
    console.log();
    colorLog('green', '🎉 Demo completed!');
    console.log();
    console.log('Next steps:');
    console.log('  • Customize the example queries for your data');
    console.log('  • Check out queries/templates/ for more advanced patterns');
    console.log('  • Read documentation/ for best practices');
    console.log('  • Use node safe-query.js for cost-sensitive queries');
    console.log();
    colorLog('blue', 'Happy analyzing! 📊');
}

// Check if we're being run directly
if (require.main === module) {
    runDemo().catch(error => {
        console.error('Demo error:', error);
        process.exit(1);
    });
}

module.exports = { runDemo };
