import { type Subscribable } from "astal/binding";
import { Gtk, App, GLib, monitorFile, writeFile, exec } from "astal";
import { transparentScrimWindowNames, scrimWindowNames } from "./variables";

export function range(length: number, start = 1) {
	return Array.from({ length }, (_, i) => i + start);
}

export const activePopupWindows = (scrimType: "transparent" | "opaque") => {
	return App.get_windows().filter((window) => {
		if (scrimType === "transparent") {
			return (
				transparentScrimWindowNames.get().includes(window.name) &&
				window.visible
			);
		} else {
			return (
				scrimWindowNames.get().includes(window.name) && window.visible
			);
		}
	});
};

export function toggleWindow(windowName: string) {
	const w = App.get_window(windowName);

	if (w) {
		if (w.visible) {
			w.visible = false;
		} else {
			if (transparentScrimWindowNames.get().includes(windowName)) {
				App.get_window("transparent-scrim")?.set_visible(true);
			} else {
				activePopupWindows("opaque").forEach((window) => {
					window.visible = false;
				});
				App.get_window("scrim")?.set_visible(true);
			}
			w.visible = true;
		}
	}
}

export function hexToRgb(hex: string) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result != null) {
		return {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
		};
	}
}

export function lookUpIcon(name?: string, size = 16) {
	if (!name) return null;

	return Gtk.IconTheme.get_default().lookup_icon(
		name,
		size,
		Gtk.IconLookupFlags.USE_BUILTIN,
	);
}

export function monitorColorsChange() {
	monitorFile(`${GLib.getenv("HOME")}/.config/ags/style/colors.scss`, () => {
		const target = "/tmp/astal/style.css";
		exec(
			`sass ${GLib.getenv("HOME")}/.config/ags/style/main.scss ${target}`,
		);
		App.apply_css(target);
	});
}
