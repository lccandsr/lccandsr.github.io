#!/bin/bash
SRC_DIR="/Users/bytedance/Documents/code/my-code/lccandsr.github.io/new-images"
DEST_DIR="/Users/bytedance/Documents/code/my-code/lccandsr.github.io/compressed-images"

# 处理那些压缩失败的文件，使用mac自带的sips重新导出
find "$SRC_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" \) | while read img; do
    rel_path="${img#$SRC_DIR/}"
    dest_path="$DEST_DIR/$rel_path"
    if [ ! -s "$dest_path" ] || [ $(stat -f%z "$dest_path") -lt 100 ]; then
        echo "Copying (re-encode with sips): $rel_path"
        mkdir -p "$(dirname "$dest_path")"
        sips -s format jpeg -s formatOptions 80 "$img" --out "$dest_path" > /dev/null 2>&1
        if [ ! -s "$dest_path" ]; then
            echo "  sips failed, copying original"
            cp "$img" "$dest_path"
        fi
    fi
done

# 处理pngquant失败的文件，重新用sips压缩
find "$SRC_DIR" -type f -name "*.png" | while read img; do
    rel_path="${img#$SRC_DIR/}"
    dest_path="$DEST_DIR/$rel_path"
    if [ ! -s "$dest_path" ] || [ $(stat -f%z "$dest_path") -lt 100 ]; then
        echo "Processing PNG with sips: $rel_path"
        mkdir -p "$(dirname "$dest_path")"
        sips -s format png -s formatOptions 60 "$img" --out "$dest_path" > /dev/null 2>&1
        if [ ! -s "$dest_path" ]; then
            echo "  sips failed, copying original"
            cp "$img" "$dest_path"
        fi
    fi
done

echo "修复完成！"
du -sh "$DEST_DIR"
