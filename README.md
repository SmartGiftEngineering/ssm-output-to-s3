# SSM Output to S3 Action

This action reads values from AWS SSM and send outputs to the S3 file.

You should add following AWS credentials as env variables to your action env. Please make sure that you add them as secret!

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION

You can also use following action to configure AWS credentials:

https://github.com/aws-actions/configure-aws-credentials

## Sample

```
on: [push]

env:
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  AWS_REGION: us-east-1

jobs:
  sync-env-variables:
    runs-on: ubuntu-latest
    name: Sync env variables to S3 for ECS
    steps:
      - name: SSM to S3
        id: ssmToS3
        uses: SmartGiftEngineering/ssm-output-to-s3@0.1.1
        with:
          ssm-path: '/toffy/preprod/base'
          s3-bucket: 'smartgift-app-configs'
          s3-file: 'corp-gifting/test-service/delete-me.env'
          ssm-additional-paths: '/toffy/preprod/base/test-service' # Optional
      # Use the output from the `hello` step
      - name: The S3 Path for the env file
        run: echo "${{ steps.test-ssm-action.s3ObjectUrl }}"
```

## Inputs

###### `ssm-path`

The path of the SSM Parameter


###### `s3-bucket`

The name of the S3 bucket

###### `s3-file`

The S3 path for the output file

###### `ssm-additional-paths`

This is optional. If provided, the parameters are appended to the at the end of the file. You can define multiple paths separated by comma.
