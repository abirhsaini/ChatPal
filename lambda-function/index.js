const AWS = require('aws-sdk');

const ENDPOINT = 'iqeg8hu1ml.execute-api.us-east-1.amazonaws.com/production/@connections';
const client = new AWS.ApiGatewayManagementApi({ endpoint: ENDPOINT });

const sendToOne = async(id, body) => {
    try {
        await client.postToConnection({
            'connectionId': id,
            'Data': Buffer.from(JSON.stringify(body)),
        }).promise();
    } catch (e) {
        // Handle error if needed
    }
};

const sendToAll = async(ids, body) => {
    const all = ids.map(i => sendToOne(i, body));
    await Promise.all(all);
};

const handler = async(event) => {
    if (event.requestContext) {
        const connectionId = event.requestContext.connectionId;
        const routeKey = event.requestContext.routeKey;
        let body = {};
        try {
            if (event.body) {
                body = JSON.parse(event.body);
            }
        } catch (err) {
            // Handle JSON parse error if needed
        }

        switch (routeKey) {
            case '$connect':
                // Handle $connect
                break;
            case '$disconnect':
                // Handle $disconnect
                break;
            case '$default':
                // Handle $default
                break;
            case 'setName':
                // Handle setName
                break;
            case 'sendPublic':
                await sendToAll([connectionId], { publicMessage: ' this is a public message' });
                break;
            case 'sendPrivate':
                await sendToOne(connectionId, { privateMessage: "this is private message" });
                break;
            default:
                // Handle other cases
        }
    }

    // TODO: Implement any additional logic if needed

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

module.exports = { handler };