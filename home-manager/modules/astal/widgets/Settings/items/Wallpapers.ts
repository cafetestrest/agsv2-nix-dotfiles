import { sh } from 'lib/utils';
import GdkPixbuf from 'types/@girs/gdkpixbuf-2.0/gdkpixbuf-2.0';
import Gio from 'types/@girs/gio-2.0/gio-2.0';
import Gtk from 'types/@girs/gtk-4.0/gtk-4.0';
import { FileDialog } from 'types/@girs/gtk-4.0/gtk-4.0.cjs';

const PREVIEW_DIR = Utils.CACHE_DIR + '/wallpapers/preview';
const WALLPAPERS_DIR = Utils.CACHE_DIR + '/wallpapers';
const currentWallpaperPath: string = '/home/posaydone/.cache/Astal/current_wallpaper';

const fileDialog = FileDialog.new();

const currentWallpaper = new Gtk.Picture({
	contentFit: 2,
	cssClasses: ['current-wallpaper'],
});

const createImageWidget = (name: string, filepath?: string) => {
	let [fileName, fileType] = name.split('.');
	if (fileType == 'jpg') fileType = 'jpeg';
	const cachedFilepath = `${PREVIEW_DIR}/${fileName}.${fileType}`;
	if (!filepath) filepath = `${WALLPAPERS_DIR}/${name}`;
	let pixbuf: GdkPixbuf.Pixbuf;
	try {
		pixbuf = GdkPixbuf.Pixbuf.new_from_file(cachedFilepath);
	} catch {
		pixbuf = GdkPixbuf.Pixbuf.new_from_file(filepath);
		pixbuf = pixbuf.scale_simple(480, 300, 2);
		pixbuf.savev(cachedFilepath, fileType, null, null);
	}

	const image = new Gtk.Picture({ contentFit: 2 });
	image.set_pixbuf(pixbuf);

	return Widget.Button({
		cssClasses: ['wallpaper-setter__item'],
		child: image,
		overflow: 1,
		onPrimaryClick: () => {
			Utils.execAsync([
				'hyprctl',
				'dispatch',
				'exec',
				`matugen image "${filepath}";\
	                       gsettings set org.gnome.desktop.interface gtk-theme 'adw-gtk3-dark'\
	                       && gsettings set org.gnome.desktop.interface color-scheme 'prefer-dark'`,
			]);
			Utils.execAsync([
				'hyprctl',
				'dispatch',
				'exec',
				`ln -sf ${filepath} $HOME/.cache/Astal/current_wallpaper`,
			]);
			currentWallpaper.set_filename(filepath);
		},
	});
};

async function createImageWidgets() {
	sh(`mkdir -p ${PREVIEW_DIR}`);

	let imageWidgets: Gtk.Widget[] = [];
	const files = Gio.File.new_for_path(WALLPAPERS_DIR).enumerate_children(
		'standard::name,standard::type',
		Gio.FileQueryInfoFlags.NONE,
		null,
	);

	let info: Gio.FileInfo;

	while ((info = files.next_file(null))) {
		if (info.get_file_type() === Gio.FileType.REGULAR) {
			const name = info.get_name();
			const imageWidget = createImageWidget(name);
			imageWidgets.push(imageWidget);
		}
	}

	return imageWidgets;
}

const flowBox = Widget.FlowBox({
	minChildrenPerLine: 3,
	rowSpacing: 16,
	homogeneous: true,
	columnSpacing: 16,
	setup: async (self) => {
		currentWallpaper.set_filename(currentWallpaperPath);
		const widgets = await createImageWidgets();
		widgets.forEach((widget) => {
			self.append(widget);
		});
	},
});

export default () =>
	Widget.Box({
		cssClasses: ['wallpaper-setter'],
		vertical: true,
		spacing: 16,
		children: [
			Widget.Box({
				vertical: true,
				children: [
					Widget.Label({
						hpack: 'start',
						cssClasses: ['current-wallpaper__label'],
						label: 'Current wallpaper',
					}),
					currentWallpaper,
				],
			}),
			Widget.Button({
				cssClasses: ['wallpaper-setter__add'],
				label: 'Add new wallpaper',
				onPrimaryClick: async () => {
					fileDialog.open(null, null, (self: FileDialog, result: Gio.AsyncResult) => {
						const source: Gio.File = self.open_finish(result);
						let [fileName, fileType] = source.get_basename().split('.');
						if (fileType.toLowerCase() == 'jpg') fileType = 'jpeg';
						const targetPath = `${WALLPAPERS_DIR}/${fileName}.${fileType}`;
						const target = Gio.File.new_for_path(targetPath);
						source.copy(target, Gio.FileCopyFlags.NONE, null, null);
						const imageWidget = createImageWidget(`${fileName}.${fileType}`);
						flowBox.append(imageWidget);
					});
				},
			}),
			flowBox,
		],
	});
