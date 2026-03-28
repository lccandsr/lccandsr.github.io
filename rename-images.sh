#!/bin/bash
# 批量重命名图片为连续数字
BASE_DIR="/Users/bytedance/Documents/code/my-code/lccandsr.github.io/new-images"

# 全局计数器从1开始
counter=1

# 按年份排序处理
for year in 2024 2025 2026; do
  year_dir="$BASE_DIR/$year"
  if [ ! -d "$year_dir" ]; then
    continue
  fi
  # 按季节顺序处理
  for season in spring summer autumn winter; do
    season_dir="$year_dir/$season"
    if [ ! -d "$season_dir" ]; then
      continue
    fi
    echo "Processing $year/$season..."
    # 获取所有图片文件，按名称排序
    images=($(find "$season_dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | sort))
    for img in "${images[@]}"; do
      ext=$(echo "${img##*.}" | tr '[:upper:]' '[:lower:]')
      new_name="$counter.$ext"
      mv "$img" "$season_dir/$new_name"
      echo "  $img -> $new_name"
      ((counter++))
    done
  done
done

echo "Done! Total $((counter-1)) images renamed."
