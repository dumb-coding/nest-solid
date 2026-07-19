<link rel="icon" href="dump/logo.png" type="image/png" />

<div align="center">
  <img src="dump/logo.png" alt="Dumb Coding logo" width="180" />

  <h1 style="margin: 0.4em 0 0.2em; font-family: 'Segoe UI', 'Trebuchet MS', sans-serif; letter-spacing: 0.25em; color: #7ee7ff; text-transform: uppercase;">Code in NestJS</h1>

  <p style="margin: 0.5em 0 0; font-size: 1.05rem; color: #dcefff; font-family: 'Segoe UI', 'Trebuchet MS', sans-serif;">
    Welcome to Dumb Coding — where bugs are features, coffee is our fuel, and "it works on my machine" is a valid debugging strategy. A community of developers who write code, break code, fix code, and pretend we knew the solution all along. 🚀💻
  </p>

  <p style="margin: 0.6em 0 0; font-size: 0.98rem; color: #8fd8ff; font-family: 'Segoe UI', 'Trebuchet MS', sans-serif;">
    Visit <a href="https://dumb-coding.web.app" style="color: #7ee7ff; text-decoration: none;">dump-coding.web.app</a> to explore the series.
  </p>

  <hr style="margin: 1.5rem 0 0; border: 0; height: 2px; background: linear-gradient(90deg, #00f5ff, #8b5cf6, #ff4fd8);" />
</div>

<!-- HEAD END  -->

## Contents

- [Start a new NestJS project](docs/initialise.md)

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Copy the sample environment file and adjust the values if needed:

```bash
cp .env.example .env
```

3. Start a password-protected Redis container:

```bash
docker run --name solidcode-redis -p 6379:6379 -e REDIS_PASSWORD=secret123 -d redis:7-alpine redis-server --requirepass secret123
```

4. Start the Nest application:

```bash
npm run start:dev
```

5. Open the app at:

```text
http://localhost:3000
```

### Environment variables

The app reads the following values from [.env](.env):

```env
PORT=3000
REDIS_URL=redis://:secret123@127.0.0.1:6379
```

If you prefer to use a different password, update both the Docker command and the Redis URL in your environment file.


