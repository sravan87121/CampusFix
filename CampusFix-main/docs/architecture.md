# System Architecture

```mermaid
flowchart LR
    subgraph Client["React SPA (Vite + Tailwind)"]
        UI[Pages & Components]
        Ctx[AuthContext]
        Svc[Axios Services]
    end

    subgraph Server["Express API (Node.js)"]
        MW[Middleware: Helmet, CORS, Rate Limit, Auth]
        Ctrl[Controllers]
        Model[Mongoose Models]
    end

    DB[(MongoDB)]
    FS[/uploads static files/]

    UI --> Svc --> MW --> Ctrl --> Model --> DB
    Ctrl --> FS
    Ctx --> Svc
```

- The client is a single-page React app served independently (dev: Vite dev server on 5173; prod: static build).
- The server exposes a versionless REST API under `/api`.
- Uploaded images are stored on disk under `/uploads` and served statically; only metadata (filename, url, mimetype, size) is stored in MongoDB.
- Authentication is stateless JWT — no server-side session store.
