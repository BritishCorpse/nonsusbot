// To use these in mongoose schemas:
/*
{
    ...discordMessageContent,
    require: true,
    // etc..
}
*/

module.exports = {
    discordMessageContent: {
        type: String,
        // TODO: put the "magic numbers" somewhere as constants (discord minimum and maximum message length)
        minLength: [1, "Discord message content is too short."],
        maxLength: [2000, "Discord message content is too long."],
    },
    discordSnowflake: {
        type: String,
        validate: {
            validator: v => (/\d+/u).test(v),
            message: props => `${props.value} is not a valid Snowflake`,
        },
    },
};
