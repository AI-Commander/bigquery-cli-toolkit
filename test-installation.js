#!/usr/bin/env node

/**
 * Installation Test Script
 * Verifies that all required dependencies and tools are properly installed
 */

const fs = require('fs');
const { execSync } = require('child_process');

// Colors for output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command, name, required = true) {
    try {
        const output = execSync(command, { stdio: 'pipe', encoding: 'utf8' });
        log('green', `✓ ${name} is installed: ${output.trim().split('\n')[0]}`);
        return true;
    } catch (error) {
        if (required) {
            log('red', `✗ ${name} is not installed or not in PATH`);
        } else {
            log('yellow', `⚠ ${name} is not installed (optional)`);
        }
        return false;
    }
}

function checkFile(filePath, name) {
    if (fs.existsSync(filePath)) {
        log('green', `✓ ${name} exists: ${filePath}`);
        return true;
    } else {
        log('red', `✗ ${name} not found: ${filePath}`);
        return false;
    }
}

console.log('🚀 BigQuery CLI for Desktop Commander - Installation Test\n');

// Check Node.js version
log('blue', '📋 Checking Node.js requirements...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 14) {
    log('green', `✓ Node.js version ${nodeVersion} meets requirements (>=14.0.0)`);
} else {
    log('red', `✗ Node.js version ${nodeVersion} does not meet requirements (>=14.0.0)`);
}

// Check core files
log('blue', '\n📋 Checking core files...');
const coreFiles = [
    ['./package.json', 'package.json'],
    ['./safe-query.js', 'safe-query.js'],
    ['./run-query.js', 'run-query.js'],
    ['./create-view.js', 'create-view.js'],
    ['./queries', 'queries directory'],
    ['./documentation', 'documentation directory']
];

let allFilesExist = true;
coreFiles.forEach(([path, name]) => {
    if (!checkFile(path, name)) {
        allFilesExist = false;
    }
});

// Check external dependencies
log('blue', '\n📋 Checking external dependencies...');
const googleCloudInstalled = checkCommand('gcloud --version', 'Google Cloud SDK', true);
const bigqueryInstalled = checkCommand('bq version', 'BigQuery CLI', true);
const gitInstalled = checkCommand('git --version', 'Git', false);
const ghInstalled = checkCommand('gh --version', 'GitHub CLI', false);

// Check authentication
log('blue', '\n📋 Checking authentication...');
let authOk = false;
try {
    execSync('gcloud auth list --filter=status:ACTIVE --format="value(account)"', { stdio: 'pipe' });
    log('green', '✓ Google Cloud authentication is active');
    authOk = true;
} catch (error) {
    log('yellow', '⚠ Google Cloud authentication not detected - run "gcloud auth login"');
}

// Test BigQuery access
if (bigqueryInstalled && authOk) {
    try {
        execSync('bq ls --max_results=1', { stdio: 'pipe' });
        log('green', '✓ BigQuery CLI access confirmed');
    } catch (error) {
        log('yellow', '⚠ BigQuery access test failed - check permissions and project setup');
    }
}

// Check directory structure
log('blue', '\n📋 Checking directory structure...');
const directories = ['queries', 'results', 'scripts', 'dashboards', 'documentation'];
directories.forEach(dir => {
    checkFile(`./${dir}`, `${dir} directory`);
});

// Test core functionality
log('blue', '\n📋 Testing core functionality...');
try {
    const helpOutput = execSync('node safe-query.js --help', { stdio: 'pipe', encoding: 'utf8' });
    if (helpOutput.includes('Usage:') || helpOutput.includes('Safe BigQuery')) {
        log('green', '✓ safe-query.js help command works');
    } else {
        log('yellow', '⚠ safe-query.js help output unexpected');
    }
} catch (error) {
    log('red', '✗ safe-query.js help command failed');
}

try {
    const runHelpOutput = execSync('node run-query.js --help', { stdio: 'pipe', encoding: 'utf8' });
    if (runHelpOutput.includes('Usage:') || runHelpOutput.includes('Universal')) {
        log('green', '✓ run-query.js help command works');
    } else {
        log('yellow', '⚠ run-query.js help output unexpected');
    }
} catch (error) {
    log('red', '✗ run-query.js help command failed');
}

// Summary
log('blue', '\n📋 Installation Summary:');
if (allFilesExist && googleCloudInstalled && bigqueryInstalled && majorVersion >= 14) {
    log('green', '🎉 Installation appears to be complete and ready to use!');
    log('blue', '\nNext steps:');
    log('blue', '1. Authenticate: gcloud auth login');
    log('blue', '2. Set project: gcloud config set project YOUR_PROJECT_ID');
    log('blue', '3. Test query: node safe-query.js queries/test-query.sql');
} else {
    log('yellow', '⚠ Installation has some issues that need to be addressed');
    log('blue', '\nPlease check the items marked with ✗ or ⚠ above');
}

log('blue', '\nFor more information, see: README.md');
log('blue', 'Repository: https://github.com/wonderwhy-er/BigQuery-CLI-for-Desktop-Commander\n');
