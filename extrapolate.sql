SELECT
CASE 原字頭 = 異體字頭 WHEN true THEN '' ELSE 原字頭 END AS 原字頭,
異體字頭, 攝 || 開合 || 等漢字 || 韻賅上去入 AS 音韻, 聲, 母,
-- 出現次數,
粵語音, 解釋
FROM (
	SELECT *, 字頭 AS 原字頭, ifnull(異體字, 字頭) AS 異體字頭
	FROM (
		SELECT * FROM 廣韻字頭全
		INNER JOIN (SELECT 字頭, count(*) AS 出現次數 FROM 廣韻字頭 GROUP BY 字頭)
		USING (字頭)
	)
	LEFT JOIN (
		SELECT 字頭, 字頭 AS 異體字 FROM 異體字 GROUP BY 字頭
		UNION SELECT 字頭, 異體字 FROM 異體字
	)
	USING (字頭)
) AS 中古音
INNER JOIN 粵語音
ON 中古音.異體字頭 = 粵語音.字頭
WHERE 出現次數 = 1
ORDER BY 攝號, 開合, 等, 韻賅上去入, 母號, 小韻號;
