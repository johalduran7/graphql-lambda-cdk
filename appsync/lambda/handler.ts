export const handler = async (event: any): Promise<any> => {
  const field = event.info.fieldName;

  switch (field) {
    case "hello": {
      const name = event.arguments.name;
      return {
        message: `Hello, ${name}!`,
        user: {
          id: "1",
          name,
          email: `${name.toLowerCase()}@example.com`,
          registeredAt: new Date().toISOString()
        }
      };
    }

    case "getUser": {
      const id = event.arguments.id;
      return {
        id,
        name: "John Duran",
        email: "john.duran@example.com",
        registeredAt: "2023-01-15T10:00:00Z"
      };
    }

    default:
      throw new Error("Unknown field: " + field);
  }
};



