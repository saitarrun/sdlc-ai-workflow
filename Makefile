.PHONY: install-local uninstall validate help

help:
	@echo "SDLC Workflow Plugin — Development Makefile"
	@echo ""
	@echo "Targets:"
	@echo "  make install-local  — Copy plugin files to ~/.claude/ for immediate use"
	@echo "  make uninstall      — Remove plugin files from ~/.claude/"
	@echo "  make validate       — Check that all required files exist"
	@echo "  make help           — Show this message"

# Delegate to the Node scripts so `make` and `npm`/CLI installs use the
# identical layout under ~/.claude/.
install-local: validate
	@node scripts/install-local.js

uninstall:
	@node scripts/uninstall.js

validate:
	@node scripts/validate-plugin.js
