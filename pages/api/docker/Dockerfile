# Utiliser l'image de base Ubuntu 22.04
FROM ubuntu:22.04

# Mettre à jour les paquets et installer git
RUN apt-get clean && \
    cd /var/lib/apt && \
    apt-get update && \
    apt-get install -y git && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Cloner un dépôt Git spécifique
RUN git clone https://github.com/AstarNetwork/Astar.git

# Définir un point d'entrée (facultatif)
CMD ["bash"]