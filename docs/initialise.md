# 🚀 Start a New NestJS Project

Build your next app with style. This guide gives you the fastest path from zero to a running NestJS project.

> 💡 Tip: If you are starting a new repo in this series, this is the perfect first step.

## 1. Install the Nest CLI

Install the CLI globally so you can scaffold apps quickly:

```bash
npm install -g @nestjs/cli
```

## 2. Create the project

Run this in the folder where you want your new app to live:

```bash
nest new my-project
```

Choose your preferred package manager when prompted. For most setups, `npm` is the easiest choice.

## 3. Enter the project folder

```bash
cd my-project
```

## 4. Start the development server

Run the app with:

```bash
npm run start
```

For live reload while editing:

```bash
npm run start:dev
```

## 5. Open the app

Visit the local URL in your browser:

```text
http://localhost:3000
```

## 6. Useful next steps

### Generate core pieces

```bash
nest generate module users
nest generate controller users
nest generate service users
```

### Run tests

```bash
npm run test
```

### Build for production

```bash
npm run build
```

## ✅ Ready to go

You now have a clean NestJS starter project ready for building your own backend, API, or full-stack experience.

---

Related changes: [Start a new NestJS project
](https://github.com/krishnadasd/solidcode/commit/c946b121718a99a220643c23eb5c44e6bce9c6bc)
