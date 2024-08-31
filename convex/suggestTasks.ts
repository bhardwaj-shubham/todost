import { GoogleGenerativeAI } from "@google/generative-ai";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API!);

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

export const generateContent = action({
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
      response.substring(7, response.length - 6).replaceAll("\n", "")
    );

    console.log(responseTodos);

    if (responseTodos) {
      const todoItems = (responseTodos["todos"] as Array<Todo>) ?? [];

      const AI_LABEL_ID = process.env.AI_LABEL_ID! as Id<"labels">;

      for (let i = 0; i < todoItems.length; i++) {
        const { taskName, description } = todoItems[i];

        await ctx.runMutation(api.todos.createATodo, {
          taskName,
          description,
          priority: 1,
          dueDate: new Date().getTime(),
          projectId,
          labelId: AI_LABEL_ID,
        });
      }
    }
  },
});
