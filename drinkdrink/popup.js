document.addEventListener('DOMContentLoaded', () => {
  const intervalInput = document.getElementById('interval');
  const saveButton = document.getElementById('save');
  const testButton = document.getElementById('test');
  const statusDiv = document.getElementById('status');

  // 加载保存的设置
  chrome.storage.local.get(['reminderInterval'], (result) => {
    if (result.reminderInterval) {
      intervalInput.value = result.reminderInterval;
    }
  });

  // 保存设置
  saveButton.addEventListener('click', () => {
    const interval = parseInt(intervalInput.value);
    if (interval < 1) {
      statusDiv.textContent = '请输入大于0的数字';
      return;
    }

    chrome.storage.local.set({ reminderInterval: interval }, () => {
      // 更新提醒间隔
      chrome.runtime.sendMessage({ type: 'updateInterval', interval: interval });
      statusDiv.textContent = '设置已保存';
      setTimeout(() => {
        statusDiv.textContent = '';
      }, 2000);
    });
  });

  // 测试提醒
  testButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'testNotification' });
    statusDiv.textContent = '已触发测试提醒';
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 2000);
  });
});