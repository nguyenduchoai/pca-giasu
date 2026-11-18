#!/usr/bin/env bash
set -e
export EZYPLATFORM_HOME=${EZYPLATFORM_HOME:-/Users/nguyenduchoai/Data/Github/pca-giasu/.ezy-runtime/ezyplatform/ezyplatform}
export EZYPLATFORM_SDK=${EZYPLATFORM_SDK:-/Users/nguyenduchoai/Data/Github/pca-giasu/.ezy-runtime/ezyplatform-sdk/ezyplatform-sdk}

if [ -d "$HOME/ezyplatform-dev/jdk/Contents/Home" ]; then
    export JAVA_HOME="$HOME/ezyplatform-dev/jdk/Contents/Home"
elif [ -x /usr/libexec/java_home ]; then
    export JAVA_HOME="$(/usr/libexec/java_home -v 1.8)"
fi

if [ -d "$HOME/ezyplatform-dev/maven/bin" ]; then
    export PATH="$JAVA_HOME/bin:$HOME/ezyplatform-dev/maven/bin:$EZYPLATFORM_SDK/bin:$PATH"
else
    export PATH="$JAVA_HOME/bin:$EZYPLATFORM_SDK/bin:$PATH"
fi

mvn -pl . clean install
mvn -pl oylg-sdk clean install -DskipTests
mvn -pl oylg-admin-plugin clean install -Pexport,\!test -DskipTests
mvn -pl oylg-web-plugin clean install -Pexport,\!test -DskipTests
mvn -pl oylg-theme clean install -Pexport,\!test -DskipTests

ezy.sh package
ezy.sh export
