# SSM Output to S3 Action

This action reads values from AWS SSM and send outputs to the S3 file.

In order to set the credentials please add https://github.com/aws-actions/configure-aws-credentials

## Inputs

## `ssm-path`

The path of the SSM Parameter


## `s3-bucket`

The name of the S3 bucket

## `s3-file`

The path for the S3 file

## `ssm-additional-paths`

This is optional. If provided, the parameters are appended to the at the end of the file

