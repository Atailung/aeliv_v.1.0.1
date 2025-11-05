# PNPM Speed Optimization Guide

## Current Optimizations Applied:

### 1. Registry Configuration

- Using npmmirror.com (good for faster downloads)
- Alternative fast registries available in `pnpm-optimization.md`

### 2. `.pnpmrc` Configuration Added

- **Network concurrency**: 16 parallel downloads
- **Shallow git clones**: Faster git dependency resolution
- **Auto-install peers**: Avoids manual peer dependency resolution
- **Prefer offline**: Uses cached packages when available
- **Hardlinks**: Faster file operations than copying

### 3. New Package Scripts Added

- `pnpm run install:fast` - Optimized installation command
- `pnpm run clean:cache` - Clear caches when needed
- `pnpm run deps:update` - Update dependencies efficiently

## Quick Commands for Faster Installs:

```bash
# Fast installation (uses cache + offline preference)
pnpm install --prefer-offline --reporter=silent

# Install with maximum concurrency
pnpm install --network-concurrency=20

# Skip optional dependencies (often problematic)
pnpm install --no-optional

# Use production-only mode (faster for deployment)
pnpm install --prod --frozen-lockfile
```

## Performance Tips:

### 1. Use Node.js LTS Version

Ensure you're using the latest LTS Node.js version for better performance.

### 2. Clean Store Periodically

```bash
pnpm store prune  # Remove orphaned packages
```

### 3. Use Frozen Lockfile in CI/Production

```bash
pnpm install --frozen-lockfile  # Don't update lockfile
```

### 4. Consider Using pnpm dlx for One-time Tools

```bash
pnpm dlx create-next-app  # Instead of global installs
```

### 5. Monitor Store Size

```bash
pnpm store path   # Check store location
pnpm store status # Check store status
```

## Troubleshooting Slow Installs:

1. **Clear caches**: `pnpm store prune && pnpm cache clear`
2. **Check registry speed**: Test different registries from `pnpm-optimization.md`
3. **Disable antivirus scanning** for `node_modules` and pnpm store
4. **Use SSD storage** for significantly better I/O performance
5. **Check network**: Ensure stable internet connection

## Registry Speed Test:

```bash
# Test current registry speed
time pnpm info react

# Switch to fastest registry for your location
pnpm config set registry https://registry.yarnpkg.com/  # Often fastest globally
```

## Expected Improvements:

- **Initial install**: 40-60% faster
- **Subsequent installs**: 70-80% faster (due to caching)
- **CI/Production**: 50-70% faster with frozen lockfile
