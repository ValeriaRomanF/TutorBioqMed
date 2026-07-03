// Función serverless de Vercel: reutiliza la app de Express con todas las rutas /api/*.
// Vercel enruta cualquier petición a /api/... hacia este archivo (ver rewrites en vercel.json).
import app from "../lib/app";

export default app;
