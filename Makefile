.PHONY: clean up both

clean:
	docker-compose down -v --remove-orphans
	docker system prune -a -f

up: 
	docker-compose up

both: 
	make clean && make up
