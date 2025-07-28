import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config({ quiet: true });
export const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.contentType("application/json");
  res.json({ status: "Not yet here! :3" });
});

app.post("/", (req: Request, res: Response) => {
  res.contentType("application/json");
  if (!req.headers["authorization"]) {
    res.status(401);
    res.json({ error: "unauthorized", message: "No authorization header provided!" });
    return;
  }
  if (req.headers["authorization"] !== process.env.KEY) {
    res.status(403);
    res.json({ error: "forbidden", message: "Incorrect key in authorization header!" });
    return;
  }
})

if (process.env.NODE_ENV !== "test") { startServer(); }
export function startServer() {
  return app.listen(port, () => {
    console.log(`[app] Server is running at http://localhost:${port}`);
  });
}