var zhejiangPM2_5URL = "http://app.zjepb.gov.cn:8080/wasdemo/search?channelid=168113";
var cityInZhejiangMap = {};
cityInZhejiangMap['hangzhou'] = '杭州';
cityInZhejiangMap['ningbo'] = '杭州';
cityInZhejiangMap['huzhou'] = '杭州';
cityInZhejiangMap['jiaxing'] = '嘉兴';
cityInZhejiangMap['shaoxing'] = '绍兴';
cityInZhejiangMap['jinhua'] = '金华';
cityInZhejiangMap['quzhou'] = '衢州';
cityInZhejiangMap['zhoushan'] = '舟山';
cityInZhejiangMap['taizhou'] = '台州';
cityInZhejiangMap['lishui'] = '丽水';

function extractDataFromZhejiang(rawHTML, city_zh_CN) {
  var re = new RegExp("<th>" + city_zh_CN + "<\\/th>[^<]*<td>[^<0-9]*([0-9]*\\.?[0-9]+)[^<0-9]*<\\/td>", "m");
  try {
    var regExpResult = re.exec(rawHTML);
    var pm2_5 = Math.round(regExpResult[1]).toString();
    console.info(city_zh_CN, pm2_5);
    chrome.browserAction.setBadgeText({text: pm2_5});
  } catch(err) {
    console.error(err);
  }
}

function loadZhejiangData(city_zh_CN) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", zhejiangPM2_5URL, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var responseText = xhr.responseText;
      extractDataFromZhejiang(responseText, city_zh_CN);
    }
  }
  xhr.send();
}

function getCity() {
  chrome.storage.sync.get('city', function(items) {
    if (items.city) {
        if (cityInZhejiangMap[items.city]) {
            var city_zh_CN = cityInZhejiangMap[items.city];
            loadZhejiangData(city_zh_CN);
        }
    } else {
        console.warn('City is not been specified.');
    }
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
    getCity();
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == 'pm2_5') {
    getCity();
  }
});

chrome.alarms.create('pm2_5', {
  when: Date.now(),
  periodInMinutes: 30
});
