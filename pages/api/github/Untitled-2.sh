sudo docker run -d \
--name shiden-container \
-u $(id -u astar):$(id -g astar) \
-p 30333:30333 \
-p 9944:9944 \
-v "/var/lib/astar/:/data" \
staketechnologies/astar-collator:latest \
astar-collator \
--pruning archive \
--rpc-cors all \
--name 2c \
--chain shiden \
--base-path /data \
--rpc-external \
--rpc-methods Safe \
--rpc-max-request-size 1 \
--rpc-max-response-size 1 \
--telemetry-url 'wss://telemetry.polkadot.io/submit/ 0'

sudo docker logs -f -n 100 $(docker ps -aq --filter name="shiden-container")

sudo docker logs -f -n 100 $(docker ps -aq --filter name="shiden-container")