process: migrate
	@node -r dotenv/config lib/processor.js


serve:
	@npx squid-graphql-server


migrate:
	@npx squid-typeorm-migration apply


migration:
	@npx squid-typeorm-migration generate Init


build:
	@npm run build


codegen:
	@npx squid-typeorm-codegen


typegen:
	@npx squid-substrate-typegen ./typegen/typegen.json

explore:
	@npx squid-substrate-metadata-explorer \
		--chain wss://arch.subsocial.network \
		--out ./typegen/versions.jsonl


up:
	@docker-compose up -d


down:
	@docker-compose down


.PHONY: process serve start codegen migration migrate up down
