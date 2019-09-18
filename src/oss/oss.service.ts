import { Injectable } from '@nestjs/common';
import OSS = require('ali-oss');

import { Callback } from './interfaces/callback.interface';
import { Policy } from './interfaces/policy.interface';
import { encode, decode } from 'base-64';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class OssService {

    private static readonly accessKeyId = 'LTAI4FdNNVoKdMWRPLe22ssa' // 请填写您的AccessKeyId
    private static readonly accessKeySecret = 'L6AKp7ebpEsiUfdqK7FFoj8Qy3Fn3X' // 请填写您的AccessKeySecret
    private static readonly endpoint = 'oss-cn-beijing.aliyuncs.com' // 请填写您的endpoint
    private static readonly bucket = 'ossaliyunbucket2' // 请填写您的 bucketname
    private static readonly host = "https://" + OssService.bucket + "." + OssService.endpoint // host的格式为 bucketname.endpoint

    // callbackUrl为 上传回调服务器的URL，请将下面的IP和Port配置为您自己的真实信息
    private static readonly callbackUrl = 'http://47.56.164.203'
    // callbackbody内容
    private static readonly callbackBody = 'bucket=${bucket}&object=${object}&etag=${etag}&size=${size}&mimeType=${mimeType}&imageInfo.height=${imageInfo.height}&imageInfo.width=${imageInfo.width}&imageInfo.format=${imageInfo.format}'
    private static readonly dir = 'hzlh/' // 用户上传文件时指定的前缀
    private static readonly region = 'oss-cn-beijing' // bucket所在区域

    public static readonly client = new OSS({
        accessKeyId: OssService.accessKeyId,
        accessKeySecret: OssService.accessKeySecret,
        region: OssService.region,
        bucket: OssService.bucket
    })

    // 查询所有buckets
    async listBuckets(): Promise<OSS.Bucket[]> {
        return OssService.client.listBuckets(null)
    }

    // 上传
    async uploadFile(file): Promise<OSS.PutObjectResult> {
        // 制定请求的回调
        return await OssService.client.put(file.originalname, file.buffer, {
            callback: {
                url: OssService.callbackUrl,
                body: OssService.callbackBody
            }
        })
    }

    // 获取所有已上传图片
    async listUploadFiles(): Promise<OSS.ListObjectResult> {
        return OssService.client.list(null, null)
    }

    // 获取指定文件详情
    async getUploadFileUrl(name: string): Promise<string> {
        return OssService.client.generateObjectUrl(name)
    }

    // 生成policy信息
    async generatePolicyInfo(): Promise<Policy> {
        // 返回类似如下信息，其中callback信息是经过base64编码，例如：
        // {
        //     'callbackUrl':'http://oss-demo.aliyuncs.com:23450',
        //     'callbackHost':'oss-demo.aliyuncs.com',
        //     'callbackBody':'filename=${object}&size=${size}&mimeType=${mimeType}&height=${imageInfo.height}&width=${imageInfo.width}',
        //     'callbackBodyType':'application/x-www-form-urlencoded'
        // }
        // {
        //     accessid: '6MKO******4AUk44',
        //     host: 'http://post-test.oss-cn-hangzhou.aliyuncs.com',
        //     policy: 'eyJleHBpcmF0aW9uIjoiMjAxNS0xMS0wNVQyMDo1Mjoy******Jjdb25kaXRpb25zIjpbWyJjdb250ZW50LWxlbmd0aC1yYW5nZSIsMCwxMDQ4NTc2MDAwXSxbInN0YXJ0cy13aXRoIiwiJGtleSIsInVzZXItZGlyXC8iXV19',
        //     signature: 'VsxOcOudx******z93CLaXPz+4s=',
        //     expire: 1446727949,
        //     callback: 'eyJjYWxsYmFja1VybCI6Imh0dHA6Ly9vc3MtZGVtby5hbGl5dW5jcy5jdb206MjM0NTAiLCJjYWxsYmFja0hvc3QiOiJvc3MtZGVtby5hbGl5dW5jcy5jdb20iLCJjYWxsYmFja0JvZHkiOiJmaWxlbmFtZT0ke29iamVjdH0mc2l6ZT0ke3NpemV9Jm1pbWVUeXBlPSR7bWltZVR5cGV9JmhlaWdodD0ke2ltYWdlSW5mby5oZWlnaHR9JndpZHRoPSR7aW1hZ2VJdbmZvLndpZHRofSIsImNhbGxiYWNrQm9keVR5cGUiOiJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQifQ==',
        //     dir: 'hzlh/'
        // }
        const expireTime = 600 // 600s过期
        const expireEndTime = new Date().getTime() + expireTime * 1000
        const callback: Callback = {
            callbackBody: OssService.callbackBody,
            callbackUrl: OssService.callbackUrl
        }
        const policyText = {
            "expiration": '2099-01-01T12:00:00.000Z', // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
            "conditions": [["content-length-range", 0, 1048576000]] // 文件大小限制
        }
        const policyBase64 = encode(JSON.stringify(policyText))

        const bytes = CryptoJS.HmacSHA1(policyBase64, OssService.accessKeySecret, { asBytes: true });

        const policy: Policy = {
            accessid: OssService.accessKeyId,
            host: OssService.host,
            policy: policyBase64,
            signature: bytes.toString(CryptoJS.enc.Base64),
            expire: Math.floor(expireEndTime / 1000),
            callback: encode(JSON.stringify(callback)),
            dir: OssService.dir
        }
        console.log('policy', policy)
        return policy
    }
}
