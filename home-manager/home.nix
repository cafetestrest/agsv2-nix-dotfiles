{
  pkgs,
  username,
  ...
}: let
  homeDirectory = "/home/${username}";
in {
  imports = [
    ./packages.nix
    ./modules/astal
    ./modules/ags.nix
    ./modules/wezterm.nix
    ./modules/zsh.nix
    ./modules/tmux.nix
    ./modules/git.nix
    ./modules/theme.nix
    ./modules/vscode.nix
    ./modules/chromium.nix
    ./modules/nvim
  ];

  xdg = {
    enable = true;
    userDirs = {
      enable = true;
      createDirectories = true;
      extraConfig = {
        XDG_SCREENSHOTS_DIR = "${homeDirectory}/Pictures/screenshots";
      };
    };
  };

  home = {
    stateVersion = "24.05";
    inherit username homeDirectory;

    sessionVariables = {
      QT_XCB_GL_INTEGRATION = "none"; # kde-connect
      NIXPKGS_ALLOW_UNFREE = "1";
      SHELL = "${pkgs.zsh}/bin/zsh";
      BAT_THEME = "base16";
      GOPATH = "${homeDirectory}/.local/share/go";
      GOMODCACHE = "${homeDirectory}/./go/pkg/mod";
    };

    sessionPath = [
      "$HOME/.local/bin"
    ];
  };

  gtk.gtk3.bookmarks = [
    "file://${homeDirectory}/Documents"
    "file://${homeDirectory}/Music"
    "file://${homeDirectory}/Pictures"
    "file://${homeDirectory}/Videos"
    "file://${homeDirectory}/Downloads"
    "file://${homeDirectory}/Desktop"
    "file://${homeDirectory}/Projects"
    "file://${homeDirectory}/.config Config"
    "file://${homeDirectory}/.local/share Local"
  ];

  services = {
    mpris-proxy.enable = true;
    kdeconnect = {
      enable = true;
      indicator = false;
    };
    udiskie = {
      enable = true;
      notify = false;
    };
  };

  programs.home-manager.enable = true;
  targets.genericLinux.enable = true;

  xdg.mimeApps = {
    enable = true;
    associations.added = {
      "application/pdf" = ["org.gnome.Evince.desktop"];
    };
    defaultApplications = {
      "application/pdf" = ["org.pwmt.zathura.desktop"];
      "image/bmp" = ["org.gnome.Loupe.desktop"];
      "image/jpeg" = ["org.gnome.Loupe.desktop"];
      "image/x-png" = ["org.gnome.Loupe.desktop"];
      "image/png" = ["org.gnome.Loupe.desktop"];
      "image/gif" = ["org.gnome.Loupe.desktop"];
      "image/svg+xml" = ["org.gnome.loupe.desktop"];
      "inode/directory" = ["org.gnome.Nautilus.desktop"];
    };
  };
}

