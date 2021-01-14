module.exports = function(timezone) {
    return {
        timeZone: timezone,
        hour12: true,
        hourCycle: "h12",
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit"
    };
};
