import { bind, GObject, Variable } from "astal";
import { astalify, ConstructProps, Gtk } from "astal/gtk3";
import TodosService, { Todo } from "../../../service/LocalTodos";
import icons from "../../../lib/icons";
import GoogleTasksService, {
	Task,
	TaskListsItem,
} from "../../../service/GoogleTasks";

class ComboBox extends astalify(Gtk.ComboBox) {
	static {
		GObject.registerClass(this);
	}

	constructor(
		props: ConstructProps<Gtk.ComboBox, Gtk.ComboBox.ConstructorProps>,
	) {
		super(props as any);
	}
}

const TodoItem = ({ todo }: { todo: Task }) => {
	return (
		<box spacing={24} hexpand={true} className="todo">
			<button
				onClick={() => {
					GoogleTasksService.checkTask(todo);
				}}
			>
				<icon
					className="todo__check"
					icon={
						todo.status == "completed"
							? icons.todo.checkedAlt
							: icons.todo.unchecked
					}
					pixelSize={24}
				/>
			</button>

			<label hexpand={true} halign={Gtk.Align.START} label={todo.title} />
		</box>
	);
};

export default () => {
	const newTodoText = Variable<string>("");

	return (
		<box vertical className={"todos block"}>
			<ComboBox
				hexpand={true}
				setup={(self) => {
					const model = new Gtk.ListStore();
					let renderer = new Gtk.CellRendererText();
					self.pack_start(renderer, true);
					self.add_attribute(renderer, "text", 1);
					GoogleTasksService.connect(
						"notify::available-task-lists",
						() => {
							model.set_column_types([
								GObject.TYPE_STRING,
								GObject.TYPE_STRING,
							]);
							GoogleTasksService.availableTaskLists.forEach(
								(list: TaskListsItem) => {
									model.set(
										model.append(),
										[0, 1],
										[list.id, list.title],
									);
								},
							);
							self.set_model(model);
						},
					);
					self.connect("changed", function (entry) {
						let [success, iter] = self.get_active_iter();
						if (!success) return;
						let selectedListId = model.get_value(iter, 0); // get value
						GoogleTasksService.selectedListId =
							selectedListId as string;
					});
				}}
			/>
			<stack
				transitionType={Gtk.StackTransitionType.CROSSFADE}
				transitionDuration={200}
				setup={(self) => {
					GoogleTasksService.isLoading
						? (self.shown = "loading")
						: (self.shown = "todos");
					self.hook(GoogleTasksService, "notify::is-loading", () => {
						GoogleTasksService.isLoading
							? (self.shown = "loading")
							: (self.shown = "todos");
					});
				}}
			>
				<box name="todos" vertical>
					<box className={"todos__input_box"} spacing={24}>
						<icon icon={icons.todo.checkedAlt} />
						<entry
							className={"todos__input"}
							placeholderText={"New todo..."}
							onChanged={({ text }) => newTodoText.set(text)}
							onActivate={(self) => {
								GoogleTasksService.createTask(
									newTodoText.get(),
								);
								self.text = "";
							}}
						/>
					</box>
					<scrollable className={"todos__scrollable"} name={"todos"}>
						<box vertical className={"todos__container"}>
							{bind(GoogleTasksService, "todos").as((t) =>
								t.map((item) => <TodoItem todo={item} />),
							)}
						</box>
					</scrollable>
				</box>
				<box name="loading">
					<circularprogress />
				</box>
			</stack>
		</box>
	);
};
