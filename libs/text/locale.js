const axios = require("axios");
const auth = require("../auth.js");
const discord = require("discord.js");
const users = require("../data/users.js");

const weatherURL = "http://api.weatherbit.io/v2.0/current?key=";

function options(timezone) {
    return {
        "timeZone": timezone,
        "hour12": true,
        "weekday": "long",
        "hour": "2-digit",
        "minute": "2-digit"
    };
}

function weatherEmbed(res,city,tz) {
    let data = res.data.data[0];
    let embed = new discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle(":flag_"+data.country_code.toLowerCase()+": "+(city||data.city_name))
    .setURL("https://www.weatherbit.io/")
    .setThumbnail("https://www.weatherbit.io/static/img/icons/"+data.weather.icon+".png")
    .addField(data.temp+" °C\t**||**\t"+CtoF(data.temp)+" °F" ,data.weather.description+"\nHumidity: "+data.rh+"%\nWind: "+data.wind_cdir+" - "+(Math.round(data.wind_spd*3.6*10)/10)+"km/h ");
    if(city) {
        embed.setAuthor((new Date).toLocaleString("en-GB", options(tz)));
    }
    return embed;
}

function CtoF(int) {
    return (Math.round(((int*(9/5))+32)*10)/10);
}

module.exports.time = function(msg) {
    let newMessage = ">>> ";
    let userIDs = [...msg.mentions.users.keys()];
    let today = new Date();
    if(userIDs.length==0) {
        for(let i in users.main) {
            let flag = users.main[i][0]+"  ";
            let time = today.toLocaleString("en-GB", options(users.main[i][1]))+"\n";
            newMessage += flag+time;
        }
    } else {
        for(let i in userIDs) {
            if(!users.find[userIDs[i]]) {
                userIDs[i] = "620463494961299470";
            }
            let flag = users.find[userIDs[i]][0]+": ";
            let city = "**"+users.find[userIDs[i]][1]+":** ";
            let time = today.toLocaleString("en-GB", options(users.find[userIDs[i]][2]))+"\n";
            newMessage += flag+city+time;
        }
    }
    msg.channel.send(newMessage);
};

module.exports.weather = function(msg) {
    let userIDs = [...msg.mentions.users.keys()];
    if(userIDs.length>0 || msg.args.length==0) {
        if(userIDs.length==0) {
            userIDs = [msg.member.user.id];
        }
        for(let i in userIDs) {
            if(!users.find[userIDs[i]]) {
                userIDs[i] = "620463494961299470";
            }
            let city = "**"+users.find[userIDs[i]][1]+"**";
            let cityID = users.find[userIDs[i]][3];
            let url = weatherURL+auth.weatherio+"&city_id="+cityID;
            axios.get(url).then(response => {
                msg.channel.send(weatherEmbed(response,city,users.find[userIDs[i]][2]));
            }).catch(err => console.log(err));
        }
    } else if(msg.args.length>0) {
        let lookup = "";
        if(msg.args[msg.args.length-1].length==2) {
            let countryCode = msg.args.pop().toLowerCase();
            let cityCode = msg.args.join("+").toLowerCase();
            lookup = cityCode+","+countryCode;
        } else {
            lookup = msg.args.join("+").toLowerCase();
        }
        let url = weatherURL+auth.weatherio+"&city="+lookup;
        axios.get(url).then(response => {
            msg.channel.send(weatherEmbed(response));
        }).catch(err => {
            console.log(err);
            msg.channel.send(">>> **No results found!**\n Make sure you included the two letter country/state code in your query (e.g. San Sebastian ES).");
        });
    }
};