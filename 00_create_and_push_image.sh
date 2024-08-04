#!/usr/bin/zsh
docker build --progress=plain -t pepesan/angular-app:latest .
docker login
docker push pepesan/angular-app:latest
