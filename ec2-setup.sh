# install node
echo "installing nodejs"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install --lts

echo "check node version"
node -v

# install yarn
npm i -g yarn

# set up git yarn
echo "done."