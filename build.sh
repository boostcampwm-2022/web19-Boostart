#!/bin/bash

if [ ! -d "./server/build" ]; then 
  mkdir ./server/build
fi

cp -r ./client/build/* ./server/build/