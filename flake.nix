{
  description = "NixOS configuration";

  outputs = inputs @ {
    home-manager,
    nixvim,
    nixpkgs,
    nixos-cosmic,
    yandex-music,
    transparent-nvim,
    auto-cpufreq,
    ...
  }: let
    username = "posaydone";
    system = "x86_64-linux";
  in {
    nixosConfigurations."posaydone-laptop" = nixpkgs.lib.nixosSystem {
      inherit system;
      specialArgs = {inherit inputs username system;};
      modules = [
        {
          nix.settings.trusted-users = ["posaydone"];
        }
        ./nixos/configuration.nix
        yandex-music.nixosModules.default
        home-manager.nixosModules.home-manager
        nixos-cosmic.nixosModules.default
        auto-cpufreq.nixosModules.default
        {
          home-manager.backupFileExtension = "old";
          home-manager = {
            useGlobalPkgs = true;
            useUserPackages = true;
            users.posaydone = import ./home-manager/home.nix;
            extraSpecialArgs = {inherit inputs username system;};
          };
        }
      ];
    };
  };

  inputs = {
    auto-cpufreq = {
      url = "github:AdnanHodzic/auto-cpufreq";
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.05";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    nbfc-linux = {
      url = "github:abdlrhman08/nbfc-linux/make_fix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixos-cosmic = {
      url = "github:lilyinstarlight/nixos-cosmic";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    yandex-music.url = "github:cucumber-sp/yandex-music-linux";
    home-manager = {
      url = "github:nix-community/home-manager/release-24.05";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    hyprland.url = "git+https://github.com/hyprwm/Hyprland?submodules=1";
    hyprlock = {
      url = "github:hyprwm/hyprlock";
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };
    hypridle = {
      url = "github:hyprwm/hypridle";
    };
    astal.url = "github:Aylur/astal";
    ags = {
      url = "github:Aylur/ags/v2";
      inputs.astal.follows = "astal";
    };
    matugen.url = "github:InioX/Matugen?rev=0bd628f263b1d97f238849315f2ce3ab4439784e";
    more-waita = {
      url = "https://github.com/somepaulo/MoreWaita/archive/refs/heads/main.zip";
      flake = false;
    };
    nixvim = {
      url = "github:nix-community/nixvim/nixos-24.05";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    transparent-nvim = {
      url = "github:xiyaowong/transparent.nvim";
      flake = false;
    };
  };
}

