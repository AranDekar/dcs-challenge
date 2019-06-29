#!/usr/bin/env bash

set -ex

nodeVersion=v4.8.7
nodePackageName=node-$nodeVersion-linux-x64
nodeTarball=node-$nodeVersion-linux-x64.tar.gz
nodeTarballUrl=https://nodejs.org/download/release/$nodeVersion/$nodeTarball
nodeJsFolder=/home/ec2-user/
nodeInstallationPath=$nodeJsFolder$nodePackageName
untarDir=${1:-"/home/ec2-user/app/current"}

sed -i "s/proxy-%NETWORKSECURITYENV%/proxy-dev/g" /etc/yum.conf
sed -i "s/proxy-%NETWORKSECURITYENV%/proxy-dev/g" /etc/profile
sed -i "s/proxy-%NETWORKSECURITYENV%/proxy-dev/g" /etc/wgetrc
source /etc/profile

wget -q $nodeTarballUrl -P $nodeJsFolder
tar xzf $nodeJsFolder$nodeTarball -C $nodeJsFolder
chown -R ec2-user:ec2-user $nodeInstallationPath
ln -s $nodeInstallationPath /usr/local/nodejs
rm $nodeJsFolder$nodeTarball

# =====================================================
# reset the proxy settings
# =====================================================
sed -i "s/proxy-dev/proxy-%NETWORKSECURITYENV%/g" /etc/yum.conf
sed -i "s/proxy-dev/proxy-%NETWORKSECURITYENV%/g" /etc/profile
sed -i "s/proxy-dev/proxy-%NETWORKSECURITYENV%/g" /etc/wgetrc

