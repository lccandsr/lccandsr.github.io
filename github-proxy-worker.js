addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// 配置你的信息
const GITHUB_OWNER = 'lccandsr';
const GITHUB_REPO = 'lccandsr.github.io';
const GITHUB_TOKEN = '你的GitHub Token放在这里';

async function handleRequest(request) {
  // 允许跨域
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const filename = pathSegments[pathSegments.length - 1];

    // 获取文件信息
    const getResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filename}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    const fileData = await getResponse.json();
    const sha = fileData.sha;

    // 读取请求中的新内容
    const newContent = await request.text();
    const base64Content = btoa(unescape(encodeURIComponent(newContent)));

    // 更新文件
    const putResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filename}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `update ${filename} via love-page worker`,
          content: base64Content,
          sha: sha,
          branch: 'main'
        })
      }
    );

    const result = await putResponse.json();
    return new Response(JSON.stringify({ success: true, result }), { headers });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { 
      status: 500,
      headers 
    });
  }
}
