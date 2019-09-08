#!/bin/sh
startAt=`date +"%Y-%m-%d %H:%M:%S"`
echo "STEP 1: build the prject's source. StartAt ${startAt}"

echo "StartAt  ${startAt}" > build.log
PUBLIC_URL=/ npm run build >> build.log

if [ $? != 0 ]; then
  echo 'Build Project Error!'
  exit 0
fi

echo "STEP 2: Make the docker image"
docker build -t 114.220.74.133:5000/fe-app:latest . >> build.log

if [ $? != 0 ]; then
  echo 'Build Docker Image Error!'
  exit 0
fi

echo "STEP 3: Push the image to 114.220.74.133"
docker push 114.220.74.133:5000/fe-app:latest >> build.log

echo "Build Success"