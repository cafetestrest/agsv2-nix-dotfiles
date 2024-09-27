{pkgs ? import <nixpkgs-unstable> {}}:
pkgs.mkShell {
  buildInputs = [(pkgs.callPackage ./derivation.nix {})];
}
