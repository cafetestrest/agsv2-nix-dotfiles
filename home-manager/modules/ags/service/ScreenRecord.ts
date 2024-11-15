import { AstalIO, exec, execAsync, Gio, GLib, GObject, interval } from "astal";

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

			try {
				await execAsync(
					`bash -c "$XDG_CONFIG_HOME/ags/bin/screenrecord-end.sh" & disown`,
				);

				this.#recording = false;
				this.notify("recording");

				if (this.#interval) this.#interval.cancel();
				this.#timer = 0;
				this.notify("timer");

				const res = await execAsync([
					"notify-send",
					"Screenrecord",
					this.#file,
					"-a",
					"Screenrecord",
					"-i",
					"video-x-generic-symbolic",
					"--hint=string:image:video-x-generic-symbolic",
					"-A",
					"file=Show in Files",
					"-A",
					"view=View",
				]);

				console.log(this.#recordings + "/" + this.#file);

				switch (res) {
					case "file":
						return execAsync([
							GLib.getenv("FILE_MANAGER") || "xdg-open",
							this.#recordings,
						]);
					case "view":
						return execAsync([
							"xdg-open",
							this.#recordings + "/" + this.#file,
						]);
				}
			} catch (e) {
				console.error("Error executing screenrecord-end script:", e);
			}
		}

		// async screenshot(full = false) {
		// 	// if (!dependencies("slurp", "wayshot")) return;

		// 	const file = `${this.#screenshots}/${now()}.png`;
		// 	exec(`bash -c "mkdir -p ${this.#screenshots}"`);

		// 	if (full) {
		// 		await sh(`wayshot -f ${file}`);
		// 	} else {
		// 		const size = await sh("slurp");
		// 		if (!size) return;

		// 		await sh(`wayshot -f ${file} -s "${size}"`);
		// 	}

		// 	bash(`wl-copy < ${file}`);

		// 	Notify.Notification.new(
		// 		...{
		// 		// image: file,
		// 		summary: "Screenshot",
		// 		body: file,
		// 		actions: {
		// 			"Show in Files": () => sh(`xdg-open ${this.#screenshots}`),
		// 			View: () => sh(`xdg-open ${file}`),
		// 			Edit: () => {
		// 				if (dependencies("swappy")) sh(`swappy -f ${file}`);
		// 			},
		// 		},
		// 	}
		// 	);
		// }
	},
);
const service = new ScreenRecorderService();
export default service;
