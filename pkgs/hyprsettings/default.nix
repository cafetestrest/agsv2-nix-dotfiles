{pkgs ? import <nixpkgs-unstable> {}}:
pkgs.callPackage ./derivation.nix {}
