#!/bin/sh
# {PATH_TO_THE_PROJECT}/frontend/entrypoint.sh

# Default API URL (fallback if K8s variable is missing)
DEFAULT_API_URL="http://iidl-api-service:80/api"
# Use environment variable VITE_API_BASE_URL injected by K8s, or default
API_URL=${VITE_API_BASE_URL:-$DEFAULT_API_URL}

echo "Attempting to set VITE_API_BASE_URL in index.html to: ${API_URL}"

INDEX_HTML="/usr/share/nginx/html/index.html"
PLACEHOLDER="__VITE_API_BASE_URL_PLACEHOLDER__" # The string to find in index.html

# Check if index.html exists
if [ ! -f "$INDEX_HTML" ]; then
  echo "ERROR: $INDEX_HTML not found!" >&2
  exit 1 # Exit if essential file is missing
fi

# Check if the placeholder exists in index.html before attempting substitution
if grep -q "$PLACEHOLDER" "$INDEX_HTML"; then
  echo "Found placeholder in $INDEX_HTML. Substituting..."
  # Use a temporary file for safe replacement
  TEMP_FILE=$(mktemp)
  # Replace the placeholder using | as delimiter for sed due to slashes in URL
  sed "s|$PLACEHOLDER|${API_URL}|g" "$INDEX_HTML" > "$TEMP_FILE"

  # Check if sed succeeded before moving the file
  if [ $? -eq 0 ]; then
    mv "$TEMP_FILE" "$INDEX_HTML"
    # --- FIX: Explicitly set read permissions for all users ---
    chmod 644 "$INDEX_HTML"
    # --- END FIX ---
    echo "Substitution successful and permissions set for $INDEX_HTML."
  else
    echo "ERROR: sed command failed for $INDEX_HTML. Placeholder not replaced." >&2
    rm -f "$TEMP_FILE" # Clean up temp file on failure
    exit 1 # Exit as substitution failed
  fi
  # Ensure temp file is removed even if mv fails somehow (unlikely)
  rm -f "$TEMP_FILE"
else
  echo "Placeholder '$PLACEHOLDER' not found in $INDEX_HTML. Assuming already substituted or index.html doesn't contain it."
  # Do not exit here, allow Nginx to start anyway
fi

echo "Starting Nginx..."
# Execute Nginx in the foreground, replacing this script process
exec nginx -g 'daemon off;'