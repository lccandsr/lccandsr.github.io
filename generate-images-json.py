#!/usr/bin/env python3
import os
import json

BASE_DIR = "/Users/bytedance/Documents/code/my-code/lccandsr.github.io/new-images"

result = {}
years = sorted([d for d in os.listdir(BASE_DIR) if d.isdigit()], key=int)

for year in years:
    year_dir = os.path.join(BASE_DIR, year)
    if not os.path.isdir(year_dir) or year == 'gallery':
        continue
    result[year] = {
        'spring': [],
        'summer': [],
        'autumn': [],
        'winter': []
    }
    seasons = ['spring', 'summer', 'autumn', 'winter']
    for season in seasons:
        season_dir = os.path.join(year_dir, season)
        if not os.path.exists(season_dir):
            continue
        # 获取所有图片文件
        images = []
        for f in os.listdir(season_dir):
            ext = os.path.splitext(f)[1].lower()
            if ext in ['.jpg', '.jpeg', '.png']:
                images.append(f)
        # 按数字排序
        images.sort(key=lambda x: int(os.path.splitext(x)[0]))
        result[year][season] = images

# 输出JSON
with open('/Users/bytedance/Documents/code/my-code/lccandsr.github.io/images.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

print(f"Generated images.json:")
for year in result:
    for season in result[year]:
        count = len(result[year][season])
        if count > 0:
            print(f"  {year}/{season}: {count} images")
