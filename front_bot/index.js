// require('dotenv').config();
// const { Bot, session, InlineKeyboard } = require('grammy');
// const { conversations, createConversation } = require('@grammyjs/conversations');

// const BACKEND_ROOT_URL = "http://localhost:3000";
// let coinPrice = 0;

// // Create the bot
// const bot = new Bot(process.env.BOT_API_KEY);

// // Middleware for session and conversations
// bot.use(session({ initial: () => ({}) }));
// bot.use(conversations());

// bot.api.setMyCommands([
//     { command: 'start', description: 'Starts the bot' },
//     { command: 'hello', description: 'Says hello' },
//     { command: 'help', description: 'What I can do for you' },
//     { command: 'search_coin', description: 'Find a coin' },
// ]);

// // Functions to fetch data
// const getTasks = async () => {
//     const response = await fetch(`${BACKEND_ROOT_URL}/get`);
//     const json = await response.json();
//     read(json);
//     return json;
// };

// const getList = async () => {
//     const response = await fetch(`${BACKEND_ROOT_URL}/getlist`);
//     const json = await response.json();
//     return json;
// };

// const getCoin = async (coinName) => {
//     const response = await fetch(`${BACKEND_ROOT_URL}/getbyname/${coinName}`);
//     const json = await response.json();
//     return json;
// };

// const read = (json) => {
//     if (json.bitcoin && json.bitcoin.usd) {
//         coinPrice = json.bitcoin.usd;
//     } else {
//         console.error("Invalid data from API");
//     }
// };

// // Conversation function
// async function searchCoinConversation(conversation, ctx) {
//     await ctx.reply('Please, enter the name of the coin you are searching for:');
//     const { message } = await conversation.wait();
//     const userInput = message.text.toLowerCase();

//     let coinNames = await getCoin(userInput);
//     coinNames = coinNames.coins.map(item => item.name)

//     if (coinNames.length > 0) {
//         await ctx.reply(`Coins found:\n${coinNames.join('\n')}`);
//     } else{
//         await ctx.reply('No matching coins found.');
//     }
// }

// // Register the conversation
// bot.use(createConversation(searchCoinConversation));

// // Command handlers
// bot.command('start', async (ctx) => {
//     coinPrice = 0;
//     await getTasks();
//     await ctx.reply(coinPrice.toString());
// });

// bot.command('search_coin', async (ctx) => {
//     await ctx.conversation.enter('searchCoinConversation');
// });

// bot.command('hello', async (ctx) => {
//     await ctx.reply("Hi there!");
// });

// bot.command('help', async (ctx) => {
//     await ctx.reply(
//         "<b>This is bold text</b> and <i>this is italic</i> and this is a <a href='https://youtube.com'>link</a>",
//         { parse_mode: "HTML" }
//     );
// });

// // Error handling
// bot.catch((err) => {
//     const ctx = err.ctx;
//     console.error(`Error while handling update ${ctx.update.update_id}:`);
//     const e = err.error;
//     if (e instanceof GrammyError) {
//       console.error("Error in request:", e.description);
//     } else if (e instanceof HttpError) {
//       console.error("Could not contact Telegram:", e);
//     } else {
//       console.error("Unknown error:", e);
//     }
//   });

// bot.start();


require('dotenv').config();
const { Bot, session, InlineKeyboard , HttpError, GrammyError } = require('grammy');
const { conversations, createConversation } = require('@grammyjs/conversations');

const BACKEND_ROOT_URL = "http://localhost:3000";
let coinPrice = 0;

// Create the bot
const bot = new Bot(process.env.BOT_API_KEY);

// Middleware for session and conversations
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

bot.api.setMyCommands([
    { command: 'start', description: 'Starts the bot' },
    { command: 'hello', description: 'Says hello' },
    { command: 'help', description: 'What I can do for you' },
    { command: 'search_coin', description: 'Find a coin' },
]);

// Functions to fetch data
const getTasks = async () => {
    const response = await fetch(`${BACKEND_ROOT_URL}/get`);
    const json = await response.json();
    read(json);
    return json;
};

const getList = async () => {
    const response = await fetch(`${BACKEND_ROOT_URL}/getlist`);
    const json = await response.json();
    return json;
};

