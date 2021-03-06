//Express-HTTP

const express = require('express');
const app = express();
app.use(express.static('public'));

var port = process.env.PORT||8080

app.listen(port, () => {
    console.log('Listening on Port ' + port);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/page.html');
});

var http = require('http');

setInterval(() => {
    http.get('http://riordanwikidiscord.herokuapp.com/');
}, 1000*60*5);

//MongoDB

const MongoClient = require('mongodb').MongoClient;
var db;
var trivia;

MongoClient.connect('mongodb://ducks:penguins0@ds062818.mlab.com:62818/riordan-wiki', {useNewUrlParser: true}, (err, client) => {
    if(err) console.log(err);
    else {
        console.log('Connected to Database!');
        db = client.db('riordan-wiki');
        db.collection('trivia').find().toArray((err, result) => {
            if(err) console.log(err);
            trivia = result[0];
        });
    }
    
});

//FS-ImageMagick

const fs = require('fs');

const gm = require('gm').subClass({imageMagick: true});

//Random-Name

var randomName = require('node-random-name');

//Discord-TERMINUS

const Discord = require('discord.js');
const bot = new Discord.Client();
const token = require('./Confidential/token.json')

var rrguild;
var auxguild;
var reactionChannel;
var welcomeChannel;
var generalChannel;
var memberCountChannel;
var wikiEditsChannel;
var discussionEditsChannel;

var triviaMessage;

const yggdrasil = {emoji:'<:yggdrasil:506033543810383872>', roleID: '418627055354380318'};
const valhalla = {emoji:'<:valhalla:506044619335663616>', roleID: '282686862550630402'};
const underworld = {emoji:'<:underworld:506044619214290954>', roleID: '289093372709437441'};
const seaOfMonsters = {emoji:'<:seaofmonsters:506044619230937088>', roleID: '441822798512521219'}; 
const ogygia = {emoji:'<:ogygia:506044619210096640>', roleID: '418624872449835009'}; 
const midgard = {emoji:'<:midgard:506044619117559808>', roleID: '297033988428660738'}; 
const labyrinth = {emoji:'<:labyrinth:506044619079811092>', roleID: '441825704800157697'}; 
const huntersOfArtemis = {emoji:'<:huntersofartemis:506044618899456001>', roleID: '363126685228466185'}; 
const firstNome = {emoji:'<:firstnome:506044618454859806>', roleID: '283804500731625477'}; 
const duat = {emoji:'<:duat:506044618576756736>', roleID: '418625609388916747'}; 
const campJupiter = {emoji:'<:campjupiter:506044617985359883>', roleID: '282686741503016960'}; 
const campHalfBlood = {emoji:'<:camphalfblood:506044618446733331>', roleID: '282686672968351744'};
const scribe = {emoji: '<:scribe:510318792946089988>', roleID: '365275746278834177'}

const rrAccept = {emoji: '<:rr_accept:506063149028605962>', camperOrientationID: '531903750315442186'};
const rrDeny = {emoji: '<:rr_deny:506063149674397707>'};

const tEmbedColor = 0x6D85A8;

function getEmojiID(emoji) {
    return emoji.slice(emoji.length - 19, emoji.length - 1);
}

// Upon bot startup

bot.on('ready', async () => {
    console.log('Bot is ready');

    //bot.user.setActivity('', 'PLAYING');

    rrguild = bot.guilds.get('282310567719469056');
    auxguild = bot.guilds.get('505809707827724288');
    welcomeChannel = bot.channels.get('431550384373366814'); //RR

    await rrguild.fetchMembers();
    var rrchannels = rrguild.channels.array();
    for(var i=0; i<rrchannels.length; i++) {
        if(rrchannels[i].type == 'text') {
            await rrchannels[i].fetchMessages({limit: 50});
            console.log(rrchannels[i].name + ' - ' + rrchannels[i].id);
        }
    }

    reactionChannel = rrguild.channels.get('505760915988414467'); //#rules

    generalChannel = rrguild.channels.get('505809707827724292'); //Aux

    //generalChannel.send('Guess the name of this character', );

    
});

