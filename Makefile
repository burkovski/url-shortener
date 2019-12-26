include .env

PROJECT_NAME=url_shortener


run_prod:
	@docker-compose -f docker-compose.prod.yaml up --build --force-recreate

clean_prod:
	@docker-compose -f docker-compose.prod.yaml down

run:
	@docker-compose up

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

tests_urls:
	@docker exec -it us_urls py.test

tests:
	@docker exec -it us_auth py.test
	@docker exec -it us_urls py.test

build_dist:
	@docker exec -it us_app npm run build