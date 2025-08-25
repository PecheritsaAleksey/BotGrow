COMPOSE_FILE=docker-compose-dev.yml

.PHONY: up down logs restart ps db-sh core-sh bot-sh migrate-new migrate-deploy

deps:
	docker compose $(COMPOSE_FILE) run --rm deps sh -lc 'corepack enable && corepack prepare pnpm@10.15.0 --activate && pnpm -r install --no-frozen-lockfile'

migrate-deploy:
	docker compose -f $(COMPOSE_FILE) run --rm deps sh -lc '\
	  set -e; \
	  corepack enable && corepack prepare pnpm@10.15.0 --activate; \
	  cd packages/db; \
	  pnpm prisma migrate deploy \
	'

migrate-status:
	docker compose -f $(COMPOSE_FILE) run --rm deps sh -lc '\
	  corepack enable && corepack prepare pnpm@10.15.0 --activate; \
	  cd packages/db; \
	  pnpm prisma migrate status \

migrate-new:
	docker compose -f $(COMPOSE_FILE) run --rm deps sh -lc '\
	  set -e; \
	  corepack enable && corepack prepare pnpm@10.15.0 --activate; \
	  cd packages/db; \
	  pnpm prisma migrate dev --name "$(name)" \
	'
	
up:
	docker compose -f $(COMPOSE_FILE) up -d

uplogs:
	docker compose -f $(COMPOSE_FILE) up

down:
	docker compose -f $(COMPOSE_FILE) down

logs:
	docker compose -f $(COMPOSE_FILE) logs -f

restart: down up

ps:
	docker compose -f $(COMPOSE_FILE) ps

core-sh:
	docker compose -f $(COMPOSE_FILE) exec core-api sh

bot-sh:
	docker compose -f $(COMPOSE_FILE) exec bot-server sh

db-sh:
	docker compose -f $(COMPOSE_FILE) exec db sh
