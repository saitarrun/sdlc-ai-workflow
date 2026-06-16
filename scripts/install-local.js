#!/usr/bin/env node

/**
 * Install SDLC Workflow Plugin Locally
 * Copies agents, skills, and commands to ~/.claude/ for immediate use
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PLUGIN_DIR = path.join(__dirname, '..');
const CLAUDE_HOME = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');

const DIRS_TO_COPY = [
  { src: 'agents', dest: 'agents/sdlc-workflow' },
  { src: 'skills', dest: 'skills' },
  { src: 'commands', dest: 'commands/sdlc-workflow' },
];

console.log('📦 Installing SDLC Workflow Plugin...\n');

// Ensure ~/.claude exists
if (!fs.existsSync(CLAUDE_HOME)) {
  fs.mkdirSync(CLAUDE_HOME, { recursive: true });
  console.log(`✓ Created ${CLAUDE_HOME}`);
}

// Copy files
DIRS_TO_COPY.forEach(({ src, dest }) => {
  const srcPath = path.join(PLUGIN_DIR, src);
  const destPath = path.join(CLAUDE_HOME, dest);

  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Source not found: ${srcPath}`);
    process.exit(1);
  }

  // Remove existing destination if it exists
  if (fs.existsSync(destPath)) {
    console.log(`  Updating ${dest}...`);
    execSync(`rm -rf "${destPath}"`);
  }

  // Copy
  execSync(`cp -r "${srcPath}" "${destPath}"`);
  console.log(`✓ Installed ${src} → ${dest}`);
});

console.log('\n✅ SDLC Workflow plugin installed successfully!\n');
console.log('Available commands:');
console.log('  /sdlc                    Master orchestrator (all 6 phases)');
console.log('  /sdlc-plan               Phase 1: Planning & requirements');
console.log('  /sdlc-design             Phase 2: Design & UX');
console.log('  /sdlc-dev                Phase 3: Development');
console.log('  /sdlc-test               Phase 4: Testing & security');
console.log('  /sdlc-deploy             Phase 5: Deployment & CI/CD');
console.log('  /sdlc-ops                Phase 6: Operations & monitoring');
console.log('  /sdlc-review             Code review (any phase)');
console.log('\nRestart Claude Code to activate the plugin.');
