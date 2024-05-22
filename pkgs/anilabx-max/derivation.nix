{
  stdenv,
  lib,
  fetchurl,
  autoPatchelfHook,
  glibc,
  gtk3,
  gcc,
  jdk17,
}:
stdenv.mkDerivation rec {
  pname = "anilabx-max";
  version = "1.0b1";

  src = fetchurl {
    url = "https://github.com/AniLabX/AniLabXMAX/releases/download/v${version}/AniLabXMAX_v${version}_linux64";
    hash = "sha256-Cwb2EuufJ22FhpCc0PgZndDAvkJeppcS7B5alz2vxHI=";
  };

  nativeBuildInputs = [
    autoPatchelfHook
  ];

  buildInputs = [
    gcc
    gtk3
    jdk17
    glibc
  ];

  sourceRoot = ".";

  unpackPhase = "

  ";

  installPhase = ''
    runHook preInstall
    cp $src anilabx-max
    mkdir -p $out/bin/
    cp anilabx-max $out/bin/anilabx-max
    chmod +x $out/bin/anilabx-max
    runHook postInstall
  '';

  meta = with lib; {
    homepage = "https://anilabx.xyz";
    description = "Manga and Anime app";
    platforms = platforms.linux;
  };
}
