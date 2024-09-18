{
  inputs,
  pkgs,
  ...
}: let
  nixpkgs-unstable = inputs.nixpkgs-unstable.legacyPackages.${pkgs.system};
in {
  home.packages = with pkgs;
  with nodePackages_latest;
  with gnome; [
    (pkgs.callPackage ../pkgs/hyprsettings/derivation.nix {})
    #cli
    xclip
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
    # (callPackage ./modules/hyprsettings/derivation.nix {})
    rustdesk-flutter
    ripdrag
    nekoray
    wineWowPackages.waylandFull
    winetricks
    pamixer
    blueman

    #gui
    lutris
    obs-studio
    wpsoffice
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
    (prismlauncher.override {jdks = [jdk8 jdk17 jdk21];})

    #development
    bruno
    nixpkgs-unstable.zed-editor
    gnome-builder
    flatpak-builder
    docker-compose
    android-studio

    # langs
    nodejs
    bun
    sassc
    # typescript
    meson
    yarn
  ];
}
