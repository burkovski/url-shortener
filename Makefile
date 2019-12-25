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
	@export PGPASSWORD=${POSTGRES_PASSWORD}; docker exec -it us_postgres_auth psql -U $(POSTGRES_USER) ${POSTGRES_DB}

create_tables:
	@docker exec -it us_auth python create_tables.py

redis_auth:
	@docker exec -it us_redis_auth /usr/local/bin/redis-cli

tests_auth:
	@docker exec -it us_auth py.test

redis_urls:
	@docker exec -it us_redis_urls /usr/local/bin/redis-cli
