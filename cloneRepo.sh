#!/bin/bash

# Vérifier si une URL a été fournie
if [ -z "$1" ]; then
  echo "Usage: $0 <repository_url>"
  exit 1
fi

REPO_URL=$1
DEST_DIR=${2:-/repos} # Utiliser /repos comme répertoire de destination par défaut

# Créer le répertoire de destination s'il n'existe pas
mkdir -p $DEST_DIR

# Cloner le dépôt
git clone $REPO_URL $DEST_DIR

# Afficher un message de succès
if [ $? -eq 0 ]; then
  echo "Repository cloned successfully to $DEST_DIR"
else
  echo "Failed to clone repository"
  exit 1
fi
