import "dotenv/config";
import express from "express";
import cors from "cors";

import { productsRouter } from "./routes/products.routes";
import { adminRouter } from "./routes/admin.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(productsRouter);
app.use(adminRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
