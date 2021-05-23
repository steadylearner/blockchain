const humanReadableUnixTimestamp = (timestampInt) => {
    return new Date(timestampInt * 1000);
}

const humanReadableEscrowState = (escrowState) => {
    if (escrowState === 0) {
        return "Sale";
    } else if (escrowState === 1) {
        return "Locked";
    } else if (escrowState === 2) {
        return "Release";
    } else if (escrowState === 3) {
        return "Closed";
    } else if (escrowState === 4) {
        return "Complete";
    }
    // else if (state === 5) {
    //   return "End";
    // }
}

export {
    humanReadableUnixTimestamp,
    humanReadableEscrowState,
}