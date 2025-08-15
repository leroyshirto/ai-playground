# AI Playground

AI Playground is a Go CLI application built with the Cobra framework. It serves as a foundation for building command-line tools and applications.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap and build the repository:
  - `go mod download` -- takes 2 seconds. Downloads Go module dependencies.
  - `go build .` -- takes 11 seconds for first build, 0.2 seconds for subsequent builds. NEVER CANCEL. Set timeout to 30+ seconds for safety.
  - Produces binary: `ai-playground`

- Run tests:
  - `go test -v ./...` -- takes 1 second. Currently no test files exist.

- Code quality and formatting:
  - `go fmt ./...` -- formats code instantly
  - `go vet ./...` -- runs static analysis instantly
  - `go mod tidy` -- cleans up go.mod/go.sum instantly

- Linting (compatibility issue):
  - Install golangci-lint: `curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.61.0`
  - **IMPORTANT**: golangci-lint v1.61.0 (built with Go 1.23) is incompatible with Go 1.24.6 due to internal changes
  - **WORKAROUND FAILS**: Even changing go.mod to use Go 1.23 still fails due to Go 1.24.6 runtime incompatibility
  - **RECOMMENDATION**: Use basic Go tools instead: `go fmt ./...` and `go vet ./...` for code quality
  - Alternative: Use `go fmt ./... && go vet ./... && go build .` as a basic quality check

- Cross-compilation:
  - Windows: `GOOS=windows GOARCH=amd64 go build -o ai-playground.exe .` -- takes 6 seconds
  - macOS: `GOOS=darwin GOARCH=amd64 go build -o ai-playground-mac .` -- takes 6 seconds
  - Linux (default): `go build .` -- produces `ai-playground`

- Run the application:
  - `./ai-playground --help` -- shows help information
  - `./ai-playground --toggle` -- demonstrates the toggle flag
  - Application exits with code 0 on success

## Validation

- Always build and test your changes with the full command sequence:
  1. `go mod download`
  2. `go build .`
  3. `./ai-playground --help`
  4. `go test ./...`
  5. `go fmt ./...`
  6. `go vet ./...`

- **MANUAL VALIDATION REQUIREMENT**: After making changes, always test the CLI application by running:
  - `./ai-playground --help` to verify help text displays correctly
  - `./ai-playground --toggle` to test flag functionality
  - Verify the application exits cleanly (exit code 0)

- For code quality validation:
  - `go fmt ./...` -- formats code
  - `go vet ./...` -- runs static analysis
  - `go build .` -- ensures code compiles
  - **Note**: golangci-lint is incompatible with Go 1.24.6, use basic Go tools instead

## Common Tasks

The following information saves time by avoiding repeated commands:

### Repository Structure
```
.
├── cmd/
│   └── root.go          # Main Cobra command definition
├── main.go              # Application entry point
├── go.mod               # Go module definition (Go 1.24.6)
├── go.sum               # Module checksums
└── LICENSE              # Empty license file
```

### Key Files Content

#### go.mod
```
module github.com/leroyshirto/ai-playground

go 1.24.6

require (
    github.com/inconshreveable/mousetrap v1.1.0 // indirect
    github.com/spf13/cobra v1.9.1 // indirect
    github.com/spf13/pflag v1.0.6 // indirect
)
```

#### main.go
Entry point that calls `cmd.Execute()`

#### cmd/root.go
Defines the root Cobra command with:
- Use: "ai-playground"
- Short and long descriptions
- --toggle/-t flag

### Build Artifacts to Ignore
Always add build artifacts to .gitignore:
- `ai-playground` (Linux binary)
- `ai-playground.exe` (Windows binary)
- `ai-playground-mac` (macOS binary)

### Expected Command Times
- `go mod download`: 2 seconds
- `go build .` (first time): 11 seconds
- `go build .` (subsequent): 0.2 seconds  
- `go test ./...`: 1 second
- `go fmt ./...`: instant
- `go vet ./...`: instant
- `golangci-lint run`: NOT COMPATIBLE with Go 1.24.6
- Cross-compilation: 6 seconds per platform

### Application Behavior
- Running `./ai-playground` without arguments shows the long description
- `--help` and `-h` show the same help text
- `--toggle` and `-t` can be used but have no functional effect (skeleton)
- Application always exits with code 0 when run successfully
- No subcommands are currently defined

## Common Issues

1. **golangci-lint incompatibility**: golangci-lint v1.61.0 does not work with Go 1.24.6 due to internal format changes. Use `go fmt ./...` and `go vet ./...` instead.
2. **Missing binary after build**: Check that `go build .` completed successfully
3. **Import path issues**: The module name is `github.com/leroyshirto/ai-playground`

## Development Workflow

When making changes:
1. Edit source files (main.go, cmd/root.go)
2. Format: `go fmt ./...`
3. Build: `go build .`
4. Test manually: `./ai-playground --help`
5. Vet: `go vet ./...`
6. Clean: `rm ai-playground` (or add to .gitignore)

Always ensure the application starts and displays help correctly after changes.