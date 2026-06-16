#!/usr/bin/env node

/**
 * SDLC Workflow Plugin CLI
 * Entry point for the globally installed `sdlc-workflow` command.
 * Dispatches to the install/uninstall/validate scripts.
 */

const path = require('path');
const { execFileSync } = require('child_process');

const SCRIPTS_DIR = __dirname;
const pkg = require('../package.json');

const SCRIPTS = {
  install: 'install-local.js',
  uninstall: 'uninstall.js',
  validate: 'validate-plugin.js',
};

function runScript(script) {
  execFileSync(process.execPath, [path.join(SCRIPTS_DIR, script)], { stdio: 'inherit' });
}

function printHelp() {
  console.log(`sdlc-workflow v${pkg.version}\n`);
  console.log('Usage: sdlc-workflow <command>\n');
  console.log('Commands:');
  console.log('  install     Copy agents, skills, and commands into ~/.claude/');
  console.log('  uninstall   Remove the plugin from ~/.claude/');
  console.log('  validate    Check the plugin structure');
  console.log('  help        Show this message');
  console.log('  version     Print the plugin version');
}

const command = process.argv[2] || 'help';

try {
  switch (command) {
    case 'install':
    case 'uninstall':
    case 'validate':
      runScript(SCRIPTS[command]);
      break;
    case 'version':
    case '--version':
    case '-v':
      console.log(pkg.version);
      break;
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      break;
    default:
      console.error(`Unknown command: ${command}\n`);
      printHelp();
      process.exit(1);
  }
} catch (err) {
  // execFileSync throws when the child process exits non-zero; propagate its code.
  process.exit(err.status || 1);
}
