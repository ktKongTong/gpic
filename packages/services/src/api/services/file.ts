import { AwsClient } from "aws4fetch";
import { backendEnv as env} from "./env";
import {z} from "zod";
import {typeid} from "typeid-js";

const getClient = () => new AwsClient({
  service: "s3",
  region: "auto",
  accessKeyId: env().S3_AK,
  secretAccessKey: env().S3_SK,
});



  const R2_URL = () => env().S3_ENDPOINT
  const bucketName = () => env().S3_BUCKET

  const schema = z.object({
    filename: z.string(),
    filesize: z.string(),
    md5: z.string(),
  })
  
export class FileService {
    constructor() {
    }

    async signUpload(data?:{prefix?: string, filename?: string, filesize?: number, md5?: string}) {
        const p = data?.prefix ? `${data?.prefix}_` : ''
        const key = `${p}${typeid().toString()}`
        const url = (
            await getClient().sign(
              new Request(`${R2_URL()}/${bucketName()}/${key}?X-Amz-Expires=${1800}`, { method: "PUT" }),
              { aws: { signQuery: true,  } },
            )
          ).url.toString()
        return {
            fileKey: key,
            uploadURL: url,
        }
    }

    async uploadFile(file: Uint8Array, fileType?: string) {
        const {fileKey, uploadURL} = await this.signUpload({ prefix: 'ai' })
        const res = await fetch(uploadURL, { method: 'PUT', body: file })
        if (!res.ok) {
          throw new Error("failed to upload file")
        }
        // filename, filesize, md5
        return `${env().S3_UC_ENDPOINT}/${fileKey}`
    }

    async directUpload(file: Uint8Array) {
        // kv service get key
        // const res = await fetch(uploadURL, { method: 'PUT', body: file })
    }


    async getFileByMd5(md5: string) {
        // m
        // check file exists
        //   return null
        // md5
    }

    async getFileURLById(key: string) {
        const res = await fetch(`${env().S3_UC_ENDPOINT}/${key}`, {
            method: 'HEAD'
        })
        if(!res.ok) {
            throw new Error(`Could not find file ${key}`)
        }
        return `${env().S3_UC_ENDPOINT}/${key}`
    }
}