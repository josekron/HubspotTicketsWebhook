const { SSM } = require("aws-sdk");

export const getParameterWorker = async (
    name: string,
    decrypt: boolean
  ): Promise<string> => {
    const ssm = new SSM();
    const result = await ssm
      .getParameter({ Name: name, WithDecryption: decrypt })
      .promise();
    return result.Parameter.Value;
  };