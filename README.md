# 1Campus Auto Read
自動已讀所有通知，可能可以在週會時救你一命

複製下面的代碼並新增瀏覽器書籤，名稱隨意，連結部分貼上代碼，使用時在 [1Campus 網頁版](https://1campus.net/) 打開書籤即可
```
javascript: (async () => { let accessToken = (await (await fetch("https://1campus.net/auth/getAccessToken", { method: "GET" })).json()).access_token; await fetch(`https://1campus-auto-read.netlify.app/.netlify/functions/handle-cors?access_token=${accessToken}`, { method: "GET" }); alert("已讀最近100則訊息！感謝你使用 1Campus Auto Read\n本功能由個人維護，請勿濫用\n\n代碼公開於 https://github.com/NightFeather0615/1campus-auto-read\n\n※此書籤僅供學術研究用途，不記錄任何個人資料"); }) ();
```