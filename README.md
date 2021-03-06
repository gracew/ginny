## Getting Started

Prerequisites:
- Node
- Yarn
- Postgres
- Docker

### Local dev

1. Get a copy of .env.local from Grace
2. Start the postgres container
```bash
docker-compose up -d
```
3. (One-time) Initialize the postgres container
```bash
PGPASSWORD=postgres psql -h localhost -U postgres -f ./scripts/users.sql -f ./scripts/properties.sql -f ./scripts/generate_events.sql
```
4. (One-time) Install project dependencies:
```bash
yarn
```
5. Run the development server:
```bash
PGHOST=localhost PGUSER=postgres PGPASSWORD=postgres yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running tests

```
yarn jest
```