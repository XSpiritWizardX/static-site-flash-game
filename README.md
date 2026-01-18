# Color Quest Garden

A no backend, kid friendly matching game built as a static site.

## Play locally
- Open `index.html` in a browser, or
- Run a tiny local server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy on Render
1. Push this repo to GitHub or GitLab.
2. In Render, create a new Static Site and connect the repo.
3. Accept the `render.yaml` settings, or set:
   - Build Command: `echo no build`
   - Publish Directory: `.`
4. Deploy. The site is ready without any backend services.
