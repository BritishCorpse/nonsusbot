// To use these in mongoose schemas:
/*
{
    ...discordMessageContent,
    require: true,
    // etc..
}
*/

const minLength = {
    length: 1,
    error: "Discord message content is too short.",
};

const maxLength = {
    length: 2000,
    error: "Discord message content is too short.",
};

module.exports = {
    discordMessageContent: {
        type: String,
        // TODO: put the "magic numbers" somewhere as constants (discord minimum and maximum message length)
        minLength: [minLength.length, minLength.error],
        maxLength: [maxLength.length, maxLength.error],
    },
    discordSnowflake: {
        type: String,
        validate: {
            validator: v => (/\d+/u).test(v),
            message: props => `${props.value} is not a valid Snowflake`,
        },
    },
};
