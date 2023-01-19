import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { trpc } from "./utils/trpc";

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function AppContent() {
  const hello = trpc.greeting.useQuery();
  const products = trpc.products.useQuery();

  const addProduct = trpc.createProduct.useMutation();

  const [NewProduct, setNewProduct] = React.useState({
    name: "",
  });

  const utils = trpc.useContext();

  if (!hello.data || products.isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>{hello.data}</p>

      <ul>
        {products.data ? (
          products.data.map((product, index) => (
            <li key={index}>{product.name}</li>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </ul>

      <div className="form">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addProduct.mutate(NewProduct, {
              onSuccess() {
                utils.products.invalidate();
              },
            });
          }}
        >
          <input
            type="text"
            onChange={(e) => setNewProduct({ name: e.target.value })}
          />
          <button>Save</button>
        </form>
      </div>
    </div>
  );
}

export default App;
