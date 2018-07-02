#!/bin/bash

TRAGET="/root/DormHub"
GIT_DIR="https://github.com/nathantannar4/DormHub.git"

cd $TRAGET
git reset --hard HEAD
git --work-tree=$TRAGET --git-dir=$GIT_DIR pull
git status
git submodule sync
git submodule update
git submodule status