.PHONY: install-local uninstall validate help

PLUGIN_DIR := $(PWD)
CLAUDE_DIR := $(HOME)/.claude
AGENTS_DIR := $(CLAUDE_DIR)/agents
SKILLS_DIR := $(CLAUDE_DIR)/skills
COMMANDS_DIR := $(CLAUDE_DIR)/commands

help:
	@echo "SDLC Workflow Plugin — Development Makefile"
	@echo ""
	@echo "Targets:"
	@echo "  make install-local  — Copy plugin files to ~/.claude/ for immediate use"
	@echo "  make uninstall      — Remove plugin files from ~/.claude/"
	@echo "  make validate       — Check that all required files exist"
	@echo "  make help           — Show this message"

install-local: validate
	@echo "Installing agents to $(AGENTS_DIR)..."
	@mkdir -p $(AGENTS_DIR)
	@cp agents/*.md $(AGENTS_DIR)/
	@echo "Installing skills to $(SKILLS_DIR)..."
	@mkdir -p $(SKILLS_DIR)
	@for skill in skills/*; do \
		if [ -d "$$skill" ]; then \
			mkdir -p $(SKILLS_DIR)/$$(basename $$skill); \
			cp $$skill/* $(SKILLS_DIR)/$$(basename $$skill)/; \
		fi; \
	done
	@echo "Installing commands to $(COMMANDS_DIR)..."
	@mkdir -p $(COMMANDS_DIR)
	@cp commands/*.md $(COMMANDS_DIR)/
	@echo "✓ Installation complete. Plugin is now active."

uninstall:
	@echo "Uninstalling SDLC plugin from $(CLAUDE_DIR)..."
	@rm -f $(AGENTS_DIR)/product-manager.md $(AGENTS_DIR)/business-analyst.md \
		$(AGENTS_DIR)/software-architect.md $(AGENTS_DIR)/security-architect.md \
		$(AGENTS_DIR)/ux-researcher.md $(AGENTS_DIR)/ui-ux-designer.md \
		$(AGENTS_DIR)/frontend-engineer.md $(AGENTS_DIR)/backend-engineer.md \
		$(AGENTS_DIR)/fullstack-engineer.md $(AGENTS_DIR)/database-engineer.md \
		$(AGENTS_DIR)/mobile-developer.md $(AGENTS_DIR)/qa-manual-tester.md \
		$(AGENTS_DIR)/automation-qa-engineer.md $(AGENTS_DIR)/appsec-engineer.md \
		$(AGENTS_DIR)/penetration-tester.md $(AGENTS_DIR)/devops-engineer.md \
		$(AGENTS_DIR)/cloud-engineer.md $(AGENTS_DIR)/sre-engineer.md \
		$(AGENTS_DIR)/secops-analyst.md $(AGENTS_DIR)/data-engineer.md
	@rm -rf $(SKILLS_DIR)/skill-*
	@rm -f $(COMMANDS_DIR)/sdlc*.md
	@echo "✓ Uninstallation complete."

validate:
	@echo "Validating plugin structure..."
	@test -f ".claude-plugin/plugin.json" || (echo "ERROR: Missing .claude-plugin/plugin.json" && exit 1)
	@test -d "agents" || (echo "ERROR: Missing agents/ directory" && exit 1)
	@test -d "skills" || (echo "ERROR: Missing skills/ directory" && exit 1)
	@test -d "commands" || (echo "ERROR: Missing commands/ directory" && exit 1)
	@test -d "scripts" || (echo "ERROR: Missing scripts/ directory" && exit 1)
	@echo "✓ Plugin structure is valid."
