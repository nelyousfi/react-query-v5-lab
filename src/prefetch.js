import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";

const { fetchTodo, fetchTodoAuthor } = (() => {
  const todos = [
    {
      id: 1,
      text: "Check what is new in react-query 5",
      author: {
        id: 101,
        name: "Naoufal"
      }
    },
    {
      id: 2,
      text: "Watch the LV grand-prix",
      author: {
        id: 102,
        name: "Adam"
      }
    }
  ];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchTodo = async (todoId) => {
    await sleep(500);
    return todos.find((todo) => todo.id === todoId);
  };

  const fetchTodoAuthor = async (todoId) => {
    await sleep(500);
    const todo = todos.find((todo) => todo.id === todoId);
    return todo ? todo.author : null;
  };

  return {
    fetchTodo,
    fetchTodoAuthor
  };
})();

const Todo = ({ id }) => {
  const { data: todo, isLoading } = useQuery({
    queryKey: ["todos", id],
    queryFn: () => fetchTodo(id)
  });

  useQuery({
    queryKey: ["todos", id, "author"],
    queryFn: () => fetchTodoAuthor(id),
    notifyOnChangeProps: []
  });

  if (isLoading) {
    return <p>Loading</p>;
  }

  return (
    <>
      <h2>TODO #{id}</h2>
      <p>{todo.text}</p>
      <Author todoId={id} />
    </>
  );
};

const Author = ({ todoId }) => {
  const { data: author, isPending } = useQuery({
    queryKey: ["todos", todoId, "author"],
    queryFn: () => fetchTodoAuthor(todoId)
  });

  if (isPending) {
    return <p>Loading</p>;
  }

  return (
    <>
      <p
        style={{
          color: "red"
        }}
      >
        {author.name}
      </p>
    </>
  );
};

const queryClient = new QueryClient();

export default () => {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>Prefetch</h1>
      <Todo id={1} />
    </QueryClientProvider>
  );
};
