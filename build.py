from collections import defaultdict
import json
import sqlite3

conn = sqlite3.connect('qieyun.sqlite3')
cur = conn.cursor()

# 粵語音

cur.execute('DROP TABLE IF EXISTS 粵語音;')
cur.execute('''
CREATE TABLE 粵語音
( '字頭' TEXT PRIMARY KEY
, '粵語音' TEXT NOT NULL
);''')

d = defaultdict(dict)

with open('dict.yaml') as f:
	# Skip header
	for line in f:
		if line == '...\n':
			break
	next(f)

	for line in f:
		line = line.rstrip('\n')
		if line and line[0] != '#':
			ch, jp, *_ = line.split('\t')
			if len(ch) == 1:
				d[ch][jp] = None

for k, vs in d.items():
	v = ', '.join(vs)
	cur.execute('INSERT INTO 粵語音 VALUES (?, ?)', (k, v))

# 異體字

cur.execute('DROP TABLE IF EXISTS 異體字;')
cur.execute('''
CREATE TABLE 異體字
( 'id' INTEGER PRIMARY KEY
, '字頭' TEXT 
, '異體字' TEXT NOT NULL
);''')

with open('yitizi.json') as f:
	d = json.load(f)
	for k, vs in d.items():
		for v in vs:
			cur.execute('INSERT INTO 異體字 VALUES (?, ?, ?)', (None, k, v))

cur.close()
conn.commit()
conn.execute('VACUUM')
conn.close()
