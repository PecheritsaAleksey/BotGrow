COMPOSE_FILE=docker-compose-dev.yml

.PHONY: up down logs restart ps db-sh core-sh bot-sh

up:
	docker compose -f $(COMPOSE_FILE) up -d

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
