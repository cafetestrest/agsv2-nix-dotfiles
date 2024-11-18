import { bind, GObject, Variable } from "astal";
import { astalify, ConstructProps, Gtk } from "astal/gtk3";
import TodosService, { Todo } from "../../../service/LocalTodos";
import icons from "../../../lib/icons";
import GoogleTasksService, { Task } from "../../../service/GoogleTasks";


class ComboBox extends astalify(Gtk.ComboBox){
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
                    GoogleTasksService.checkTask(todo)
				}}
			>
				<icon
					className="todo__check"
					icon={
						todo.status =="completed" ? icons.todo.checkedAlt : icons.todo.unchecked
					}
					pixelSize={24}
				/>
			</button>

			<label
				hexpand={true}
				halign={Gtk.Align.START}
				label={todo.title}
			/>

            {/*
			<button
				valign={Gtk.Align.CENTER}
				onClicked={() => {
					TodosService.remove(idx);
				}}
			>
				<icon
					className="todo__delete"
					pixelSize={24}
					icon={icons.ui.close}
				/>
			</button>
            */}
		</box>
	);
};


export default () => {
	const newTodoText = Variable<string>("");


	return (
		<box vertical className={"todos block"}
        >
			<label
				label={"Todos"}
				className={"todos__heading"}
				halign={Gtk.Align.START}
			/>
			<box className={"todos__input_box"} spacing={24}>
				<icon icon={icons.todo.checkedAlt} />
				<entry
					className={"todos__input"}
					placeholderText={"New todo..."}
					onChanged={({ text }) => newTodoText.set(text)}
					onActivate={(self) => {
						GoogleTasksService.createTask(newTodoText.get());
						self.text = "";
					}}
				/>
			</box>
            {/*

			<stack
				transitionType={Gtk.StackTransitionType.CROSSFADE}
				shown={bind(TodosService, "todos").as((t) =>
					t.length > 0 ? "todos" : "placeholder",
				)}
			>
                */}
				<scrollable className={"todos__scrollable"} name={"todos"}>
					<box vertical className={"todos__container"}>
						{bind(GoogleTasksService, "todos").as((t) =>
							t.map((item) => (
								<TodoItem todo={item}/>
							)),
						)}
					</box>
				</scrollable>
            {/*
				<box name={"placeholder"}></box>
			</stack>
                */}
		</box>
	);
};
