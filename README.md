# Events Registration App

## Tasks

- [x] Events board page

- [x] Event registration page

- [x] Event participants page

### Середній рівень - Все, що на базовому рівні

- [x] Events board page: add ability to sort events by: title, event date, organizer.

- [x] Event registration page: add form validation (come up with your own requirements for fields’ validity).

- [x] Event participants page: add ability to search participants by full name, email.

### Просунутий рівень

- [x] Events board page: add infinite scroll pagination (when a user scrolls the page, it
      automatically loads more events)
- [x] Event participants page: add line/bar chart displaying the amount of registrations per day for the given event.
- [ ] Implement a separate script that runs at a defined interval of time: it fetches the list of available events from a third-party API and stores them as events in your database. You can search for any free API available on the internet.

## How to run local

### docker-compose

```bash
git clone https://github.com/dawmsi/multicontainer-events-app.git
```

```bash
docker compose up
```

or if the docker-compose package is installed

```bash
docker-compose up --build
```

```bash
http://localhost:3050/
```

---

### docker-compose manually seed data to db

```bash
docker-compose up -d
```

connect to the startup container named api

```bash
 docker-compose exec api /bin/sh
```

```bash
 npx prisma migrate dev --name init &&
 npx prisma db seed
```

## also check the 4 containers

```bash
 docker ps
```

- postgres
- api
- client
- nginx
