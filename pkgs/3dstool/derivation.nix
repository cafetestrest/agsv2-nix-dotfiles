{
  cmake,
  openssl,
  curl,
  stdenv,
  fetchFromGitHub,
}:
stdenv.mkDerivation rec {
  pname = "3dstool";
  version = "1.2.6";

  src = fetchFromGitHub {
    owner = "dnasdw";
    repo = pname;
    rev = "9c4336b";
    hash = "sha256-5gKdLxIwi6vqP5VOUHXPaTM1MC5HTMOg+UKo75hQ1AQ=";
  };

  nativeBuildInputs = [cmake openssl curl];
  buildInputs = [];

  configurePhase = ''
    mkdir build
    cd build
    cmake -DUSE_DEP=OFF ..
  '';

  buildPhase = ''
    make
  '';

  installPhase = ''
    mkdir -p $out/bin
    cp ../bin/Release/3dstool $out/bin
  '';
}
