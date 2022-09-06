set -e
npx squid-typeorm-codegen
npm run build
./soft-reset-db.sh