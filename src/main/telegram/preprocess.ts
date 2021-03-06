import TelegramBot from 'node-telegram-bot-api';
/**
* Only reply to private IM or group message that tag the bot
* @param {TelegramBot.Message} msg
* @return user context
*/
export default (msg: TelegramBot.Message): dawn.Context => {
    let id = msg.from && msg.from.id ? msg.from.id : '';
    let context: dawn.Context = {
        platform: 'telegram',
        id: id.toString(),
        locale: 'eng',
        name: {}
    };
    if (msg.message_id) {
        context.chat = {
            message_id: msg.message_id,
            chat_id: msg.chat.id,
        }
    }
    if (msg.from) {
        context.name = {}
        context.name.first = msg.from.first_name;
        if (msg.from.last_name) {
            context.name.last = msg.from.last_name;
        }
    }

    if (msg.location) {
        context.location = {}
        context.location.lat = msg.location.latitude;
        context.location.long = msg.location.longitude;
    }
    if (msg.text) {
        context.text = msg.text;
    }
    if (msg.audio) {
        context.document = {}
        context.document.type = 'audio';
        context.document.value = msg.audio.duration;
    }
    if (msg.video) {
        context.document = {}
        context.document.type = 'video';
        context.document.value = msg.video.duration;
    }
    if (msg.photo) {
        context.document = {}
        context.document.type = 'image';
        context.document.value = msg.photo[0].file_id;
    }
    return context;
};
