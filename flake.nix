with import <nixpkgs> {};

stdenv.mkDerivation {
    name = "node";
    buildInputs = [
        nodejs
    ];
    shellHook = ''
        export PATH="$PWD/node_modules/.bin/:$PATH"
        export ANDROID_HOME=$HOME/Android/Sdk
        export PATH=$PATH:$ANDROID_HOME/emulator
        export PATH=$PATH:$ANDROID_HOME/platform-tools
        cd swifty && npm install
        if [ ! -f .env ]; then
            read -p "Enter CLIENT_ID: " CLIENT_ID
            read -p "Enter CLIENT_SECRET: " CLIENT_SECRET
            echo "EXPO_PUBLIC_CLIENT_ID=$CLIENT_ID" >> .env
            echo "EXPO_PUBLIC_CLIENT_SECRET=$CLIENT_SECRET" >> .env
        fi
        npm run web
        #npx eas build --platform android --profile preview
    '';
}
