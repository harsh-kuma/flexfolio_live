const { getLimit } = require("./access");
const checkLimit = (user, feature, currentUsage) => {
    const limit = getLimit(user,feature);
    if (limit === -1) {
        return true;
    }

    return currentUsage < limit;
};

module.exports = checkLimit;