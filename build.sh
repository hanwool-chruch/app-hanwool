cd server
rm -rf build
rm -rf public
echo "terminating pm2 instances"
npm run pm2 delete all
npm i
npm run pm2 install typescript
npm run pm2 start ts-node -- ./src/main.ts

echo "building"
cd ../client
npm i
npm run build
