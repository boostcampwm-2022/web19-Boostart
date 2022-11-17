#!/bin/bash

cd ./client
npm run build
cd ..

if [ ! -d "./server/build" ]; then 
  mkdir ./server/build
fi

cp -r ./client/build/* ./server/build/