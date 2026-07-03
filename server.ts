// Servidor local de desarrollo (npm run dev).
// Reutiliza la misma app de Express que se despliega en Vercel (lib/app.ts) y le añade
// el servidor de desarrollo de Vite para servir el frontend. En Vercel este archivo NO se usa.
import { createServer as createViteServer } from "vite";
import app from "./lib/app";

const PORT = 3000;

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  // Las rutas /api/* ya están registradas en lib/app.ts; Vite maneja el resto (frontend).
  app.use(vite.middlewares);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
