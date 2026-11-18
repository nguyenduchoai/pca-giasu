#!/usr/bin/env bash
set -e
export EZYPLATFORM_HOME=${EZYPLATFORM_HOME:-/Users/nguyenduchoai/Data/Github/pca-giasu/.ezy-runtime/ezyplatform/ezyplatform}
export EZYPLATFORM_SDK=${EZYPLATFORM_SDK:-/Users/nguyenduchoai/Data/Github/pca-giasu/.ezy-runtime/ezyplatform-sdk/ezyplatform-sdk}

# Auto-detect OpenJDK for Maven compilation (Intel / Apple Silicon)
if [ -d "/usr/local/opt/openjdk/libexec/openjdk.jdk/Contents/Home" ]; then
  export JAVA_HOME="/usr/local/opt/openjdk/libexec/openjdk.jdk/Contents/Home"
elif [ -d "/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home" ]; then
  export JAVA_HOME="/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home"
fi
export PATH="$JAVA_HOME/bin:$EZYPLATFORM_SDK/bin:$PATH"

mvn -pl . clean install -Dcheckstyle.skip=true
mvn -pl oylg-sdk clean install -Dcheckstyle.skip=true -DskipTests
mvn -pl oylg-admin-plugin clean install -Pexport,\!test -Dcheckstyle.skip=true -DskipTests
mvn -pl oylg-web-plugin clean install -Pexport,\!test -Dcheckstyle.skip=true -DskipTests
mvn -pl oylg-theme clean install -Pexport,\!test -Dcheckstyle.skip=true -DskipTests

# Use Java 8 runtime for ezy.sh package & export
export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)
export PATH="$JAVA_HOME/bin:$EZYPLATFORM_SDK/bin:$PATH"
ezy.sh package
ezy.sh export
