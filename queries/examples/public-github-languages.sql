-- GitHub Public Dataset - Most Popular Programming Languages
-- Shows programming language trends from GitHub public data
-- Works immediately - no setup required

SELECT 
  language,
  COUNT(*) as repository_count,
  AVG(size) as avg_repository_size_bytes,
  SUM(fork_count) as total_forks,
  SUM(stargazers_count) as total_stars
FROM `bigquery-public-data.github_repos.languages` l
JOIN `bigquery-public-data.github_repos.sample_repos` r
  ON l.repo_name = r.repo_name
WHERE language IS NOT NULL
  AND language != 'null'
GROUP BY language
HAVING repository_count >= 100  -- Filter for languages with decent usage
ORDER BY repository_count DESC
LIMIT 25
