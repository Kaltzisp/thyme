const options = {
    timeZone: "Australia/Melbourne",
    hour12: false,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
};

module.exports = function() {
    let time = new Date();
    time = time.toLocaleString("en-GB", options).split(", ");
    time = `SERVER BOOT @ ${time[2]} - ${time[0]} ${time[1]}`;
    const separator = new Array(time.length + 1).join("=");
    console.log(`\n\n${separator}\n${time}\n${separator}\n\n`);
};
