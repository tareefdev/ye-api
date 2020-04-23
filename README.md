# SY-API

A node server API to query and access [SugarCube](https://github.com/critocrito/syrian-archive) units.

The API depends on JSON files received from SugarCube, loads them in memory to serve.

## Development

```sh
npm install
npm run dev
```

## Available Routes

### Search

```
http://localhost:3000/search/?title=russian
```

Available query options `title`, `location`, `datebefore`, `dateafter`.

Date should be send as `YYYY/MM/DD`

### List

```
http://localhost:3000/list
```

This returns a paginated list of all units, contains the number of current page, total pages, and data under `units` object.

To request a specific page:

```
http://localhost:3000/list/?page=4
```


