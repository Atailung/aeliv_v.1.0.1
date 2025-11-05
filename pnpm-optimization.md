# Fast Registry Options for pnpm

## 1. Yarn Proxy (Often fastest globally)
pnpm config set registry https://registry.yarnpkg.com/

## 2. npm Mirror (Taobao - Good for Asia)
pnpm config set registry https://registry.npmmirror.com/

## 3. npm Official (Original)
pnpm config set registry https://registry.npmjs.org/

## 4. Cloudflare (Global CDN)
pnpm config set registry https://registry.npmjs.cf/

## 5. jsDelivr (Global CDN)
pnpm config set registry https://registry.npmjs.org/

# To check current registry:
pnpm config get registry

# To revert to default:
pnpm config delete registry