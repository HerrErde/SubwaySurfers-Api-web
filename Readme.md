# SubwaySurfers API Web

A simple web interface for interacting with the internal API used by the Subway Surfers game.  
This project provides a frontend that allows you to send requests using your own `identityToken` without exposing data to any external server. Everything runs locally in your browser.

---

## Features

- Browse and call internal Subway Surfers API endpoints
- Local-only: no data is sent anywhere except to the official game servers

---

## Development

Generate `proto.js`

```bash
npm install -g protoc-gen-js

protoc -I=. player.proto --js_out=library=proto,import_style=closure:.
```
