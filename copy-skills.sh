#!/bin/bash

# Copy data folder and assets folder from eldritch-walk
DATA_SOURCE="../eldritch-walk/data"
ASSETS_SOURCE="../eldritch-walk/assets"
DATA_DEST="files"
ASSETS_DEST="public"

# Check if source directories exist
if [ ! -d "$DATA_SOURCE" ]; then
    echo "Error: Source directory $DATA_SOURCE not found"
    exit 1
fi

if [ ! -d "$ASSETS_SOURCE" ]; then
    echo "Error: Source directory $ASSETS_SOURCE not found"
    exit 1
fi

# Create destination directories if they don't exist
mkdir -p "$DATA_DEST"
mkdir -p "$ASSETS_DEST"

# Copy the data folder
echo "Copying data folder..."
cp -r "$DATA_SOURCE" "$DATA_DEST/"

if [ $? -eq 0 ]; then
    echo "Successfully copied $DATA_SOURCE to $DATA_DEST/data"
else
    echo "Error: Failed to copy data directory"
    exit 1
fi

# Copy the assets folder
echo "Copying assets folder..."
cp -r "$ASSETS_SOURCE" "$ASSETS_DEST/"

if [ $? -eq 0 ]; then
    echo "Successfully copied $ASSETS_SOURCE to $ASSETS_DEST/assets"
else
    echo "Error: Failed to copy assets directory"
    exit 1
fi

echo "All files copied successfully!"