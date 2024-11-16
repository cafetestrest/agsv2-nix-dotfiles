import {
	AstalIO,
	exec,
	execAsync,
	Gio,
	GLib,
	GObject,
	interval,
	readFile,
	writeFile,
	writeFileAsync,
} from "astal";
import { fetch } from "../lib/fetch";

export type Todo = {
	content: string;
	done: boolean;
};

const LocalTodosService = GObject.registerClass(
	{
		Properties: {
			todos: GObject.ParamSpec.jsobject(
				"todos",
				"Todos",
				"A property containing users todos",
				GObject.ParamFlags.READABLE,
			),
		},
	},

	class Todos extends GObject.Object {
		_todoPath = "";
		_todos: Todo[] = [];

		// refresh(value) {
		// 	this.emit("updated", value);
		// }

		get todos() {
			return this._todos;
		}

		#save() {
			const res = JSON.stringify(this._todos);
			console.log(res);
			writeFileAsync(this._todoPath, res).catch(print);
		}

		add(content) {
			this._todos.push({ content, done: false });
			this.#save();
			this.notify("todos");
		}

		check(index) {
			this._todos[index].done = true;
			this.#save();
			this.notify("todos");
		}

		uncheck(index) {
			this._todos[index].done = false;
			this.#save();
			this.notify("todos");
		}

		remove(index) {
			this._todos.splice(index, 1);
			writeFileAsync(this._todoPath, JSON.stringify(this._todos)).catch(
				print,
			);
			this.notify("todos");
		}

		constructor() {
			super();
			this._todoPath = `${GLib.get_user_state_dir()}/ags/user/todo.json`;
			try {
				exec(`mkdir -p ${GLib.get_user_state_dir()}/ags/user/}`);
				const fileContents = readFile(this._todoPath);
				this._todos = JSON.parse(fileContents);
			} catch {
				exec(
					`bash -c 'mkdir -p ${GLib.get_user_cache_dir()}/ags/user'`,
				);
				exec(`touch ${this._todoPath}`);
				writeFileAsync(this._todoPath, "[]")
					.then(() => {
						this._todos = JSON.parse(readFile(this._todoPath));
					})
					.catch(print);
			}
		}
	},
);

const service = new LocalTodosService();
export default service;
