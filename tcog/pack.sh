#!/bin/sh
package_name=$(echo "console.log(require('./package.json').name)" | node)
package_version=$(echo "console.log(require('./package.json').version)" | node)
package="$package_name-$package_version.tar.gz"
tar -cvzf ../${package} .
