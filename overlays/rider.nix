{
  config,
  pkgs,
  lib,
  pkgs-rider,
  ...
}: {
  nixpkgs.overlays = [
    (self: super: {
      jetbrains = pkgs-rider.jetbrains;
    })
  ];
}
