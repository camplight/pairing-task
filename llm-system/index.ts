import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";

const app = new Hono();
app.get("/", (c) => c.text("Hello Bun!"));

app.post("/enhance-text", async (c) => {
  const { text } = await c.req.json();

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: "llama3.2:3b",
      prompt: `Write this sentence with correct grammar and return only the corrected sentence: ${text}`,
      stream: false,
    }),
  });

  const correctText = await response.json();
  return c.json({ ok: true, text: correctText.response });
});

// curl -X POST http://localhost:3000/enhance-text -H "Content-Type: Application/json" -d '{"text": "this is incorect"}'

// app.get('/enhance-text', c => {
//     const text = c.req.query("text");
//     return c.json({ok:true, text })
// })

export default app;
