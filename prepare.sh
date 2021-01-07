#!/bin/sh

# 下載切韻資料庫
curl -LsSO https://github.com/nk2028/qieyun-sqlite/releases/download/20201205/qieyun.sqlite3

# 下載異體字資料
curl -LsSO https://github.com/nk2028/yitizi/archive/v0.0.3.tar.gz
tar -zxvf v0.0.3.tar.gz
cd yitizi-0.0.3
python build/main.py
cd ..
mv yitizi-0.0.3/yitizi.json .
rm -rf v0.0.3.tar.gz yitizi-0.0.3

# 下載粵語音資料
curl -LsSo dict.yaml https://raw.githubusercontent.com/rime/rime-cantonese/3b792da/jyut6ping3.dict.yaml
