import {AwsClient} from "aws4fetch";
import {backendEnv as env} from "./env";

export const getClient = () => new AwsClient({
  service: "s3",
  region: "auto",
  accessKeyId: env().S3_AK,
  secretAccessKey: env().S3_SK,
});



const R2_URL = () => env().S3_ENDPOINT
const bucketName = () => env().S3_BUCKET
