#!/usr/bin/env node

/**
 * Install SDLC Workflow Plugin Locally
 * Copies agents, skills, and commands to ~/.claude/ for immediate use.
 * Agents and commands go in their own plugin subdirectory; skills are copied
 * individually so the user's existing ~/.claude content is never clobbered.
 */

const fs = require('fs');
const path = require('path');

const PLUGIN_DIR = path.join(__dirname, '..');
const CLAUDE_HOME = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');

console.log('📦 Installing SDLC Workflow Plugin...\n');

if (!fs.existsSync(CLAUDE_HOME)) {
  fs.mkdirSync(CLAUDE_HOME, { recursive: true });
  console.log(`✓ Created ${CLAUDE_HOME}`);
}

function replaceDir(src, dest, label) {
  if (!fs.existsSync(src)) {
    console.error(`❌ Source not found: ${src}`);
    process.exit(1);
  }
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`✓ Installed ${label}`);
}

// Agents and commands are namespaced under their own subdirectory.
replaceDir(
  path.join(PLUGIN_DIR, 'agents'),
  path.join(CLAUDE_HOME, 'agents', 'sdlc-workflow'),
  'agents → agents/sdlc-workflow',
);
replaceDir(
  path.join(PLUGIN_DIR, 'commands'),
  path.join(CLAUDE_HOME, 'commands', 'sdlc-workflow'),
  'commands → commands/sdlc-workflow',
);

// Skills are copied one directory at a time so we only touch our own skills.
const skillsSrc = path.join(PLUGIN_DIR, 'skills');
fs.readdirSync(skillsSrc)
  .filter((entry) => fs.statSync(path.join(skillsSrc, entry)).isDirectory())
  .forEach((skill) => {
    replaceDir(
      path.join(skillsSrc, skill),
      path.join(CLAUDE_HOME, 'skills', skill),
      `skills/${skill}`,
    );
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
console.log('  /sdlc-parallel           Run a phase with agents in parallel');
console.log('\nRestart Claude Code to activate the plugin.');
