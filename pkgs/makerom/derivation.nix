{
  lib,
  stdenv,
  fetchFromGitHub,
  mbedtls,
}:
stdenv.mkDerivation rec {
  pname = "makerom";
  version = "0.18.3";

  src = fetchFromGitHub {
    owner = "jakcron";
    repo = "Project_CTR";
    rev = "makerom-v${version}";
    hash = "sha256-Ya4GjlBBthzHptZhT9wjZMdjkUctaWsRhRwC57c4XCE=";
  };

  sourceRoot = "${src.name}/makerom";

  makeFlags = ["CC=${stdenv.cc.targetPrefix}cc" "CXX=${stdenv.cc.targetPrefix}c++"];
  enableParallelBuilding = true;

  buildPhase = "
    make deps all
  ";

  installPhase = "
    mkdir $out/bin -p
    cp bin/makerom${stdenv.hostPlatform.extensions.executable} $out/bin/
  ";

  meta = with lib; {
    license = licenses.mit;
    description = "A tool to extract data from a 3ds rom";
    platforms = platforms.linux;
    maintainers = [maintainers.marius851000];
    mainProgram = "makerom";
  };
}
