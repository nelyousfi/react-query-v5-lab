import React, { useReducer } from "react";
import {
  useMutation,
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutationState
} from "@tanstack/react-query";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const { addTodo, fetchTodos } = (() => {
  const todos = [];

  const addTodo = async (text) => {
    await sleep(500);
    todos.push(text);
  };

  const fetchTodos = async () => {
    await sleep(100);
    return todos;
  };

  return {
    addTodo,
    fetchTodos
  };
})();

const queryKey = ["todos"];
const mutationKey = ["addTodo"];

const App = () => {
  const { data: todos = [] } = useQuery({
    queryFn: fetchTodos,
    queryKey
  });

  const { mutate, isPending, variables } = useMutation({
    mutationKey,
    mutationFn: addTodo
  });

  return (
    <>
      <h1>TODO ({todos.length})</h1>
      <button
        disabled={isPending}
        onClick={() => {
          mutate(String(todos.length + 1));
        }}
      >
        Add Todo
      </button>

      <ul>
        {todos.map((todo) => (
          <li key={todo + ""}>
            <p>{todo}</p>
          </li>
        ))}

        {isPending ? (
          <li>
            <p style={{ color: "red" }}>{variables}</p>
          </li>
        ) : null}
      </ul>
    </>
  );
};

const Loading = () => {
  const [isPending] = useMutationState({
    filters: { mutationKey, status: "pending" },
    select: (mutation) => mutation.state.status === "pending"
  });

  return isPending ? <p>Loading ...</p> : null;
};

const queryClient = new QueryClient({});

export default () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Loading />
      <App />
    </QueryClientProvider>
  );
};
