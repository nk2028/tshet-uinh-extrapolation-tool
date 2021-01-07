SELECT
CASE 原字頭 = 異體字頭 WHEN true THEN '' ELSE 原字頭 END AS 原字頭,
異體字頭, 攝 || ifnull(呼, '') || 等 || ifnull(重紐, '') || 韻 AS 音韻, 聲, 母,
-- 出現次數,
現代讀音, 解釋
FROM (
	SELECT *, 字頭 AS 原字頭, ifnull(新字體, 字頭) AS 異體字頭
	FROM (
		SELECT * FROM 字頭全
		INNER JOIN (SELECT 字頭, count(*) AS 出現次數 FROM 字頭 GROUP BY 字頭)
		USING (字頭)
	)
	LEFT JOIN (
		SELECT 字頭, 字頭 AS 新字體 FROM 新字體 GROUP BY 字頭
		UNION SELECT 字頭, 新字體 FROM 新字體
	)
	USING (字頭)
) AS 中古音
INNER JOIN 日語漢音
ON 中古音.異體字頭 = 日語漢音.字頭
WHERE 出現次數 = 1
ORDER BY 攝號, 等, 呼 DESC, 韻號, 母號, 重紐, 小韻號;
