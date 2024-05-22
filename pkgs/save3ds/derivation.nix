{
  lib,
  fetchFromGitHub,
  rustPlatform,
  fuse,
  pkg-config,
}:
rustPlatform.buildRustPackage rec {
  pname = "save3ds";
  version = "1.3.0";

  src = fetchFromGitHub {
    owner = "wwylele";
    repo = pname;
    rev = "c42ef53";
    hash = "sha256-fmwVcGOXq4BvszEVboyon5y3xR1yEIwnDdCzCR7f3M8=";
  };

  cargoHash = "sha256-eBhTAvcTVUStJ9bDPlNvR7wYSCgG8I9YUv1tcwX5RZA=";

  meta = with lib; {
    description = "Extract, import and FUSE program for common save format for 3DS, written in rust.";
    homepage = "https://github.com/wwylele/save3ds";
    license = licenses.mit;
    maintainers = [];
  };

  buildInputs = [fuse];
  nativeBuildInputs = [pkg-config];
}
