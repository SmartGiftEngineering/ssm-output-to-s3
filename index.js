const core = require('@actions/core');
const github = require('@actions/github');
const { SSM } = require("@aws-sdk/client-ssm");
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

try {
  const ssmPath = core.getInput('ssm-path') || '/toffy/preprod/base';
  const additionalSsmPaths = core.getInput('ssm-additional-paths')?.trim()?.split(',') || ['/toffy/preprod/organization-service'];

  const s3Bucket = core.getInput('s3-bucket');
  const s3File = core.getInput('s3-file');

  if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_SECRET_ACCESS_KEY) {
    return core.setFailed('AWS Credentials are missing');
  }

  const ssmClient = new SSM({ region: 'us-east-1' });
  const s3Client = new S3Client();

  async function putEnvFileToS3({ body }) {
    const uploadParams = {
      Bucket: s3Bucket,
      Key: s3File,
      Body: body,
      // ACL: 'authenticated-read',
      // ContentType: 'env',
    };
    const putObjectCommandInput = new PutObjectCommand(uploadParams);
    const s3Resp = await s3Client.send(putObjectCommandInput);
    return s3Resp;
  }


  const ssmParams = {
    Names: [ /* required */
      ssmPath,
      ...additionalSsmPaths,
      /* more items */
    ],
  };

  ssmClient.getParameters(ssmParams, async (err, data) => {
    if (err) {
      return core.setFailed(error.message);
    }
    const { InvalidParameters, Parameters } = data;
    if (InvalidParameters?.length) {
      core.warning('invalid ssm paths', InvalidParameters.join(','));
    }
    const baseParameter = Parameters.find(p => p.Name === ssmPath);
    const additionalParameters = Parameters.filter(p => p.Name !== ssmPath);
    // const { Parameters } = data;
    let fileContent = `${baseParameter.Value}`;
    additionalParameters.forEach(param => {
      fileContent += `\n${param.Value}`;
    });

    try {
      await putEnvFileToS3({ body: fileContent });
      const s3ObjectUrl = `https://${s3Bucket}.s3.amazonaws.com/${s3File}`;
      core.setOutput("s3ObjectUrl", s3ObjectUrl);
    } catch (error) {
      return core.setFailed(error.message);
    }
  });
} catch (error) {
  core.setFailed(error.message);
}