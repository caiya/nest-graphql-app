import { Injectable } from '@nestjs/common';
import OSS = require('ali-oss');

@Injectable()
export class OssService {

    public static readonly client = new OSS({
        accessKeyId: 'LTAI4FdNNVoKdMWRPLe22ssa',
        accessKeySecret: 'L6AKp7ebpEsiUfdqK7FFoj8Qy3Fn3X',
        region: 'oss-cn-beijing',
        bucket: 'ossaliyunbucket2'
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
                url: 'http://47.56.164.203/',
                body: 'bucket=${bucket}&object=${object}&etag=${etag}&size=${size}&mimeType=${mimeType}&imageInfo.height=${imageInfo.height}&imageInfo.width=${imageInfo.width}&imageInfo.format=${imageInfo.format}',
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
}
