// 同步第三方visitor计数到本地counter.json文件
// 使用方法: node sync-counter.js

const https = require('https');
const fs = require('fs');

const pageId = 'lccandsr.github.io.lovepage';
const url = `https://visitor-badge.laobi.icu/badge?page_id=${pageId}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    // SVG中的数字格式不一样，需要匹配transform里的数字内容
    const match = data.match(/textLength="\d+(\.\d+)?" transform="scale\(0\.1\)" x="\d+(\.\d+)?" y="140">(\d+)</);
    if (match) {
      const visitors = parseInt(match[3]);
      console.log('拉取到最新访问次数:', visitors);
      
      // 读取现有的counter.json
      let counter = { visitors: 0, loveCount: 0 };
      try {
        if (fs.existsSync('./counter.json')) {
          counter = JSON.parse(fs.readFileSync('./counter.json', 'utf8'));
        }
      } catch (e) {
        console.log('读取旧counter.json失败，创建新文件');
      }
      
      counter.visitors = visitors;
      fs.writeFileSync('./counter.json', JSON.stringify(counter, null, 2), 'utf8');
      console.log('✅ 已保存到本地counter.json:', counter);
    } else {
      console.error('❌ 无法从响应中提取数字，响应内容:', data);
    }
  });

  res.on('error', (err) => {
    console.error('❌ 请求失败:', err.message);
  });
});
