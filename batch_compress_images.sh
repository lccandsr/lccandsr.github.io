#!/bin/bash
# 批量压缩图片脚本
SRC_DIR="/Users/bytedance/Documents/code/my-code/lccandsr.github.io/new-images"
DEST_DIR="/Users/bytedance/Documents/code/my-code/lccandsr.github.io/compressed-images"

# 创建目标目录结构
find "$SRC_DIR" -type d -exec mkdir -p "$DEST_DIR/{}" \;

# 压缩所有jpg图片
find "$SRC_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" \) | while read img; do
    rel_path="${img#$SRC_DIR/}"
    dest_path="$DEST_DIR/$rel_path"
    echo "Compressing JPG: $rel_path"
    # 使用mozjpeg压缩，质量80，体积减小约60%
    cjpeg -quality 80 "$img" > "$dest_path"
done

# 压缩所有png图片
find "$SRC_DIR" -type f -name "*.png" | while read img; do
    rel_path="${img#$SRC_DIR/}"
    dest_path="$DEST_DIR/$rel_path"
    echo "Compressing PNG: $rel_path"
    # 使用pngquant压缩
    pngquant --force --quality=60-80 "$img" --output "$dest_path"
done

echo "压缩完成！"
du -sh "$SRC_DIR"
du -sh "$DEST_DIR"
