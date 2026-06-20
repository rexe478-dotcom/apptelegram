import dotenv from 'dotenv';

// Load environmental parameters from local override file
dotenv.config({ path: '.env.local' });
dotenv.config(); // Fallback to standard .env

const token = process.env.TELEGRAM_BOT_TOKEN;
const appUrl = process.env.APP_URL;

if (!token) {
  console.error('\x1b[31m[SYS_ERROR] TELEGRAM_BOT_TOKEN IS MISSING IN .env.local!\x1b[0m');
  console.log('Please configure your .env.local file with:');
  console.log('TELEGRAM_BOT_TOKEN="your_bot_token"');
  console.log('APP_URL="your_mini_app_https_url"');
  process.exit(1);
}

if (!appUrl) {
  console.warn('\x1b[33m[SYS_WARN] APP_URL IS NOT SPECIFIED. DEFAULTING TO LOCALHOST FOR WEB_APP ENVELOPE.\x1b[0m');
}

const botUrl = `https://api.telegram.org/bot${token}`;

async function apiCall(method: string, body: object = {}) {
  try {
    const res = await fetch(`${botUrl}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    console.error(`[SYS_BOT] API call error (${method}):`, err);
    return { ok: false, error: err };
  }
}

async function startBot() {
  console.log('\x1b[32m[SYS_BOT] CONNECTING CORE TRANSCEIVER...\x1b[0m');
  
  const botInfo = await apiCall('getMe');
  if (!botInfo.ok) {
    console.error('\x1b[31m[SYS_ERROR] BOT TOKEN IS INVALID OR CANNOT CONNECT TO TELEGRAM!\x1b[0m');
    console.error('Details:', botInfo);
    process.exit(1);
  }

  const botUser = botInfo.result;
  console.log(`\x1b[32m[SYS_BOT] Bot Node Synced: @${botUser.username} (${botUser.first_name})\x1b[0m`);
  console.log(`\x1b[32m[SYS_BOT] Target Mini App URL: ${appUrl || 'http://localhost:3000/'}\x1b[0m`);

  // Dynamically set the Menu Button globally for all users using the configured URL
  const appTargetUrl = appUrl || 'http://localhost:3000/';
  const menuButtonRes = await apiCall('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: '🎮 Play Streak',
      web_app: { url: appTargetUrl }
    }
  });
  if (menuButtonRes.ok) {
    console.log('\x1b[32m[SYS_BOT] Global Menu Button updated dynamically to: ' + appTargetUrl + '\x1b[0m');
  } else {
    console.warn('\x1b[33m[SYS_BOT] Failed to update Global Menu Button:', menuButtonRes, '\x1b[0m');
  }
  console.log('\x1b[35m[SYS_BOT] LISTENING FOR TELEGRAM GRID PULSES... (Long Polling)\x1b[0m');

  let offset = 0;

  while (true) {
    try {
      const updatesRes = await fetch(`${botUrl}/getUpdates?offset=${offset}&timeout=30`);
      const updates = await updatesRes.json();

      if (updates.ok && updates.result.length > 0) {
        for (const update of updates.result) {
          offset = update.update_id + 1;

          if (update.message) {
            const chatId = update.message.chat.id;
            const text = update.message.text || '';
            const user = update.message.from;

            console.log(`[GRID_PULSE] MSG from @${user.username || user.first_name}: "${text}"`);

            if (text.startsWith('/start')) {
              const appTargetUrl = appUrl || 'http://localhost:3000/';
              
              const welcomeMessage = 
                `⚡️ STREAK TERMINAL SECURED ⚡️\n\n` +
                `Welcome, Operator. Sync your profile node, maintain your daily activity matrix, and claim reactor energy to scale the leaderboards.\n\n` +
                `Click below to run the app in Telegram:`;

              await apiCall('sendMessage', {
                chat_id: chatId,
                text: welcomeMessage,
                parse_mode: 'HTML',
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: '🎮 OPEN STREAK APP',
                        web_app: { url: appTargetUrl }
                      }
                    ]
                  ]
                }
              });
              console.log(`[SYS_BOT] Injected menu keyboard to Chat ID: ${chatId}`);
            }
          }
        }
      }
    } catch (e) {
      console.error('[SYS_BOT] Network connection error on long-poll. Retrying in 5 seconds...', e);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

startBot();
