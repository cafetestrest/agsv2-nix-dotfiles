const mpris = await Service.import('mpris');

const players = mpris.bind('players');
const selectedPlayer = Variable(0);
import icons from 'lib/icons';
import { hexToRgb, icon } from 'lib/utils';
import materialColors from 'services/materialColors';
import Gtk from 'types/@girs/gtk-4.0/gtk-4.0';
import { MprisPlayer } from 'types/service/mpris';
const audio = await Service.import('audio');

export default () => {
	const Player = (player: MprisPlayer) => {
		const cover = ({ ...props }) =>
			Widget.Overlay({
				cssClasses: ['player__container'],
				overflow: Gtk.Overflow.HIDDEN,
				child: Widget.Box({
					vexpand: true,
					cssClasses: ['player__cover'],
					setup: (self) => {
						self.hook(materialColors, (self) => {
							self.css = `background-image: url("file://${player.cover_path}");`;
						});
					},
				}),
				overlays: [
					Widget.Box({
						css: `background: rgba(0, 0, 0, 0.25);`,
					}),
					Widget.CenterBox({
						...props,
						setup: (self) =>
							self.hook(materialColors, (self) => {
								const colors = materialColors.colors.get(player.cover_path);
								if (colors) {
									const colors_rgb = hexToRgb(colors.primary);
									if (colors_rgb) {
										self.css = `
                                    background: radial-gradient(circle,\
                                        rgba(${colors_rgb.r}, ${colors_rgb.g}, ${colors_rgb.b}, 0.05) 10%,\
                                        rgba(${colors_rgb.r}, ${colors_rgb.g}, ${colors_rgb.b}, 0.6));
                                    color: ${colors.onPrimary};
                                `;
									}
								}
							}),
					}),
				],
			});

		const title = Widget.Label({
			cssClasses: ['title'],
			maxWidthChars: 20,
			truncate: 'end',
			hpack: 'start',
			label: player.track_title,
		});

		const artist = Widget.Label({
			cssClasses: ['artist'],
			maxWidthChars: 20,
			truncate: 'end',
			hpack: 'start',
			label: player.track_artists.join(', '),
		});

		const positionSlider = Widget.Slider({
			cssClasses: ['player__position-slider'],
			hexpand: true,
			value: player.bind('position') || 0,
			min: 0,
			max: player.bind('length'),
			on_change: ({ value }) => (player.position = value),
		});

		const playericon = Widget.Icon({
			hexpand: true,
			hpack: 'start',
			pixelSize: 20,
			cssClasses: ['player-icon'],
			tooltipText: player.identity || '',
			setup: (self) =>
				self.hook(player, (icon) => {
					const name = `${player.entry}-symbolic`;
					Utils.lookUpIcon(name)
						? (icon.icon = name)
						: (icon.icon = icons.media.fallback);
				}),
		});

		const playPause = Widget.Button({
			cssClasses: ['player__play-pause'],
			on_clicked: () => player.playPause(),
			// visible: player.bind('can_play'),
			iconName: player.bind('play_back_status').as((s) => {
				switch (s) {
					case 'Playing':
						return icons.media.playing;
					case 'Paused':
					case 'Stopped':
						return icons.media.stopped;
				}
			}),
			setup: (self) => {
				self.hook(
					player,
					(_self, _player) => {
						self.toggleCssClass('active', player.play_back_status == 'Playing');
					},
					'notify::play-back-status',
				);
				self.hook(materialColors, (_) => {
					const colors = materialColors.colors.get(player.cover_path);
					if (colors) {
						self.css = `
							background: ${colors.primaryContainer}; \
							color: ${colors.onPrimaryContainer};
						`;
					}
				});
			},
		});

		const prev = Widget.Button({
			on_clicked: () => player.previous(),
			visible: player.bind('can_go_prev'),

			child: Widget.Icon({
				cssClasses: ['previous'],
				icon: icons.media.prev,
			}),
		});

		const next = Widget.Button({
			on_clicked: () => player.next(),
			visible: player.bind('can_go_next'),
			child: Widget.Icon({
				cssClasses: ['next'],
				icon: icons.media.next,
			}),
		});

		const currentSink = Widget.Button({
			on_clicked: () => App.toggleWindow('popup_sink'),
			cssClasses: ['player__sink'],
			setup: (self) =>
				self.hook(materialColors, (_) => {
					const colors = materialColors.colors.get(player.cover_path);
					if (colors) {
						self.css = `
							background: ${colors.primaryContainer}; \
							color: ${colors.onPrimaryContainer};
						`;
					}
				}),
			child: Widget.Box({
				spacing: 4,
				vpack: 'center',
				children: [
					Widget.Icon({
						pixelSize: 12,
						icon: audio
							.bind('speaker')
							.as((speaker) => icon(speaker.icon_name || '', icons.fallback.audio)),
					}),
					Widget.Label({
						maxWidthChars: 18,
						truncate: 'end',
						label: audio
							.bind('speaker')
							.as(
								(speaker) =>
									(speaker.description || '').split(' ').slice(0, 4).join(' ') ||
									'',
							),
					}),
				],
			}),
		});

		const header = Widget.Box({
			cssClasses: ['player__header'],
			hexpand: true,
			vexpand: true,
			vpack: 'start',
			children: [playericon, currentSink],

			setup: (self) =>
				self.hook(materialColors, () => {
					const colors = materialColors.colors.get(player.cover_path);
					if (colors) {
						self.css = `
                                color: ${colors.primaryContainer};
                            `;
					}
				}),
		});

		const center = Widget.Box({
			cssClasses: ['center-box'],
			hexpand: true,
			children: [
				Widget.Box({
					cssClasses: ['player__title-box'],
					vertical: true,
					vpack: 'center',
					hexpand: true,
					children: [title, artist],
					setup: (self) =>
						self.hook(
							materialColors,
							(_, bus_name) => {
								if (bus_name == player.bus_name) {
									self.add_css_class('dissappear');
									setTimeout(() => {
										self.remove_css_class('dissappear');
										title.label = player.track_title;
										artist.label = player.track_artists.join(', ');
									}, 300);
								}
							},
							'colors-changed',
						),
				}),
				Widget.Box({
					vexpand: false,
					children: [playPause],
				}),
			],
		});

		const footer = Widget.Box({
			cssClasses: ['player__footer'],
			spacing: 16,
			vpack: 'end',
			hexpand: true,
			children: [
				prev,
				positionSlider,
				// ShuffleButton,
				// mpris.LoopButton(player),
				next,
			],
		});

		return cover({
			vertical: true,
			cssClasses: ['player'],
			vexpand: false,
			start_widget: header,
			center_widget: center,
			end_widget: footer,
		});
	};

	const widget = Widget.Overlay({
		visible: players.as((p) => p.length > 0),
		child: Widget.Stack({
			onScrollUp: () => selectedPlayer.setValue(Math.max(selectedPlayer.value - 1, 0)),
			onScrollDown: () =>
				selectedPlayer.setValue(
					Math.min(selectedPlayer.value + 1, Object.keys(players).length - 2),
				),
			hexpand: true,
			cssClasses: ['players'],
			transition: 'slide_left_right',
			children: players.as((p) =>
				p.reduce((acc, currentValue, index) => {
					acc[index] = Player(currentValue);
					return acc;
				}, {}),
			),
			setup: (self) => {
				self.hook(selectedPlayer, (self) => (self.shown = String(selectedPlayer.value)));
			},
		}),
		overlay: Widget.Box({
			hexpand: false,
			vpack: 'end',
			hpack: 'center',
			spacing: 6,
			visible: players.as((p) => p.length > 1),
			children: players.as((p) =>
				p.map((_, idx) =>
					Widget.Box({
						cssClasses: ['player__indicator'],
						setup: (self) => {
							self.toggleCssClass('active', idx == selectedPlayer.getValue());
							self.hook(selectedPlayer, (_) =>
								self.toggleCssClass('active', idx == selectedPlayer.getValue()),
							);
						},
					}),
				),
			),
		}),
	});

	return widget;
};
