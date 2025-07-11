const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const usernames = ['pagol', 'manoshik', 'mata_nosto'];
const botCount = usernames.length;
const bots = [];

function createBot(index) {
  const bot = mineflayer.createBot({
    host: process.env.SERVER_IP || 'localhost',
    port: parseInt(process.env.SERVER_PORT) || 25565,
    username: usernames[index]
  });

  let movingForward = true;

  bot.once('spawn', () => {
    console.log(`✅ ${bot.username} spawned`);
    bot.chat("im back");

    setInterval(() => {
      if (!bot.entity || !bot.entity.position) return;

      // Removed: bot.chat("i wanna run away");
      bot.setControlState('forward', true);

      setTimeout(() => {
        bot.setControlState('forward', false);
        movingForward = !movingForward;
        bot.look(bot.entity.yaw + Math.PI, 0, true);
      }, 2000);
    }, 60000);
  });

  bot.on('end', () => {
    console.log(`❌ ${bot.username} disconnected. Reconnecting...`);
    setTimeout(() => {
      bots[index] = createBot(index);
    }, 10000);
  });

  bot.on('error', (err) => {
    console.log(`⚠️ ${bot.username} error: ${err.message}`);
  });

  return bot;
}

for (let i = 0; i < botCount; i++) {
  bots.push(createBot(i));
}

app.get('/', (req, res) => {
  res.send(`🟢 Bots online: ${bots.map(bot => bot.username).join(', ')}`);
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(port, () => {
  console.log(`🌐 Web server running at http://localhost:${port}`);
});
