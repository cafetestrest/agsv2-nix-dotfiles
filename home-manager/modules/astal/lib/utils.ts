import Gdk from 'types/@girs/gdk-4.0/gdk-4.0';
import GLib from 'types/@girs/glib-2.0/glib-2.0';
import { Application } from 'types/service/applications';
import icons, { substitutes } from './icons';
import GdkPixbuf from 'types/@girs/gdkpixbuf-2.0/gdkpixbuf-2.0';
import {
	QuantizerCelebi,
	Score,
	argbFromRgb,
	themeFromSourceColor,
} from 'node_modules/@material/material-color-utilities/index';
import Gtk from 'types/@girs/gtk-4.0/gtk-4.0';

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

export function icon(name: string | null, fallback = icons.apps.apps) {
	if (!name) return fallback || '';

	if (GLib.file_test(name, GLib.FileTest.EXISTS)) return name;

	const icon = substitutes[name] || name;
	if (Utils.lookUpIcon(icon)) return icon;

	print(`no icon substitute "${icon}" for "${name}", fallback: "${fallback}"`);
	return fallback;
}

export function range(length, start = 1) {
	return Array.from({ length }, (_, i) => i + start);
}

export function forMonitors(widget: (monitor: number) => Gtk.Window) {
	const n = Gdk.Display.get_default()?.get_monitors().get_n_items() || 1;
	return range(n, 0).map(widget).flat(1);
}

export function reloadCss() {
	Utils.subprocess(
		['inotifywait', '--recursive', '--event', 'create,modify', '-m', App.configDir + '/style'],
		() => {
			Utils.exec(`sassc ${App.configDir}/style/main.scss ${App.configDir}/style.css`);
			App.resetCss();
			App.applyCss(`${App.configDir}/style.css`);
		},
	);
}

export function substitute(collection, item) {
	return collection.find(([from]) => from === item)?.[1] || item;
}

export async function bash(strings: TemplateStringsArray | string, ...values: unknown[]) {
	const cmd =
		typeof strings === 'string'
			? strings
			: strings.flatMap((str, i) => str + `${values[i] ?? ''}`).join('');

	return Utils.execAsync(['bash', '-c', cmd]).catch((err) => {
		console.error(cmd, err);
		return '';
	});
}

export async function sh(cmd: string | string[]) {
	return Utils.execAsync(cmd).catch((err) => {
		console.error(typeof cmd === 'string' ? cmd : cmd.join(' '), err);
		return '';
	});
}

export function launchApp(app: Application) {
	Utils.execAsync(['hyprctl', 'dispatch', 'exec', `zsh -c ${app.executable}`]);
	app.frequency += 1;
}

export function sourceColorFromPixbuf(pixbuf: GdkPixbuf.Pixbuf) {
	const scaledPixbuf = pixbuf.scale_simple(128, 128, 2);
	if (scaledPixbuf != null) {
		const data = scaledPixbuf.get_pixels();
		const byte_length = scaledPixbuf.get_byte_length();

		const pixels: number[] = [];

		for (let i = 0; i < byte_length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
			const a = data[i + 3];

			if (a < 255) {
				continue;
			}
			const argb = argbFromRgb(r, g, b);
			pixels.push(argb);
		}
		const result = QuantizerCelebi.quantize(pixels, 128);
		const ranked = Score.score(result);
		const top = ranked[0];
		return top;
	}
}

export function themeFromPixbuf(pixbuf: GdkPixbuf.Pixbuf) {
	const sourceColor = sourceColorFromPixbuf(pixbuf);
	return themeFromSourceColor(sourceColor);
}
