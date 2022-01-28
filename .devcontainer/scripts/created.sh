if [ -n "$CP_ID" ]; then
	echo "setting up ssh key"
	mkdir -p ~/.ssh
	echo "$CP_ID" > ~/.ssh/id_rsa
	chmod 600 ~/.ssh/id_rsa

	echo "scanning github hosts"
	ssh-keyscan -H github.com >> ~/.ssh/known_hosts
	ssh git@github.com
else
	echo "WARNING CP_ID not found, skipping setting up ssh"
fi

echo "fetching submodules"
git submodule update --init

echo "installing yarn"
yarn install

if [ ! -f ./.env ]; then
	cp .devcontainer/container.env ./.env
else
	echo ".env file exists, will not overwrite"
fi
