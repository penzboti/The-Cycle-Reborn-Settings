{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  # https://v2.tauri.app/start/prerequisites/#linux
  nativeBuildInputs = with pkgs; [
    pkg-config
    gobject-introspection
    cargo
    cargo-tauri
    nodejs
    rustc # this wasn't included, which is weird, i needed this to build my proj
  ];

  buildInputs = with pkgs;[
    at-spi2-atk
    atkmm
    cairo
    gdk-pixbuf
    glib
    gtk3
    harfbuzz
    librsvg
    libsoup_3
    pango
    webkitgtk_4_1
    openssl
  ];
}
