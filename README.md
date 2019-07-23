# Patient Portal 

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### .env

A .env file is required with the following values. This file is intentially gitignored

FPX_CLIENT_AUTHZ_BASIC=

### FPX Integration

The server must be run on port 8085 (npm run serve -- --port 8085) since this is the registered callback url
