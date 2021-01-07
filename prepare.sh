#!/bin/sh

# 下載切韻資料庫
curl -LsSO https://github.com/nk2028/qieyun-sqlite/releases/download/20210104/qieyun.sqlite3

# 下載新字體資料
curl -LsSO https://cdn.jsdelivr.net/npm/opencc-data@1.0.5/data/JPVariants.txt
