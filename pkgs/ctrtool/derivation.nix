{
  lib,
  stdenv,
  fetchFromGitHub,
  gitUpdater,
}:
stdenv.mkDerivation rec {
  pname = "ctrtool";
  version = "1.2.0";

  src = fetchFromGitHub {
    owner = "jakcron";
    repo = "Project_CTR";
    rev = "ctrtool-v${version}";
    sha256 = "wjU/DJHrAHE3MSB7vy+swUDVPzw0Jrv4ymOjhfr0BBk=";
  };

  sourceRoot = "${src.name}/ctrtool";
  enableParallelBuilding = false;

  # preBuild = ''
  #   make -j $NIX_BUILD_CORES deps
  # '';

  buildPhase = ''
    make -j $NIX_BUILD_CORES CPPFLAGS=-O0 deps
    make -j $NIX_BUILD_CORES CPPFLAGS=-O0
  '';

  installPhase = "
    mkdir $out/bin -p
    cp bin/ctrtool${stdenv.hostPlatform.extensions.executable} $out/bin/
  ";

  passthru.updateScript = gitUpdater {rev-prefix = "ctrtool-v";};

  meta = with lib; {
    license = licenses.mit;
    description = "A tool to extract data from a 3ds rom";
    platforms = platforms.linux;
    maintainers = [maintainers.marius851000];
    mainProgram = "ctrtool";
  };
}
