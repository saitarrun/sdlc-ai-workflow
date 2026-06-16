#!/usr/bin/env node

/**
 * Validate SDLC Workflow Plugin Structure
 * Ensures all required files and fields are present
 */

const fs = require('fs');
const path = require('path');

const PLUGIN_DIR = path.dirname(__dirname);
let errors = [];
let warnings = [];

console.log('🔍 Validating SDLC Workflow Plugin...\n');

// Check directory structure
const requiredDirs = ['agents', 'skills', 'commands', '.claude-plugin'];
requiredDirs.forEach((dir) => {
  const fullPath = path.join(PLUGIN_DIR, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${dir}/`);
  } else {
    errors.push(`Missing directory: ${dir}/`);
  }
});

// Check agents
console.log('\n📋 Checking agents...');
const agentsDir = path.join(PLUGIN_DIR, 'agents');
if (fs.existsSync(agentsDir)) {
  const agents = fs.readdirSync(agentsDir).filter((f) => f.endsWith('.md'));
  agents.forEach((agent) => {
    const content = fs.readFileSync(path.join(agentsDir, agent), 'utf8');
    const hasFrontmatter = content.includes('---');
    const hasName = content.includes('name:');
    const hasDescription = content.includes('description:');
    const hasTools = content.includes('tools:');
    const hasModel = content.includes('model:');

    if (hasFrontmatter && hasName && hasDescription && hasTools && hasModel) {
      console.log(`  ✓ ${agent}`);
    } else {
      errors.push(`Invalid agent format: ${agent} (missing frontmatter fields)`);
    }
  });
}

// Check skills
console.log('\n🎯 Checking skills...');
const skillsDir = path.join(PLUGIN_DIR, 'skills');
if (fs.existsSync(skillsDir)) {
  const skills = fs.readdirSync(skillsDir);
  skills.forEach((skill) => {
    const skillFile = path.join(skillsDir, skill, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      const content = fs.readFileSync(skillFile, 'utf8');
      const hasName = content.includes('name:');
      const hasDescription = content.includes('description:');
      if (hasName && hasDescription) {
        console.log(`  ✓ ${skill}`);
      } else {
        errors.push(`Invalid skill format: ${skill}/SKILL.md`);
      }
    }
  });
}

// Check commands
console.log('\n⚙️  Checking commands...');
const commandsDir = path.join(PLUGIN_DIR, 'commands');
if (fs.existsSync(commandsDir)) {
  const commands = fs.readdirSync(commandsDir).filter((f) => f.endsWith('.md'));
  commands.forEach((cmd) => {
    const content = fs.readFileSync(path.join(commandsDir, cmd), 'utf8');
    if (content.includes('description:')) {
      console.log(`  ✓ ${cmd}`);
    } else {
      warnings.push(`Command missing description: ${cmd}`);
    }
  });
}

// Check plugin.json
console.log('\n🔧 Checking plugin configuration...');
const pluginJsonPath = path.join(PLUGIN_DIR, '.claude-plugin', 'plugin.json');
if (fs.existsSync(pluginJsonPath)) {
  try {
    const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
    if (pluginJson.name && pluginJson.version) {
      console.log(`  ✓ plugin.json (v${pluginJson.version})`);
    } else {
      errors.push('plugin.json missing name or version');
    }
  } catch (e) {
    errors.push(`Invalid plugin.json: ${e.message}`);
  }
}

// Summary
console.log('\n' + '='.repeat(50));
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ Plugin validation passed!');
  console.log('\nReady to install with: npm run install-local');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} error(s) found:`);
    errors.forEach((e) => console.log(`  - ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`  - ${w}`));
  }
  process.exit(errors.length > 0 ? 1 : 0);
}
