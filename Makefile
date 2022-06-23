process: migrate
	@node -r dotenv/config lib/processor.js


serve:
	@npx squid-graphql-server


migrate:
	@npx sqd db:migrate


migration:
	@npx sqd db:create-migration Data


build:
	@npm run build


codegen:
	@npx sqd codegen


typegen: subsocialVersions.json
	@npx squid-substrate-typegen typegen.json


subsocialVersions.json:
	@make explore


explore:
	@npx squid-substrate-metadata-explorer \
		--chain wss://arch.subsocial.network \
		--out subsocialVersions.json


up:
	@docker-compose up -d


down:
	@docker-compose down


.PHONY: process serve start codegen migration migrate up down
