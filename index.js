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

MongoClient.connect('mongodb://ducks:penguins0@ds062818.mlab.com:62818/riordan-wiki', (err, client) => {
    if(err) console.log(err);
    console.log('Connected to Database!');
    db = client.db('riordan-wiki');
    db.collection('trivia').find().toArray((err, result) => {
        if(err) console.log(err);
        trivia = result[0];
    });
});

//FS-ImageMagick

const fs = require('fs');

const gm = require('gm').subClass({imageMagick: true});

//Discord

const Discord = require('discord.js');
const bot = new Discord.Client();
const token = require('./Confidential/token.json')

var rrguild;
var reactionChannel;
var welcomeChannel;
var generalChannel;
var memberCountChannel;

const yggdrasil = {emoji:'<:yggdrasil:506033543810383872>', roleID: '505809924995940362'};
const valhalla = {emoji:'<:valhalla:506044619335663616>', roleID: '505810603563155487'};
const underworld = {emoji:'<:underworld:506044619214290954>', roleID: '505811311784099851'};
const seaOfMonsters = {emoji:'<:seaofmonsters:506044619230937088>', roleID: '505810996367982592'}; 
const ogygia = {emoji:'<:ogygia:506044619210096640>', roleID: '505810872149475340'}; 
const midgard = {emoji:'<:midgard:506044619117559808>', roleID: '506055338013753344'}; 
const labyrinth = {emoji:'<:labyrinth:506044619079811092>', roleID: '505811117977632779'}; 
const huntersOfArtemis = {emoji:'<:huntersofartemis:506044618899456001>', roleID: '505810818181627925'}; 
const firstNome = {emoji:'<:firstnome:506044618454859806>', roleID: '505810781598777344'}; 
const duat = {emoji:'<:duat:506044618576756736>', roleID: '505811242431021067'}; 
const campJupiter = {emoji:'<:campjupiter:506044617985359883>', roleID: '505810742927163392'}; 
const campHalfBlood = {emoji:'<:camphalfblood:506044618446733331>', roleID: '505810699055005720'};
const scribe = {emoji: '<:scribe:510318792946089988>', roleID: '510317762485288988'}

const rrAccept = {emoji: '<:rr_accept:506063149028605962>', camperOrientationID: '505819119589785610'};
const rrDeny = {emoji: '<:rr_deny:506063149674397707>'};

function getEmojiID(emoji) {
    return emoji.slice(emoji.length - 19, emoji.length - 1);
}

bot.on('ready', async () => {
    console.log('Bot is ready');

    bot.user.setActivity('*help', 'PLAYING');

    rrguild = bot.guilds.get('505809707827724288');
    welcomeChannel = bot.channels.get('505809707827724292');

    var rrchannels = rrguild.channels.array();
    for(var i=0; i<rrchannels.length; i++) {
        if(rrchannels[i].type == 'text') {
            await rrchannels[i].fetchMessages({limit: 50});
            console.log(rrchannels[i].name);
        }
    }
    //console.log(rrguild.roles.array());

    reactionChannel = rrguild.channels.get('505810499632365579');

    generalChannel = rrguild.channels.get('505809707827724292');

    memberCountChannel = rrguild.channels.get('511963867698429962');
    memberCountChannel.setName('Member count: ' + rrguild.memberCount);
});

//Member-Joined

bot.on('guildMemberAdd', (member) => {
    memberCountChannel.setName('Member count: ' + rrguild.memberCount);
    member.addRole(rrAccept.camperOrientationID);

    gm('welcome-template.jpg')
    .gravity('center')
    .stroke('#FFFF95')
    .fill('#FFFF95')
    .pointSize(200)
    .font('./public/fonts/Windlass.ttf')
    .drawText(730, -80, member.user.username, 'center')
    .write('welcome-post.jpg', (err) => {
        if(err) throw err;

        welcomeChannel.send({files: [{
            attachment: 'welcome-post.jpg',
            name: 'welcome.jpg'
        }]})
        .then(message => {
            fs.unlink('welcome-post.jpg', (err) => {
                if(err) throw err;
            });
            welcomeChannel.send('Head over to <#505810499632365579> to gain access to the server!');
        })
        .catch(console.error);
    });
});

bot.on('guildMemberRemove', (member) => {
    welcomeChannel.send('Sorry to see you leaving ' + member.user.username);

    memberCountChannel.setName('Member count: ' + rrguild.memberCount);
});

//Reaction-Add

bot.on('messageReactionAdd', (messageReaction, user) => {
    var reactionMessage = messageReaction.message;
    if((reactionMessage.reactions.array().length >= 4) && (messageReaction.message.id != '506034904967151626'))  {
        messageReaction.remove(user);
    }

    if(messageReaction.message.id == '506034904967151626') {
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

    if(messageReaction.message.id == '506064055023173633') {
        if(messageReaction.emoji.id == getEmojiID(rrAccept.emoji)) {
            rrguild.members.get(user.id).removeRole(rrAccept.camperOrientationID);
            user.send(`Thanks for accepting the rules. You're now free to access the rest of the channels.`);
        }
        else if(messageReaction.emoji.id == getEmojiID(rrDeny.emoji)) {
            if(rrguild.members.get(user.id).kickable == true) {
                (async () => {
                    await user.send('You have been kicked for refusing to accept the rules.');
                    rrguild.members.get(user.id).kick('refused to accept rules');
                })();
            }
            else {
                user.send('A mod refusing to follow the rules? Hmm...');
            }
        }
    }
});

//Reaction-Remove

bot.on('messageReactionRemove', (messageReaction, user) => {
    if(messageReaction.message.id == '506034904967151626') {
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

    if(messageReaction.message.id == '506064055023173633') {
        if(messageReaction.emoji.id == getEmojiID(rrAccept.emoji)) {
            rrguild.members.get(user.id).addRole(rrAccept.camperOrientationID);
        }
    }
});

//Messages

bot.on('message', (message) => {
    if(message.content.startsWith('*')) {
        var command = message.content.slice(1, message.content.length);
    }
});

//Error

bot.on('error', console.error);

bot.login(token.value);