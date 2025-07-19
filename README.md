# loadMultiSSRComponents

A lightweight SSR loader for injecting pre-rendered HTML and hydrating React components on the client.

## Features

- ✅ Batch or single SSR requests
- 🔐 Optional JWT support
- 🔁 Pluggable caching system (defaults to `sessionStorage`)
- 💧 Hydration-ready with dynamic import
- 🔌 Configurable SSR and hydration endpoints

## Usage

```ts
import { loadMultiSSRComponents } from 'load-multi-ssr-components';

useEffect(() => {
  loadMultiSSRComponents({
    ssrEndpoint: '/api/ssr/render',
    hydrateScriptUrl: '/hydrate/bundle.js',
    useJWT: true,
    getToken: async (components) => {
      const res = await fetch('/api/token');
      return await res.text();
    },
    components: [
      {
        name: 'intro',
        props: { title: 'Halo Dunia' },
        containerId: 'intro-slot',
      },
    ],
  });
}, []);
