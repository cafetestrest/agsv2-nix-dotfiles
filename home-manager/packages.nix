{
  pkgs,
  inputs,
  ...
}: {
  home.packages = with pkgs;
  with nodePackages_latest;
  with gnome; [
    #cli
    btop
    fd
    ripgrep
    fzf
    inotify-tools
    ffmpeg
    libnotify
    killall
    p7zip
    gh
    tesseract

    #tools
    ripdrag
    nekoray
    wineWowPackages.waylandFull
    winetricks
    pamixer
    blueman

    #gui
    obs-studio
    figma-linux
    zoom-us
    kitty
    foot
    yazi
    mpv
    vesktop
    gimp
    zathura
    telegram-desktop
    mission-center
    loupe
    simple-scan
    fragments
    ghex
    yandex-music

    #hypr
    socat # for monitor connect script
    hyprpicker
    hypridle
    hyprlock
    wl-gammactl
    wl-clipboard
    wf-recorder
    grimblast
    pavucontrol
    brightnessctl
    swww
    gsettings-desktop-schemas
    material-icons
    corefonts

    # games
    (prismlauncher.override {jdks = [jdk8 jdk17 jdk19];})
    (pkgs.steam.override {extraPkgs = pkgs: with pkgs; [gamemode gamescope];})

    #development
    bruno
    zed-editor
    jetbrains.datagrip
    docker-compose
    android-studio

    # langs
    nodejs
    bun
    sassc
    typescript
    meson
    yarn
  ];
}
