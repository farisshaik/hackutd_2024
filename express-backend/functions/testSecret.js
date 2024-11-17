const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();

async function getSecret(secretName) {
  try {
    const [version] = await client.accessSecretVersion({
      name: `projects/hackutd24-whatsthemove/secrets/${secretName}/versions/latest`, 
    });
    const secret = version.payload.data.toString("utf8");
    console.log(`Secret retrieved: ${secret}`);
  } catch (error) {
    console.error(`Error fetching secret ${secretName}:`, error.message);
  }
}

getSecret("PINATA_JWT");