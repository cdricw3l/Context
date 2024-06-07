# Utiliser une image de base contenant Git
FROM alpine:latest

# Installer Git
RUN apk update && apk add git

# Copier le script de clonage dans le conteneur
COPY cloneRepo.sh /usr/local/bin/cloneRepo.sh

# Rendre le script exécutable
RUN chmod +x /usr/local/bin/cloneRepo.sh

# Définir le point d'entrée du conteneur
ENTRYPOINT ["/usr/local/bin/cloneRepo.sh"]
