#!/usr/bin/env bash

set -u
set -e

# read -p "please input env:" -t 60 ENVIRONMENT

echo "请选择要发布的环境?"

select ENVIRONMENT in prod  stage;
do
    break
done
 
if [[ "$ENVIRONMENT" != "prod" && "$ENVIRONMENT" != "stage" ]];then
echo "err input, quit now"
exit 1
fi

## ======================================================

read -r -p "确认发布到 $ENVIRONMENT 环境? [Y/n] " input

case $input in
    [yY][eE][sS]|[yY])
        echo "Yes"
        ;;

    [nN][oO]|[nN])
        echo "No"
        exit 0
        ;;

    *)
        echo "Invalid input..."
        exit 1
        ;;
esac

## =======================================================

IMAGE_DOMAIN="domain"
IMAGE_NAME="vue-admin"
IMAGE_VERSION=$(date +%Y%m%d%H%M)

npm run build:$ENVIRONMENT


## 关闭shop_admin容器
#docker stop vue-admin || true;

## 删除shop_admin容器
#docker rm vue-admin || true;

## 删除shop/admin镜像
#docker rmi --force $(docker images | grep vue-admin | awk '{print $3}')

## 构建shop/admin:$image_version镜像
docker build -t $IMAGE_DOMAIN/$IMAGE_NAME:$IMAGE_VERSION --build-arg ENVIRONMENT=$ENVIRONMENT .



## 删除build过程中产生的镜像    #docker image prune -a -f
# docker rmi $(docker images -f "dangling=true" -q)

## 对空间进行自动清理
# docker system prune -a -f



## 启动
# docker run --rm --name $IMAGE_NAME -p 80:80 -d $IMAGE_DOMAIN/$IMAGE_NAME:$IMAGE_VERSION

# echo "docker run --rm --name $IMAGE_NAME -p 80:80 -d $IMAGE_DOMAIN/$IMAGE_NAME:$IMAGE_VERSION"











