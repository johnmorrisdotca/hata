#!/bin/sh
# `pnpm data` in the image CI's checks run on: Linux on x64, the official Node 24 build. The data step writes gzip sizes
# (src/data/manifest.data.ts, docs/sizes.md), and zlib's bytes depend on the build: a Node that links the system's zlib (as
# Homebrew's does on a Mac) writes other numbers than CI, whose check then fails. Here they are CI's.
#
# The container has a node_modules of its own, kept in a Docker volume over the checkout's, so the host's is never touched,
# and a pnpm store in a second volume, so a second run installs from it. Arguments go on to `pnpm data`.
set -eu
IMAGE="${HATA_DATA_IMAGE:-node:24.22.3-bookworm}"
ROOT=$(cd "$(dirname "$0")/.." && pwd)
exec docker run --rm --platform linux/amd64 \
  -v "$ROOT:/repo" \
  -v hata-data-image-node-modules:/repo/node_modules \
  -v hata-data-image-pnpm-store:/pnpm-store \
  -w /repo \
  -e CI=true \
  -e PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  "$IMAGE" \
  sh -c 'corepack enable && pnpm config set store-dir /pnpm-store >/dev/null && pnpm install --frozen-lockfile --reporter=silent && pnpm data "$@"' data-image "$@"
