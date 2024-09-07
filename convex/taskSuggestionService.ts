import { GoogleGenerativeAI } from "@google/generative-ai";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const apiKey = process.env.GOOGLE_GEMINI_API!;
const genAI = new GoogleGenerativeAI(apiKey);

// config gemini model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

// Todo Response Type
type Todo = {
  taskName: string;
  description: string;
};

// suggest missing task using ai
export const suggestMissingTask = action({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const todos = await ctx.runQuery(api.todos.getTodosByProjectId, {
      projectId,
    });

    const todosInStrings = JSON.stringify(todos);

    const prompt = `I'm a project manager and I need help identifying missing todo items. I have a list of existing tasks in JSON format. Can you help me identify 1 additional todo items that are not yet included in this list? Please provide these missing items in a separate JSON array with key as 'todos' containing objects with with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions. Todos: ${todosInStrings}`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.1,
      },
    });

    const response = result.response.text();
    const responseTodos = JSON.parse(
      response.split("```")[1].substring(4).replaceAll("\n", "")
    );

    // console.log(responseTodos);

    if (responseTodos) {
      const todoItems = (responseTodos["todos"] as Array<Todo>) ?? [];

      const AI_LABEL_ID = process.env.AI_LABEL_ID! as Id<"labels">;

      for (let i = 0; i < todoItems.length; i++) {
        const { taskName, description } = todoItems[i];

        const embedding = await createEmbeddingWithAI(taskName);

        await ctx.runMutation(api.todos.createATodo, {
          taskName,
          description,
          priority: 1,
          dueDate: new Date().getTime(),
          projectId,
          labelId: AI_LABEL_ID,
          embedding,
        });
      }
    }
  },
});

// suggest missing sub-task using ai
export const suggestMissingSubTask = action({
  args: {
    projectId: v.id("projects"),
    parentId: v.id("todos"),
    taskName: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { projectId, parentId, taskName, description }) => {
    const subTodos = await ctx.runQuery(api.subTodos.getSubTodosByParentId, {
      parentId,
    });

    const project = await ctx.runQuery(api.projects.getProjectById, {
      projectId,
    });

    const projectName = project?.name || "";

    const todosInStrings = JSON.stringify({
      subTodos,
      projectName,
      ...{ parentTodo: { taskName, description } },
    });

    const prompt = `I'm a project manager and I need help identifying missing sub todo items. I have a list of existing tasks in JSON format. Can you help me identify 2 additional sub todo items that are not yet included in this list? Please provide these missing items in a separate JSON array with key as 'subtodos' containing objects with with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions. SubTodos: ${todosInStrings}`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.1,
      },
    });

    const response = result.response.text();
    const responseSubTodos = JSON.parse(
      response.split("```")[1].substring(4).replaceAll("\n", "")
    );

    // console.log(responseSubTodos);

    if (responseSubTodos) {
      const todoItems = (responseSubTodos["subTodos"] as Array<Todo>) ?? [];

      const AI_LABEL_ID = process.env.AI_LABEL_ID! as Id<"labels">;

      for (let i = 0; i < todoItems.length; i++) {
        const { taskName, description } = todoItems[i];

        const embedding = await createEmbeddingWithAI(taskName);

        await ctx.runMutation(api.subTodos.createASubTodo, {
          taskName,
          description,
          priority: 1,
          dueDate: new Date().getTime(),
          projectId,
          parentId,
          labelId: AI_LABEL_ID,
          embedding,
        });
      }
    }
  },
});

// create a embedding for search text
export const createEmbeddingWithAI = async (searchText: string) => {
  // For embeddings, use the Text Embeddings model
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  const result = await model.embedContent(searchText);
  const embedding = result.embedding;

  // console.log(embedding);

  const vector = embedding["values"];

  // console.log(`Embedding of ${searchText}: , ${vector.length} dimensions`);

  return vector;
};
