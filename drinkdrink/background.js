// 初始化提醒间隔
chrome.runtime.onInstalled.addListener(() => {
  // 请求通知权限
  chrome.notifications.getPermissionLevel((permissionLevel) => {
    if (permissionLevel !== 'granted') {
      console.log('需要通知权限');
    }
  });

  chrome.storage.local.get(['reminderInterval'], (result) => {
    const interval = result.reminderInterval || 30; // 默认30分钟
    createAlarm(interval);
  });
});

// 创建通知的通用函数
function createNotification() {
  const notificationOptions = {
    type: 'image',
    iconUrl: chrome.runtime.getURL('images/d389454751c724d361826721d6072d55.gif'),
    imageUrl: chrome.runtime.getURL('images/d389454751c724d361826721d6072d55.gif'),
    title: '💧 该喝水啦！',
    message: `现在就去喝一杯水吧！

💪 保持健康从每天喝足够的水开始~
🌊 喝水能让你精力充沛！`,
    requireInteraction: true,
    priority: 2,
    silent: false
  };

  chrome.notifications.create('drinkWaterNotification', notificationOptions, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('通知创建失败:', chrome.runtime.lastError);
    } else {
      console.log('通知已创建:', notificationId);
    }
  });
}

// 监听消息以更新提醒间隔
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'updateInterval') {
    createAlarm(message.interval);
  } else if (message.type === 'testNotification') {
    createNotification();
  }
});

// 创建定时器
function createAlarm(interval) {
  // 清除现有的定时器
  chrome.alarms.clear('drinkWaterReminder', () => {
    // 创建新的定时器
    chrome.alarms.create('drinkWaterReminder', {
      periodInMinutes: interval
    });
  });
}

// 监听定时器触发事件
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'drinkWaterReminder') {
    createNotification();
  }
});