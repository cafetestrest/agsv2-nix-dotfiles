import { GObject, property, register } from "astal";
import { fetch, FetchOptions } from "../lib/fetch";
import GoogleOAuth2Service from "./GoogleOAuth2";

async function fetchWithToken(url: string, options?: FetchOptions = {}) {
  options["headers"] = {
    Authorization: `Bearer ${await GoogleOAuth2Service.getAccessToken()}`,
  };
  return await fetch(url, options);
}

type List<T> = {
  kind: string;
  etag: string;
  items: T[];
};

type TaskListsItem = {
  kind: string;
  id: string;
  etag: string;
  title: string;
  updated: string;
  selfLink: string;
};

export type Task = {
  kind: string;
  id: string;
  etag: string;
  title: string;
  updated: string;
  selfLink: string;
  position: string;
  status: "needsAction" | "completed";
  links: [];
  webViewLink: string;
};

@register()
class GoogleTasksService extends GObject.Object {
  _endpoint = "https://tasks.googleapis.com";
  _todos: Task[] = [];
  _completedTodos: Task[] = [];
  _selectedListId: string | null = null;
  _availableTaskLists: TaskListsItem[] = [];

  @property()
  get todos() {
    return this._todos;
  }

  @property()
  get selectedListId() {
    return this._selectedListId;
  }

  @property()
  get availableTaskLists() {
    return this._availableTaskLists;
  }

  async getTasksLists(): Promise<List<TaskListsItem>> {
    const res = await fetchWithToken(
      `${this._endpoint}/tasks/v1/users/@me/lists`,
    );
    const data = await res.json();
    return data;
  }

  async getTasks(listId: string): Promise<List<Task>> {
    const res = await fetchWithToken(
      `${this._endpoint}/tasks/v1/lists/${listId}/tasks`,
      {
        params: {
          showCompleted: false,
        },
      },
    );
    const data = await res.json();
    return data;
  }

  async createTask(title: string): Promise<Task> {
    const res = await fetchWithToken(
      `${this._endpoint}/tasks/v1/lists/${this._selectedListId}/tasks`,
      {
        method: "POST",
        body: JSON.stringify({
          title: title,
          status: "needsAction",
        }),
      },
    );
    const data = await res.json();
    this.updateTodos();
    return data;
  }

  async checkTask(task: Task): Promise<Task> {
    const res = await fetchWithToken(
      `${this._endpoint}/tasks/v1/lists/${this._selectedListId}/tasks/${task.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: task.status == "completed" ? "needsAction" : "completed",
        }),
      },
    );
    const data = await res.json();
    this.updateTodos();
    return data;
  }

  constructor() {
    super();
    this.initializeData();
  }

  private async updateTodos() {
    const tasks = await this.getTasks(this._selectedListId!);
    this._todos = tasks.items.toSorted((task) => parseInt(task.position));
    this.notify("todos");
  }

  private async initializeData() {
    try {
      const taskLists = await this.getTasksLists();
      this._availableTaskLists = taskLists.items;

      if (this._availableTaskLists.length > 0) {
        this._selectedListId = this._availableTaskLists[7].id;
        const tasks = await this.getTasks(this._selectedListId);
        this._todos = tasks.items.toSorted((task) => parseInt(task.position));
        this.notify("todos");
      }
    } catch (error) {
      console.error("Error initializing Google Tasks data:", error);
    }
  }
}

const service = new GoogleTasksService();
export default service;
