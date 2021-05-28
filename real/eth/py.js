const python = require('python-bridge');

const py = python(); // return value
const { end } = py;

async function bigNumberToHex(bigNumber) {
    try {
        const hexFromBigNumber = await py`hex(${bigNumber})`;
        return hexFromBigNumber;

    } catch (error) {
        console.log("error");
        console.error(error);
    } finally {
        end();
    }
}

(async () => {
    const hex = await bigNumberToHex(10 ** 10);
    console.log(hex);
})().catch(error => {
    console.log("error");
    console.error(error);
});

