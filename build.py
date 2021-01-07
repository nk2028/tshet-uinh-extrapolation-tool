from collections import defaultdict
import sqlite3

conn = sqlite3.connect('qieyun.sqlite3')
cur = conn.cursor()

# 添加日語漢音

cur.execute('DROP TABLE IF EXISTS 日語漢音;')
cur.execute('''
CREATE TABLE 日語漢音
( '字頭' TEXT PRIMARY KEY
, '現代讀音' TEXT NOT NULL
);''')

with open('kan-on.txt') as f:
	for line in f:
		line = line.rstrip('\n')
		k = line[0]
		v = line[2:]
		cur.execute('INSERT INTO 日語漢音 VALUES (?, ?)', (k, v))

# 添加新字體表

cur.execute('DROP TABLE IF EXISTS 新字體;')
cur.execute('''
CREATE TABLE 新字體
( 'id' INTEGER PRIMARY KEY
, '字頭' TEXT 
, '新字體' TEXT NOT NULL
);''')

with open('JPVariants.txt') as f:
	for line in f:
		k, vs = line.rstrip('\n').split('\t')
		v = vs[0]
		cur.execute('INSERT INTO 新字體 VALUES (?, ?, ?)', (None, k, v))

cur.close()
conn.commit()
conn.execute('VACUUM')
conn.close()
