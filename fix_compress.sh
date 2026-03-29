#!/bin/bash
SRC_DIR="/Users/bytedance/Documents/code/my-code/lccandsr.github.io/new-images"
DEST_DIR="/Users/bytedance/Documents/code/my-code/lccandsr.github.io/compressed-images"

# 处理那些cjpeg失败的jpg文件（可能已经是渐进式或其他格式），用ImageMagick转换
find "$SRC_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" \) | while read img; do
    rel_path="${img#$SRC_DIR/}"
    dest_path="$DEST_DIR/$rel_path"
    if [ ! -s "$dest_path" ] || [ $(stat -f%z "$dest_path") -lt 100 ]; then
        echo "Fixing (re-encode): $rel_path"
        convert "$img" -quality 80 "$dest_path"
    fi
done

# 处理pngquant失败的文件（实际不是PNG格式），直接复制原文件
find "$SRC_DIR" -type f -name "*.png" | while read img; do
    rel_path="${img#$SRC_DIR/}"
    dest_path="$DEST_DIR/$rel_path"
    if [ ! -s "$dest_path" ] || [ $(stat -f%z "$dest_path") -lt 100 ]; then
        echo "Copying original for: $rel_path"
        cp "$img" "$dest_path"
    fi
done

echo "修复完成！"
du -sh "$DEST_DIR"
