#!/bin/bash

git reset --hard HEAD
git pull
git status
git submodule sync
git submodule update
git submodule status