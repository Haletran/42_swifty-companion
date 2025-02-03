with import <nixpkgs> {};

stdenv.mkDerivation {
    name = "node";
    buildInputs = [
        nodejs
    ];
    shellHook = ''
        export PATH="$PWD/node_modules/.bin/:$PATH"
        if [ ! -d "swifty/node_modules" ]; then
            cd swifty && npm install
        fi
        #eas build --platform android --profile preview
        npm run web
    '';
}
