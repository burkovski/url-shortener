include .env

PROJECT_NAME=url_shortener


run:
	@docker-compose up --build --force-recreate

build:
	@docker-compose build

stop:
	@docker-compose stop

clean:
	@docker-compose down

bash:
	@docker exec -it $(c) /bin/bash

psql:
	@export PGPASSWORD=${POSTGRES_PASSWORD}; docker exec -it us_database psql -U $(POSTGRES_USER) ${POSTGRES_DB}

create_tables:
	@docker exec -it us_auth python init_db.py

redis:
	@docker exec -it us_redis /usr/local/bin/redis-cli

