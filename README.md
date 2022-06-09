# Dev Assessment

## Quick Start
``` bash
# Setup dotenv variables
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
INSTANCE_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=
DIALECT=
POOL_MAX=
POOL_MIN=
POOL_ACQUIRE=
POOL_IDLE=

# Install dependencies
npm install

# Serve on localhost (default port: 8080)
# Dev Server (Nodemon)
npm run dev

# Unit Test (Mocha)
npm run test
```

## API

``` bash
# Use request.rest for example

POST /signup

POST /signin

POST /students

POST /teachers

POST /register

GET /commonstudents

POST /suspend
```
