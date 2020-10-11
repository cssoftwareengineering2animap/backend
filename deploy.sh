docker login -u "$HEROKU_USERNAME" --password=$(HEROKU_AUTH_TOKEN) registry.heroku.com
heroku container:release web --app animap-backend-prod
