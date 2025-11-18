#!/bin/bash

set -e

echo "🔄 Pulling latest changes..."
git pull --rebase

echo "📦 Building Docusaurus..."
npm run build

echo "⬆️ Pushing changes to main..."
git add .
git commit -m "Auto publish" || true
git push origin main

echo "🚀 Deploying to GitHub Pages..."
GIT_USER=rafa-sealmetrics npm run deploy

echo "✅ Done! Visit https://docs.sealmetrics.com"