const WebSocket = require("ws")

var quoteTimeout;

var state = {
    running: false,
    stock1Amount: 100,
    stock2Amount: 50,
    stock1Quote: 100.0,
    stock2Quote: 250.0,

    money: 10000.0,
    stock1Held: 0,
    stock2Held: 0
}


function changeQuoteAndReschedule(ws) {
    let goesUp = () => Math.random() > 0.5;

    if (goesUp()) {
        state.stock1Quote += Math.random();
    }
    else {
        state.stock1Quote -= Math.random();
    }

    if (goesUp()) {
        state.stock2Quote -= Math.random() * 5;
    }
    else {
        state.stock2Quote += Math.random() * 5;
    }

    if (state.stock1Quote < 0) {
        state.stock1Quote = 0;
    }
    if (state.stock2Quote < 0) {
        state.stock2Quote = 0;
    }

    quoteTimeout = setTimeout(() => {
        changeQuoteAndReschedule(ws);
        ws.send(JSON.stringify(state));
    }, getRescheduleTime());
}

function getRescheduleTime() {
    return Math.floor(Math.random() * 2000);
}

function buyStock(id, amount) {
    switch (id) {
        case 1:
            if (state.stock1Amount >= amount && state.money >= (amount * state.stock1Quote)) {
                state.stock1Amount -= amount;
                state.money -= amount * state.stock1Quote;
                state.stock1Held += amount;
            }
            break;

        case 2:
            if (state.stock2Amount >= amount && state.money >= (amount * state.stock2Quote)) {
                state.stock2Amount -= amount;
                state.money -= amount * state.stock2Quote;
                state.stock2Held += amount;
            }
            break;
    }
}

function sellStock(id, amount) {
    switch (id) {
        case 1:
            if (state.stock1Held >= amount) {
                state.stock1Held -= amount;
                state.money += amount * state.stock1Quote;
                state.stock1Amount += amount;
            }
            break;

        case 2:
            if (state.stock2Held >= amount) {
                state.stock2Held -= amount;
                state.money += amount * state.stock2Quote;
                state.stock2Amount += amount;
            }
            break;
    }
}


const wss = new WebSocket.Server({port: 9091});

wss.on('connection', function wsection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        const msg = JSON.parse(message);
        let result;

        switch (msg.msgtype) {
            case 'BUY':
                buyStock(msg.id, msg.amount);
                ws.send(JSON.stringify(state));
                break;

            case 'SELL':
                sellStock(msg.id, msg.amount);
                ws.send(JSON.stringify(state));
                break;

            default:
                console.log('received unknown message: %s', message);
                break;

        }
    });

    ws.on('close', function close() {
        console.log("connection closed")

        if (quoteTimeout) {
            clearTimeout(quoteTimeout);
        }

        if (!wss.clients.length) {
            state.running = false;
        }
    });

    if (!state.running) {

        state.running = true;
        quoteTimeout = setTimeout(() => {
                changeQuoteAndReschedule(ws);
                ws.send(JSON.stringify(state));
            }, getRescheduleTime()
        );
    }

    ws.send(JSON.stringify(state));
});
