export const getSender = (logging, users) => {
    return users[0]._id === logging.id ? users[1].name : users[0].name
}
export const getEmail = (logging, users) => {
    return users[0]._id === logging._id ? users[0]._id : users[1]._id
}

export const isSameSender = (messages, m, i, userId) => {
    if (i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id == undefined) &&
        messages[i].sender.email !== userId) {
        return true
    }


}
export const isLastMessage = async (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender.email !== userId &&
        messages[messages.length - 1].sender.email

    )
}
//check me 
export const isUser = (messages, i, userId) => {
    return messages[i].sender._id === userId;
};