//Member-Joined

bot.on('guildMemberAdd', (member) => {
    if(member.guild.id == rrguild.id) {
        member.addRole(rrAccept.camperOrientationID);

        gm('terminus-template.png')
        .gravity('center')
        .stroke('#000000')
        .fill('#000000')
        .pointSize(160)
        .font('Times-Roman')
        .drawText(0, 0, member.user.username + '#' + member.user.discriminator, 'center')
        .write('terminus.png', (err) => {
            if(err) throw err;

            welcomeChannel.send({files: [{
                attachment: 'terminus.png',
                name: 'terminus.png'
            }]})
            .then(message => {
                fs.unlink('terminus.png', (err) => {
                    if(err) throw err;
                });
                
                var d = new Date();
                if(((d.getTime() - member.user.createdAt.getTime())/(1000*60*60*24)) <= 14) {
                    welcomeChannel.send(`Hello <@${member.user.id}> and welcome to Rick Riordan Wiki's Official Discord server. We have detected you as a new user to Discord (less than a week old). Discord is a very versatile messaging app, and its versatility can make it complicated to newer users. To help you out, check out https://prittspadelord.github.io/RiordanWikiDiscord/ where we explain how to navigate through Discord and understand its basic terms.\n\nOnce you've read that, head over to <#505760915988414467> and follow ***all of the instructions*** on that page to gain access to the main channels.`);
                }
                else {
                    welcomeChannel.send(`Hello <@${member.user.id}> and welcome to Rick Riordan Wiki's Official Discord server. Head over to <#505760915988414467> and follow ***all of the instructions*** on that page to gain access to the main channels.`);
                }
            })
            .catch(console.error);
        });
    }
});

bot.on('guildMemberRemove', (member) => {
    if(member.guild.id == rrguild.id) {
        welcomeChannel.send('Sorry to see you leaving ' + member.user.username);
    }
});

//Reaction-Add

