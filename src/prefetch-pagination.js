import { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQueryClient
} from "@tanstack/react-query";

const { fetchTodo } = (() => {
  const todos = ["one", "two", "three", "four", "five", "six"];

  const fetchTodo = (page) => {
    return {
      todo: todos[page],
      last: page === todos.length - 1
    };
  };

  return {
    fetchTodo
  };
})();

const Todos = () => {
  const { data, isPending, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: (page) => fetchTodo(page.pageParam),
    getNextPageParam: (result, __, previous) =>
      result.last ? undefined : previous + 1,
    initialPageParam: 0
  });

  if (isPending) {
    return <p>Loading ...</p>;
  }

  const todos = data.pages;

  return (
    <>
      <h1>TODO ({todos.length})</h1>
      <ul>
        {todos.map(({ todo }) => (
          <li key={todo + ""}>
            <p>{todo}</p>
          </li>
        ))}
      </ul>
      <button disabled={isPending || !hasNextPage} onClick={fetchNextPage}>
        Fetch more pages
      </button>
    </>
  );
};

const App = () => {
  const [openTodos, setOpenTodos] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ["todos"],
      queryFn: (page) => fetchTodo(page.pageParam),
      getNextPageParam: (result, __, previous) =>
        result.last ? undefined : previous + 1,
      initialPageParam: 0,
      pages: 3
    });
  }, []);

  return (
    <>
      {openTodos ? (
        <Todos />
      ) : (
        <button onClick={() => setOpenTodos(true)}>Open Todos</button>
      )}
    </>
  );
};

const queryClient = new QueryClient();

export default () => {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};
