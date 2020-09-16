// 115 browser extension by owtotwo

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ cookieUID: null, cookieCID: null, cookieSEID: null }, () => {
        console.log('115 Cookies UID, CID, SEID are initialized to null.');
    });
});

const cookie_has_changed = { UID: false, CID: false, SEID: false };

function save115Cookies() {
    let cookiesString = '// Save by 115 extension\n';
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
        console.log('[115ext][onChanged]', changeInfo);
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
                save115Cookies();
            }
            chrome.storage.local.set(data, () => {
                console.log(`115 Cookies ${cookie.name} is set to ${cookie.value}.`);
            });
        }
    }
});

chrome.contextMenus.create({
    title: 'Save 115 Cookies',
    visible: true,
    onclick: (info, tab) => {
        console.log(`[contextMenus] info`, info);
        console.log(`[contextMenus] tab`, tab);
        save115Cookies();
    },
    enabled: true
});