bot.on('messageReactionAdd', (messageReaction, user) => {
    if(user.bot) return;
    var reactionMessage = messageReaction.message;
    if((reactionMessage.reactions.array().length >= 6) && (messageReaction.message.id != '517751012858003488'))  {
        messageReaction.remove(user);
    }

    if(messageReaction.message.id == '517751012858003488') {
        if(messageReaction.emoji.id == getEmojiID(yggdrasil.emoji)) {
            rrguild.members.get(user.id).addRole(yggdrasil.roleID);
            user.send(`You joined **${rrguild.roles.get(yggdrasil.roleID).name}**`);            
        }
        else if(messageReaction.emoji.id == getEmojiID(valhalla.emoji)) {
            rrguild.members.get(user.id).addRole(valhalla.roleID); 
            user.send(`You joined **${rrguild.roles.get(valhalla.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(campHalfBlood.emoji)) {
            rrguild.members.get(user.id).addRole(campHalfBlood.roleID); 
            user.send(`You joined **${rrguild.roles.get(campHalfBlood.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(campJupiter.emoji)) {
            rrguild.members.get(user.id).addRole(campJupiter.roleID); 
            user.send(`You joined **${rrguild.roles.get(campJupiter.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(firstNome.emoji)) {
            rrguild.members.get(user.id).addRole(firstNome.roleID); 
            user.send(`You joined **${rrguild.roles.get(firstNome.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(midgard.emoji)) {
            rrguild.members.get(user.id).addRole(midgard.roleID); 
            user.send(`You joined **${rrguild.roles.get(midgard.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(ogygia.emoji)) {
            rrguild.members.get(user.id).addRole(ogygia.roleID); 
            user.send(`You joined **${rrguild.roles.get(ogygia.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(labyrinth.emoji)) {
            rrguild.members.get(user.id).addRole(labyrinth.roleID); 
            user.send(`You joined **${rrguild.roles.get(labyrinth.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(seaOfMonsters.emoji)) {
            rrguild.members.get(user.id).addRole(seaOfMonsters.roleID); 
            user.send(`You joined **${rrguild.roles.get(seaOfMonsters.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(duat.emoji)) {
            rrguild.members.get(user.id).addRole(duat.roleID); 
            user.send(`You joined **${rrguild.roles.get(duat.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(huntersOfArtemis.emoji)) {
            rrguild.members.get(user.id).addRole(huntersOfArtemis.roleID); 
            user.send(`You joined **${rrguild.roles.get(huntersOfArtemis.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(underworld.emoji)) {
            rrguild.members.get(user.id).addRole(underworld.roleID); 
            user.send(`You joined **${rrguild.roles.get(underworld.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(scribe.emoji)) {
            rrguild.members.get(user.id).addRole(scribe.roleID); 
            user.send(`You joined **${rrguild.roles.get(scribe.roleID).name}**`);           
        }
    }

    if(messageReaction.message.id == '517752158767284253') {
        if(messageReaction.emoji.id == getEmojiID(rrAccept.emoji)) {
            rrguild.members.get(user.id).removeRole(rrAccept.camperOrientationID);
            user.send(`Thanks for accepting the rules. You're now free to access the rest of the channels.`);
        }
        else if(messageReaction.emoji.id == getEmojiID(rrDeny.emoji)) {
            if(rrguild.members.get(user.id).hasPermissions('BAN_MEMBERS')) {
                user.send('A mod refusing to follow the rules? Hmm...');
            }
            else {
                (async () => {
                    await user.send('You have been kicked for refusing to accept the rules.');
                    rrguild.members.get(user.id).kick('refused to accept rules')
                    .then(() => {
                        console.log('done');
                    })
                    .catch(console.error);
                })();
            }
        }
    }
});

//Reaction-Remove

bot.on('messageReactionRemove', (messageReaction, user) => {
    if(messageReaction.message.id == '517751012858003488') {
        if(messageReaction.emoji.id == getEmojiID(yggdrasil.emoji)) {
            rrguild.members.get(user.id).removeRole(yggdrasil.roleID);
            user.send(`You left **${rrguild.roles.get(yggdrasil.roleID).name}**`);            
        }
        else if(messageReaction.emoji.id == getEmojiID(valhalla.emoji)) {
            rrguild.members.get(user.id).removeRole(valhalla.roleID); 
            user.send(`You left **${rrguild.roles.get(valhalla.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(campHalfBlood.emoji)) {
            rrguild.members.get(user.id).removeRole(campHalfBlood.roleID); 
            user.send(`You left **${rrguild.roles.get(campHalfBlood.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(campJupiter.emoji)) {
            rrguild.members.get(user.id).removeRole(campJupiter.roleID); 
            user.send(`You left **${rrguild.roles.get(campJupiter.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(firstNome.emoji)) {
            rrguild.members.get(user.id).removeRole(firstNome.roleID); 
            user.send(`You left **${rrguild.roles.get(firstNome.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(midgard.emoji)) {
            rrguild.members.get(user.id).removeRole(midgard.roleID); 
            user.send(`You left **${rrguild.roles.get(midgard.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(ogygia.emoji)) {
            rrguild.members.get(user.id).removeRole(ogygia.roleID); 
            user.send(`You left **${rrguild.roles.get(ogygia.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(labyrinth.emoji)) {
            rrguild.members.get(user.id).removeRole(labyrinth.roleID); 
            user.send(`You left **${rrguild.roles.get(labyrinth.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(seaOfMonsters.emoji)) {
            rrguild.members.get(user.id).removeRole(seaOfMonsters.roleID); 
            user.send(`You left **${rrguild.roles.get(seaOfMonsters.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(duat.emoji)) {
            rrguild.members.get(user.id).removeRole(duat.roleID); 
            user.send(`You left **${rrguild.roles.get(duat.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(huntersOfArtemis.emoji)) {
            rrguild.members.get(user.id).removeRole(huntersOfArtemis.roleID); 
            user.send(`You left **${rrguild.roles.get(huntersOfArtemis.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(underworld.emoji)) {
            rrguild.members.get(user.id).removeRole(underworld.roleID); 
            user.send(`You left **${rrguild.roles.get(underworld.roleID).name}**`);           
        }
        else if(messageReaction.emoji.id == getEmojiID(scribe.emoji)) {
            rrguild.members.get(user.id).removeRole(scribe.roleID); 
            user.send(`You left **${rrguild.roles.get(scribe.roleID).name}**`);           
        }
    }

    if(messageReaction.message.id == '517752158767284253') {
        if(messageReaction.emoji.id == getEmojiID(rrAccept.emoji)) {
            rrguild.members.get(user.id).addRole(rrAccept.camperOrientationID);
        }
    }
});

//Messages

bot.on('message', (message) => {
    if(message.content.startsWith('$')) {
        var command = message.content.slice(1, message.content.length);
        if(command.toLowerCase() == 'dionysus') {
            var name = randomName();
            while(!name.startsWith('Ab')) {
                name = randomName();
            }
            message.channel.send(name);
        }

        if(command == 'invite') {
            message.channel.send('https://discord.gg/nKJU53z');
        }

        if(command.startsWith('ban')) {
            if(command.endsWith('>')) {
                var banuserid = command.slice(command.length - 19, command.length - 1);
            }
            else {
                var banuserid = command.slice(command.length - 18, command.length);
            }
            var banmemb = rrguild.members.get(banuserid);
            var authmemb = rrguild.members.get(message.author.id);
            if(authmemb.hasPermissions('BAN_MEMBERS')) {
                if(banuserid == message.author.id) {
                    message.channel.send('I won\'t let you ban yourself.');
                }
                else {
                    if(banmemb != undefined) {
                        if(banmemb.hasPermissions('BAN_MEMBERS')) {
                            message.channel.send('What? Are you trying to ban another mod?');
                        }
                        else {
                            banmemb.ban()
                            .then(() => {
                                message.channel.send(`Successfully banned **${(banmemb.user.username + '#' + banmemb.user.discriminator) || banuserid}**`);
                            })
                            .catch(console.log('Error in banning this user'));
                        }
                    }
                    else {
                        message.channel.send('Couldn\'t find this user');
                    }
                }
            }
            else {
                message.channel.send('Nice try, you dont have the permissions to use this command.');
            }
        }

        if(command.startsWith('kick')) {
            if(command.endsWith('>')) {
                var kickuserid = command.slice(command.length - 19, command.length - 1);
            }
            else {
                var kickuserid = command.slice(command.length - 18, command.length);
            }
            var kickmemb = rrguild.members.get(banuserid);
            var authmemb = rrguild.members.get(message.author.id);
            if(authmemb.hasPermissions('KICK_MEMBERS')) {
                if(kickuserid == message.author.id) {
                    message.channel.send('I won\'t let you kick yourself.');
                }
                else {
                    if(kickmemb != undefined) {
                        if(kickmemb.hasPermissions('KICK_MEMBERS')) {
                            message.channel.send('What? Are you trying to kick another mod?');
                        }
                        else {
                            kickmemb.kick()
                            .then(() => {
                                message.channel.send(`Successfully kicked **${(kickmemb.user.username + '#' + kickmemb.user.discriminator) || kickuserid}**`);
                            })
                            .catch(console.log('Error in kicking this user'));
                        }
                    }
                    else {
                        message.channel.send('Couldn\'t find this user');
                    }
                }
            }
            else {
                message.channel.send('Nice try, you dont have the permissions to use this command.');
            }
        }

        if(command.startsWith('fop')) {
            if(command.endsWith('>')) {
                var fopuserid = command.slice(command.length - 19, command.length - 1);
            }
            else {
                var fopuserid = command.slice(command.length - 18, command.length);
            }
            var fopmemb = rrguild.members.get(fopuserid);
            var authmemb = rrguild.members.get(message.author.id);
            if(authmemb.hasPermissions('KICK_MEMBERS')) {
                if(fopuserid == message.author.id) {
                    message.channel.send('I won\'t let you punish youself ');
                }
                else {
                    if(fopmemb != undefined) {
                        if(fopmemb.hasPermissions('KICK_MEMBERS')) {
                            message.channel.send('What? Are you trying to punish another mod?');
                        }
                        else {
                            fopmemb.addRole('428965939816431636')
                            .then(message.channel.send(`Added role <@&428965939816431636> to **${fopmemb.user.username}#${fopmemb.user.discriminator}**`))
                            .catch(console.error);
                        }
                    }
                    else {
                        message.channel.send('Couldn\'t find this user');
                    }
                }
            }
            else {
                message.channel.send('Nice try, you dont have the permissions to use this command.');
            }
        }

        if(command.startsWith('tart')) {
            if(command.endsWith('>')) {
                var tartuserid = command.slice(command.length - 19, command.length - 1);
            }
            else {
                var tartuserid = command.slice(command.length - 18, command.length);
            }
            var tartmemb = rrguild.members.get(tartuserid);
            var authmemb = rrguild.members.get(message.author.id);
            if(authmemb.hasPermissions('KICK_MEMBERS')) {
                if(tartuserid == message.author.id) {
                    message.channel.send('I won\'t let you punish youself ');
                }
                else {
                    if(tartmemb != undefined) {
                        if(tartmemb.hasPermissions('KICK_MEMBERS')) {
                            message.channel.send('What? Are you trying to punish another mod?');
                        }
                        else {
                            tartmemb.addRole('339870334448697346')
                            .then(message.channel.send(`Added role <@&339870334448697346> to **${tartmemb.user.username}#${tartmemb.user.discriminator}**`))
                            .catch(console.error);
                        }
                    }
                    else {
                        message.channel.send('Couldn\'t find this user');
                    }
                }
            }
            else {
                message.channel.send('Nice try, you dont have the permissions to use this command.');
            }
        }
    }
});

//Error

bot.on('error', console.error);

bot.login('insert-terminus-token-here');

//Discord-IRIS

const bot1 = new Discord.Client();

var modChannel;
const left = '513288902803456021';
const right = '513288899016261632';

var pingdev = 0;
var pingn = 0;
var helpMessage = {
    id: null,
    order: 0,
    messeg: null,
    author: null,
    avatarURL: null
}

bot1.on('ready', () => {
    console.log('ready!');
    var statusNumber = 0;
    setInterval(() => {
        pingn += 1;
        pingdev += Math.abs(bot.ping - bot.pings[0]);

        if(statusNumber == 0) {
            statusNumber = 1;
            bot1.user.setActivity('Introducing Mod-mail', 'PLAYING');
        }
        else if(statusNumber == 1) {
            statusNumber = 2;
            bot1.user.setActivity('Message me for assistance', 'PLAYING');
        }
        else {
            statusNumber = 0;
            bot1.user.setActivity('Type i&help for more info', 'PLAYING');
        }
    }, 3500);
    modChannel = bot1.channels.get('431559357587783691');
});

bot1.on('messageReactionAdd', (messageReaction, user) => {
    if(user.bot) return;
    if(messageReaction.message.id == helpMessage.id) {
        if(messageReaction.emoji.id == right) {
            helpMessage.order++;
            messageReaction.message.delete();
            helpMessageSend[helpMessage.order](messageReaction.message);
        }
        if(messageReaction.emoji.id == left) {
            helpMessage.order--;
            messageReaction.message.delete();
            helpMessageSend[helpMessage.order](messageReaction.message);
        }
    }
});

bot1.on('message', (message) => {
    if(message.author.bot) return;
    if(!message.guild) {
        modChannel.send('<@&511562950104842240>', {embed: {
            color: 0xB218FF,
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            title: 'Iris message (Modmail)',
            description: message.content,
            timestamp: new Date(),
            footer: {
                text: 'User id: ' + message.author.id,
                icon_url: bot1.user.avatarURL
            }
        }})
        .then(() => {
            message.react('511793058665463853');
        })
        .catch(console.error);
    }
    else {
        if(message.content.startsWith('i&')) {
            var command = message.content.slice(2, message.content.length);
            if(command.startsWith('reply') && (message.channel.id == modChannel.id)) {
                var query = command.slice(6, command.length);
                var userId = query.slice(0, 18);
                var replyMessage = query.slice(19, query.length);
                if(!parseInt(userId)) {
                    message.channel.send({embed: {
                        color: 0xB218FF,
                        fields: [
                            {
                                name: 'Incorrect usage of i&reply',
                                value: 'Send a response to the user. Such messages are attributed with your name upon reaching the user.\n\nUsage: `i&reply [user-id] [content]`'
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: 'Requested by ' + message.author.username,
                            icon_url: message.author.avatarURL
                        }
                    }});
                }
                else {
                    bot1.users.get(userId).send({embed: {
                        color: 0xB218FF,
                        author: {
                            name: message.author.username,
                            icon_url: message.author.avatarURL
                        },
                        description: replyMessage,
                        timestamp: new Date(),
                        footer: {
                            text: 'from IrisBot',
                            icon_url: bot1.user.avatarURL
                        }
                    }})
                    .then(() => {
                        message.react('511793058665463853');
                    })
                    .catch((err) => {
                        modChannel.send('Oops, looks like that user has their DMs closed!');
                        console.log(err);
                    });
                }
            }

            else if(command.startsWith('anonreply') && (message.channel.id == modChannel.id)) {
                var query = command.slice(10, command.length);
                var auserId = query.slice(0, 18);
                var areplyMessage = query.slice(19, query.length);
                if(!parseInt(auserId)) {
                    message.channel.send({embed: {
                        color: 0xB218FF,
                        fields: [
                            {
                                name: 'Incorrect usage of i&anonreply',
                                value: 'Anonymously send a response to the user. Such messages are attributed as "Moderator" upon reaching the user.\n\nUsage: `i&anonreply [user-id] [content]`'
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: 'Requested by ' + message.author.username,
                            icon_url: message.author.avatarURL
                        }
                    }});
                }
                else {
                    bot1.users.get(auserId).send({embed: {
                        color: 0xB218FF,
                        author: {
                            name: 'Moderator',
                            icon_url: 'https://i.stack.imgur.com/FXEPv.jpg'
                        },
                        description: areplyMessage,
                        timestamp: new Date(),
                        footer: {
                            text: 'IrisBot',
                            icon_url: bot1.user.avatarURL
                        }
                    }})
                    .then(() => {
                        message.react('511793058665463853');
                    })
                    .catch((err) => {
                        modChannel.send('Oops, looks like that user has their DMs closed!');
                        console.log(err);
                    });
                }
            }

            else if(command == 'help') {
                if(message.channel.id == modChannel.id) {
                    message.channel.send({embed: {
                        color: 0xB218FF,
                        description: 'Iris bot is a bot where members of our server can reach out to the moderation team. The messages sent by our members in the server through the bot\'s DMs will be echoed here. You can respond to them in two ways:',
                        fields: [
                            {
                                name: 'Directly',
                                value: 'Use the command `i&reply [user-id] [message-content]` to respond to the user directly. The user-id will be provided under the Iris message sent by the user. These messages will be attributed to your name.\n\n***Do not send a message to a user who hasn\'t contacted Iris before, as it would breach ToS.***'
                            },
                            {
                                name: 'Anonymously',
                                value: 'If you dont wish to reveal yourself, or rather give a generic "moderator" answer, you may use `i&anonreply [user-id] [message-content]`. These messages will be attributed to an anonymous person.'
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: 'Requested by ' + message.author.username,
                            icon_url: message.author.avatarURL
                        }
                    }});
                }
                else {
                    helpMessage.author = message.author.username;
                    helpMessage.avatarURL = message.author.avatarURL;
                    helpMessageSend[1](message);
                }
            }

            else if(command == 'ping') {             
                message.channel.send({embed: {
                    color: 0xB218FF,
                    description: `Recent response time: ${Math.round(100*bot1.pings[0])/100}ms\nAverage response time: ${Math.round(100*bot.ping)/100}ms\nMean deviation: ${Math.round(100*(pingdev/(pingn * bot.ping)))/100}ms`
                }});
            }
        }
    }
});

bot1.on('error', console.error);

bot1.login('insert-iris-token-here');

//Function

var helpMessageSend = ['dum', helpMessage1, helpMessage2]

function helpMessage1(messeg) {
    messeg.channel.send({embed: {
        color: 0xB218FF,
        description: 'Iris helps you to reach out to the entire moderation team privately. To do so, simply DM the bot with whatever your concerns are and they will be relayed to the moderation team. You will receive your responses within the bot DMs itself.\n\nThere are some guidelines we require you to follow:',
        fields: [
            {
                name: 'Open up your DMs',
                value: 'If your DMs are closed, the bot cannot respond to you. Open up your DMs by going to settings and allowing DMs from server members.'
            },
            {
                name: 'Ask actual questions',
                value: 'Saying "hi" is not a question. Pretty obvious right? So dont do it. Make sure you only ask questions to the bot. Failing to comply with this may lead to mute/kick/ban.'
            },
            {
                name: 'Respect privacy',
                value: 'Sometimes, a mod may send an anonymous message without revealing who they are. Do not press them to reveal them. Value their anonymity as much as you value yours.'
            },
            {
                name: 'Use common sense',
                value: 'Not every guideline can be documented. If you lack this trait, dont feel too bad, it boils down to this: If you do something stupid and a mod points it out, you stop doing it. Simple.'
            },
            {
                name: '<:blank:513311459267051531>',
                value: '<:blank:513311459267051531>',
                inline: true
            },
            {
                name: 'Next page',
                value: '<a:iris_right:' + right + '>',
                inline: true
            }
        ],
        timestamp: new Date(),
        footer: {
            text: 'Requested by ' + helpMessage.author,
            icon_url: helpMessage.avatarURL
        }
    }})
    .then(msg => {
        msg.react(right);
        helpMessage.id = msg.id;
        helpMessage.order = 1;
        helpMessage.messeg = messeg;
    })
    .catch(console.error);
}

function helpMessage2(messeg) {
    messeg.channel.send({embed: {
        color: 0xB218FF,
        description: 'Here\'s an example of what you would do when you needed to use Iris:',
        fields: [
            {
                name: 'Go to the DMs of the bot',
                value: 'This can be achieved by right-clicking/long-pressing the bot\'s name on the screen and opening "Message"'
            },
            {
                name: 'Get straight to the point' ,
                value: 'Dont start with anything like "hi" or any greetings. Get straight to what you want help with. Minimise the number of individual messages you send.'
            },
            {
                name: 'Wait patiently',
                value: 'Once you send a message, the bot will react with <:iris:511793058665463853> on your message. This ensures that your message has been successfully relayed to the mod team. Now, all you have to do is wait patiently. Do not send more messages asking "hey, why havent you replied yet?" or such.'
            },
            {
                name: 'Previous page',
                value: '<a:iris_left:' + left + '>',
                inline: true
            },
            {
                name: '<:blank:513311459267051531>',
                value: '<:blank:513311459267051531>',
                inline: true
            }
        ],
        timestamp: new Date(),
        footer: {
            text: 'Requested by ' + helpMessage.author,
            icon_url: helpMessage.avatarURL
        }
    }})
    .then(msg => {
        msg.react(left);
        helpMessage.id = msg.id;
        helpMessage.order = 2;
        helpMessage.messeg = messeg;
    })
    .catch(console.error);
}