const getCoinData = async (coinId) => {
    const response = await fetch(`${BACKEND_ROOT_URL}/getcoindata/${coinId}`);
    const json = await response.json();
    const coinObj = {
        name: json.name,
        descript: json.description.en,
        link: json.links.homepage[0],
        img: json.image.large,
        mcrank: json.market_cap_rank,
        currentPrice: json.market_data.current_price.usd,
        mcprice: json.market_data.market_cap.usd,
        high: json.market_data.high_24h.usd,
        low: json.market_data.low_24h.usd,
    }
    console.log(coinObj)
    return coinObj;
};

const searchCoin = async (coinName) => {
    const response = await fetch(`${BACKEND_ROOT_URL}/getbyname/${coinName}`);
    const json = await response.json();
    return json;
};

const read = (json) => {
    if (json.bitcoin && json.bitcoin.usd) {
        coinPrice = json.bitcoin.usd;
    } else {
        console.error("Invalid data from API");
    }
};

// Helper function to generate inline keyboard buttons for coins
const generateCoinKeyboard = (coins) => {
    const keyboard = new InlineKeyboard();
    coins.forEach(coin => {
        keyboard.text(coin.name, `info_${coin.name}`).row();  // Button with the coin name, `info_coin` as callback data
    });
    return keyboard;
};

// Conversation function for searching coins
async function searchCoinConversation(conversation, ctx) {
    await ctx.reply('Please, enter the name of the coin you are searching for:');
    const { message } = await conversation.wait();
    const userInput = message.text.toLowerCase();

    let coinNames = await searchCoin(userInput);
    coinNames = coinNames.coins

    if (coinNames.length > 0) {
        const keyboard = generateCoinKeyboard(coinNames);  // Generate inline keyboard
        await ctx.reply(`Coins found:`, { reply_markup: keyboard });
    } else {
        await ctx.reply('No matching coins found.');
    }
}

// Register the conversation
bot.use(createConversation(searchCoinConversation));

// Command handlers
bot.command('start', async (ctx) => {
    coinPrice = 0;
    await getTasks();
    await ctx.reply(coinPrice.toString());
});

bot.command('search_coin', async (ctx) => {
    await ctx.conversation.enter('searchCoinConversation');
});

bot.command('hello, hi', async (ctx) => {
    await ctx.reply("Hi there!");
});

bot.command('help', async (ctx) => {
    await ctx.reply(
        "<b>This is bold text</b> and <i>this is italic</i> and this is a <a href='https://youtube.com'>link</a>",
        { parse_mode: "HTML" }
    );
});

bot.on('message', async (ctx) => {
    await ctx.reply("I don't yet know how to reply to your message :(\n\nYou can check help desk for available commands: /help", 
        { parse_mode: "HTML" 
    });
})

// Handle callback query when a user clicks on a coin button
bot.on('callback_query:data', async (ctx) => {
    const data = ctx.callbackQuery.data;
    

    // If the callback data starts with 'info_', it means a coin was selected
    if (data.startsWith('info_')) {
        const coinName = data.split('info_')[1];
        const coinList = await getList()

        const coinNeeded = coinList.filter((coin) => {
            if(coin.name == coinName){
                return coin
            }
        })

        const coinInfo = await getCoinData(coinNeeded[0].id);  // Fetch coin info from your backend
        
        if(coinInfo.mcrank == null) coinInfo.mcrank = "No data for the coin"
        if(coinInfo.descript.length > 1000) coinInfo.descript = coinInfo.descript.slice(0, 500) + "...";
        // Reply with coin information
        await ctx.answerCallbackQuery();  // Answer callback query to avoid loading spinner
        
        await ctx.replyWithPhoto(coinInfo.img, { caption: `
🌐 ${coinName}:

📃 <i><b>Description:</b></i> ${coinInfo.descript}

📱 <i><b>Web-site:</b></i>${coinInfo.link}
            
🏆 <i><b>Market cap world rank:</b></i> ${coinInfo.mcrank}

💲 <i><b>Market cap in fiat:</b></i> $${coinInfo.mcprice}

💵 <i><b>Current price:</b></i> $${coinInfo.currentPrice}

📈 <i><b>Highest price in 24 hours:</b></i> $${coinInfo.high}

📉 <i><b>Lowest price in 24 hours:</b></i> $${coinInfo.low}

<a href='t.me/crypt_bro_bot'>Crypto bro's link for your friend</a>
    `, parse_mode: "HTML"});
    }
});

// Error handling
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

bot.start();
