{
  description = "NixOS configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    nbfc-linux = {
      url = "github:nbfc-linux/nbfc-linux";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixos-cosmic = {
      url = "github:lilyinstarlight/nixos-cosmic";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    yandex-music.url = "github:cucumber-sp/yandex-music-linux";
    home-manager.url = "github:nix-community/home-manager";
    home-manager.inputs.nixpkgs.follows = "nixpkgs";
    hyprland.url = "git+https://github.com/hyprwm/Hyprland?submodules=1";
    hypridle.url = "github:hyprwm/hypridle";
    ags.url = "github:Aylur/ags";
    astal.url = "github:PoSayDone/astal";
    matugen = {
      url = "github:InioX/Matugen?ref=v2.2.0";
    };
    more-waita = {
      url = "https://github.com/somepaulo/MoreWaita/archive/refs/heads/main.zip";
      flake = false;
    };
    nixvim = {
      url = "github:nix-community/nixvim";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    transparent-nvim = {
      url = "github:xiyaowong/transparent.nvim";
      flake = false;
    };
  };

  outputs = inputs @ {
    home-manager,
    nixvim,
    nixpkgs,
    nixos-cosmic,
    yandex-music,
    transparent-nvim,
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
        {
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
}

