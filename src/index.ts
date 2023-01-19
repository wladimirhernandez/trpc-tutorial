import express from "express";
import { publicProcedure, router } from "./trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

const app = express();

let products = [
  { id: 1, name: "foo" },
  { id: 2, name: "bar" },
];

const appRouter = router({
  greeting: publicProcedure.query(() => "hello world"),
  products: publicProcedure.query(() => {
    return products;
  }),
  createProduct: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ input }) => {
      console.log(input);
      const product = { id: products.length + 1, name: input.name };
      products.push(product);
    }),
});

export type AppRouter = typeof appRouter;

app.use(cors());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => {
      return {};
    },
  })
);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
