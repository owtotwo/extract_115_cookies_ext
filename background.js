// 115 browser extension by owtotwo
const cookie_has_changed = { UID: false, CID: false, SEID: false };

function is115Login(callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            if (res.state === true) {
                callback(true);
            }
        }
        callback(false);
    };
    xhr.open('GET', 'https://my.115.com/?ct=guide&ac=status', true);
    xhr.send();
}

function save115Cookies() {
    let cookiesString = '// Save by chromium-like browser extension\n';
    chrome.cookies.getAll({ url: 'https://115.com' }, (cookies) => {
        cookies.forEach((cookie) => {
            cookiesString += `${cookie.name}=${cookie.value};`
        });
        let textFileUrl = URL.createObjectURL( new Blob([cookiesString], {type: 'application/octet-binary'}) );
        chrome.downloads.download({
            url: textFileUrl,
            filename: '115.cookies',
            conflictAction: 'overwrite',
            saveAs: true
        }, function (downloadId) {
            console.log('download begin, the downId is: ' + downloadId);
        });
    });
}

chrome.cookies.onChanged.addListener((changeInfo) => {
    if (changeInfo.removed === false && changeInfo.cookie.domain === '.115.com') {
        const cookie = changeInfo.cookie;
        if ([ 'UID', 'CID', 'SEID' ].includes(cookie.name)) {
            console.log('[115ext][onChanged][need]', cookie.name);
            let data = null;
            if (cookie.name === 'UID') {
                data = { cookieUID: cookie.value };
                cookie_has_changed.UID = true;
            }
            else if (cookie.name === 'CID') {
                data = { cookieCID: cookie.value };
                cookie_has_changed.CID = true;
            }
            else if (cookie.name === 'SEID') {
                data = { cookieSEID: cookie.value };
                cookie_has_changed.SEID = true;
            }
            if (cookie_has_changed.UID && cookie_has_changed.CID && cookie_has_changed.SEID) {
                cookie_has_changed.UID = cookie_has_changed.CID = cookie_has_changed.SEID = false; // reset
                // Now Just Login
                is115Login((isLogin) => {
                    if (isLogin) {
                        console.log(`[115ext][onChanged] is 115 logined?`, isLogin);
                        save115Cookies();
                    }
                });
            }
        }
    }
});

chrome.contextMenus.create({
    title: 'Save 115 Cookies',
    visible: true,
    onclick: (info, tab) => {
        is115Login((isLogin) => {
            if (isLogin) {
                console.log(`[contextMenus] is 115 logined?`, isLogin);
                save115Cookies();
            }
        });
    },
    enabled: true,
    documentUrlPatterns: [
        'http://*.115.com/*',
        'https://*.115.com/*',
    ]
});
