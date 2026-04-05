#!/usr/bin/env bash
# fix-imgur.sh
# Finds all Imgur URLs in posts, downloads them via Wayback Machine fallback,
# saves them to assets/images/, and rewrites the markdown/njk references.

set -euo pipefail

BLOG_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSET_DIR="$BLOG_ROOT/assets/images"
mkdir -p "$ASSET_DIR"

echo "📂 Blog root: $BLOG_ROOT"
echo "💾 Saving images to: $ASSET_DIR"
echo ""

# Find all markdown/njk files containing imgur links
FILES=$(grep -rl "imgur.com" "$BLOG_ROOT/posts" "$BLOG_ROOT/pages" 2>/dev/null || true)

if [ -z "$FILES" ]; then
  echo "✅ No Imgur links found. Nothing to do."
  exit 0
fi

# Extract unique Imgur URLs
URLS=$(grep -roh 'https://i\.imgur\.com/[A-Za-z0-9]\+\.[a-zA-Z]\+' "$BLOG_ROOT/posts" "$BLOG_ROOT/pages" 2>/dev/null | sort -u)

echo "🔍 Found $(echo "$URLS" | wc -l | tr -d ' ') unique Imgur URLs:"
echo "$URLS"
echo ""

download_image() {
  local url="$1"
  local filename
  filename=$(basename "$url")
  local dest="$ASSET_DIR/$filename"

  if [ -f "$dest" ]; then
    echo "  ⏭  Already exists: $filename"
    return 0
  fi

  echo "  ⬇️  Downloading: $url"

  # Try direct access first
  if curl -sf --max-time 10 -L -o "$dest" "$url" 2>/dev/null; then
    echo "  ✅ Downloaded directly: $filename"
    return 0
  fi

  echo "  ⚠️  Direct download failed (Imgur blocked?), trying Wayback Machine..."

  # Try Wayback Machine (archive.org) - get the most recent snapshot
  local wayback_api="http://archive.org/wayback/available?url=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$url'))")"
  local wayback_url
  wayback_url=$(curl -sf --max-time 15 "$wayback_api" | python3 -c "
import sys, json
data = json.load(sys.stdin)
snap = data.get('archived_snapshots', {}).get('closest', {})
if snap.get('available'):
    print(snap['url'].replace('http://', 'https://'))
" 2>/dev/null || echo "")

  if [ -n "$wayback_url" ]; then
    if curl -sf --max-time 30 -L -o "$dest" "$wayback_url" 2>/dev/null; then
      echo "  ✅ Downloaded via Wayback Machine: $filename"
      return 0
    fi
  fi

  echo "  ❌ FAILED to download: $url (skipping)"
  rm -f "$dest"
  return 1
}

echo "⬇️  Downloading images..."
FAILED_URLS=()
while IFS= read -r url; do
  [ -z "$url" ] && continue
  if ! download_image "$url"; then
    FAILED_URLS+=("$url")
  fi
done <<< "$URLS"

echo ""
echo "✏️  Rewriting file references..."

for f in $FILES; do
  changed=false

  # Process each imgur URL found in this file
  while IFS= read -r url; do
    [ -z "$url" ] && continue
    filename=$(basename "$url")
    local_path="/assets/images/$filename"

    # Skip if we failed to download this one
    if [ ! -f "$ASSET_DIR/$filename" ]; then
      echo "  ⚠️  Skipping rewrite for missing file: $filename in $f"
      continue
    fi

    # Replace the URL in the file (handles both markdown and HTML img tags)
    if grep -q "$url" "$f"; then
      sed -i '' "s|$url|$local_path|g" "$f"
      echo "  ✅ Replaced $url → $local_path in $(basename "$f")"
      changed=true
    fi
  done <<< "$URLS"
done

echo ""
if [ ${#FAILED_URLS[@]} -gt 0 ]; then
  echo "⚠️  The following images could not be downloaded automatically:"
  for u in "${FAILED_URLS[@]}"; do
    echo "   - $u"
  done
  echo "   You'll need to source these manually and place them in $ASSET_DIR/"
else
  echo "🎉 All done! All Imgur images have been downloaded and references updated."
fi

echo ""
echo "📋 Next steps:"
echo "   git add assets/images/ posts/ pages/"
echo "   git commit -m 'fix: replace Imgur links with local images'"
echo "   git push"
