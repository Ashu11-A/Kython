<div align="center">

# Kython

![license-info](https://img.shields.io/github/license/Ashu11-A/Kython?style=for-the-badge&colorA=302D41&colorB=f9e2af&logoColor=f9e2af)
![stars-infoa](https://img.shields.io/github/stars/Ashu11-A/Kython?colorA=302D41&colorB=f9e2af&style=for-the-badge)

![Last-Comitt](https://img.shields.io/github/last-commit/Ashu11-A/Kython?style=for-the-badge&colorA=302D41&colorB=b4befe)
![Comitts Year](https://img.shields.io/github/commit-activity/y/Ashu11-A/Kython?style=for-the-badge&colorA=302D41&colorB=f9e2af&logoColor=f9e2af)
![reposize-info](https://img.shields.io/github/languages/code-size/Ashu11-A/Kython?style=for-the-badge&colorA=302D41&colorB=90dceb)

![SourceForge Languages](https://img.shields.io/github/languages/top/Ashu11-A/Kython?style=for-the-badge&colorA=302D41&colorB=90dceb)

</div>

<div align="left">

## 📃 | Description

This project was born from the idea of creating a native framework for Bun, Deno, or Node, aiming to be faster than alternatives like Fastify or Express. I’m working to achieve this goal, but for now, this project is just an experiment. I do not recommend using it in production, and no support is available.

## ❓ | How to use

```ts
import { Kython, Router } from './src/index'

const server = new Kython()

server.get('/', (_request, response) => {
  response.send('Hello world')
})

new Router({ 
  path: '/exemple',
  methods: {
    get(_request, response) {
      response.json({ hello: 'world' })
    }
  }
})

server.listen(3000, '0.0.0.0')
```

</div>
