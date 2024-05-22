import { range } from 'lib/utils';
import BarItem from '../BarItem';

const dispatch = (arg) => Utils.execAsync(`hyprctl dispatch workspace ${arg}`);
const hyprland = await Service.import('hyprland');

const Workspaces = () => {
	const ws: number = 10;
	return Widget.Box({
		children: range(ws || 20).map((i) =>
			Widget.Button({
				on_clicked: () => dispatch(i),
				cssClasses: ['bar__workspaces-indicator'],
				vexpand: false,
				hexpand: false,
				vpack: 'center',
				setup: (self) => {
					self.hook(hyprland, () => {
						self.toggleCssClass('active', hyprland.active.workspace.id === i);
					});
				},
			}),
		),
		setup: (box) => {
			if (ws === 0) {
				box.hook(hyprland.active.workspace, () =>
					box.children.map((btn) => {
						btn.visible = hyprland.workspaces.some((ws) => ws.id === btn.attribute);
					}),
				);
			}
		},
	});
};

export default () =>
	BarItem({
		cssClasses: ['bar__workspaces'],
		child: Widget.Box({
			on_scroll_up: () => dispatch('m+1'),
			on_scroll_down: () => dispatch('m-1'),
			child: Workspaces(),
		}),
	});
