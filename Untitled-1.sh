https://github.com/jhonny-jane-w3l/next_rust_gpt.git

curl -X POST http://localhost:8000/api/cloneRepo \
    -H "Content-Type: application/json" \
    -d '{"repoUrl": "https://github.com/jhonny-jane-w3l/next_rust_gpt.git", "branch": "main"}'

    curl -X POST http://localhost:8000/api/cloneRepo \
    -H "Content-Type: application/json" \
    -d '{"repoUrl": "v", "branch": "main", "accessToken": "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"}'

GITHUB_TOKEN: "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"

scp cw@109.199.111.168:/cw/output.json .

curl http://109.199.111.168:8000/api/cloneRepo

ssh-copy-id cw@109.199.111.168
ssh cw@109.199.111.168

curl http://109.199.111.168:8000/api/cloneRepo



ssh cb@109.199.111.168
sshfs cb@109.199.111.168:project remote

curl -X POST \
     -H "Accept: application/vnd.github+json" \
     -H "Authorization: Bearer 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" \
     -H "Content-Type: application/json" \
     https://api.github.com/repos/{owner}/{repo}/git/blobs/{sha} \
     


# Récupérer le contenu encodé en base64
base64_content=$(curl -H "Accept: application/vnd.github+json" \
                      -H "Authorization: Bearer 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" \
                      https://api.github.com/repos/jhonny-jane-w3l/next_rust_gpt/git/blobs/875c01e819b90038f0c3e4aee2a4dcc2086b0e14 | awk 'BEGIN {FS="\""} {print $4}')

# Décoder le contenu et l'afficher
echo "$base64_content" | base64 --decode




curl -X POST http://109.199.111.168:8000/api/cloneRepo \
     -H "Content-Type: application/json" \
     -d '{
           "repoUrl": "https://github.com/jhonny-jane-w3l/next_rust_gpt.git",
           "branch": "main",
           "accessToken": "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"
         }'

sudo rm -r cloned_repo && mkdir cloned_repo