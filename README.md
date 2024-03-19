# we-here-bot-3072

```sh
# Install dependencies
yarn

# Start the bot (development)
yarn workspace wehere-web dev:node

# Start the web (development)
PORT=3072 yarn workspace wehere-web dev:next

# Start the CMS (development)
PORT=3088 yarn workspace wehere-cms dev
```

https://keystonejs.com/docs/graphql/overview#using-the-api
https://www.apollographql.com/docs/react/get-started/#2-initialize-apolloclient

TODO: currently, the DB is local sqlite, which is not suitable for serverless
