import { AstalIO, exec, execAsync, GLib, GObject, interval } from "astal";

const now = () => GLib.DateTime.new_now_local().format("%Y-%m-%d_%H-%M-%S");

const ScreenRecorderService = GObject.registerClass(
	{
		Properties: {
			timer: GObject.ParamSpec.int64(
				"timer",
				"Timer",
				"A property containing recording timer",
				GObject.ParamFlags.READABLE,
				Number.MIN_SAFE_INTEGER,
				Number.MAX_SAFE_INTEGER,
				0,
			),
			recording: GObject.ParamSpec.boolean(
				"recording",
				"Recording",
				"A property containing recording state",
				GObject.ParamFlags.READABLE,
				false,
			),
		},
	},
	class Recorder extends GObject.Object {
		#recordings = GLib.getenv("HOME") + "/Videos/Screenrecords";
		#screenshots = GLib.getenv("HOME") + "/Pictures/Screenshots";
		#file = "";
		#interval: AstalIO.Time | null = null;

		#recording = false;
		#timer = 0;

		get recording() {
			return this.#recording;
		}
		get timer() {
			return this.#timer;
		}

		async start() {
			if (this.recording) return;

			exec(`bash -c "mkdir -p ${this.#recordings}"`);
			this.#file = `${this.#recordings}/${now()}.mp4`;
			execAsync(
				'bash -c "$XDG_CONFIG_HOME/ags/bin/screenrecord-start.sh" & disown',
			);
			// sh(`$HOME/scripts/screenrecord-start.sh`);

			this.#recording = true;
			this.notify("recording");

			this.#timer = 0;
			this.#interval = interval(1000, () => {
				this.notify("timer");
				this.#timer++;
			});
		}

		async stop() {
			if (!this.recording) return;

			execAsync(
				`bash -c "$XDG_CONFIG_HOME/ags/bin/screenrecord-end.sh" & disown`,
			).then(() => {
				this.#recording = false;
				this.notify("recording");
				if (this.#interval) this.#interval.cancel();
				this.#timer = 0;
				this.notify("timer");
			});

			// Utils.notify({
			// 	iconName: icons.fallback.video,
			// 	summary: "Screenrecord",
			// 	body: this.#file,
			// 	actions: {
			// 		"Show in Files": () => sh(`xdg-open ${this.#recordings}`),
			// 		View: () => sh(`xdg-open ${this.#file}`),
			// 	},
			// });
		}

		// async screenshot(full = false) {
		// 	if (!dependencies("slurp", "wayshot")) return;

		// 	const file = `${this.#screenshots}/${now()}.png`;
		// 	Utils.ensureDirectory(this.#screenshots);

		// 	if (full) {
		// 		await sh(`wayshot -f ${file}`);
		// 	} else {
		// 		const size = await sh("slurp");
		// 		if (!size) return;

		// 		await sh(`wayshot -f ${file} -s "${size}"`);
		// 	}

		// 	bash(`wl-copy < ${file}`);

		// 	Utils.notify({
		// 		image: file,
		// 		summary: "Screenshot",
		// 		body: file,
		// 		actions: {
		// 			"Show in Files": () => sh(`xdg-open ${this.#screenshots}`),
		// 			View: () => sh(`xdg-open ${file}`),
		// 			Edit: () => {
		// 				if (dependencies("swappy")) sh(`swappy -f ${file}`);
		// 			},
		// 		},
		// 	});
		// }
	},
);
const service = new ScreenRecorderService();
export default service;
