#!/bin/sh

handle() {
  case $1 in monitoradded*)
    hyprctl dispatch moveworkspacetomonitor "1 1"
    hyprctl dispatch moveworkspacetomonitor "2 1"
    hyprctl dispatch moveworkspacetomonitor "4 0"
    hyprctl dispatch moveworkspacetomonitor "6 0"
    astal -q;
    matugen image "$HOME/.cache/Astal/current_wallpaper";
    gsettings set org.gnome.desktop.interface gtk-theme 'adw-gtk3-dark';
    gsettings set org.gnome.desktop.interface color-scheme 'prefer-dark';
    astal & disown;
  esac
  case $1 in monitorremoved*)
    astal -q;
    astal & disown;
  esac
}

socat -t 1000 - "UNIX-CONNECT:$XDG_RUNTIME_DIR/hypr/${HYPRLAND_INSTANCE_SIGNATURE}/.socket2.sock" | while read -r line; do handle "$line"; done
