<template>
  <el-form ref="postForm" :model="postForm" :rules="rules">
    <sticky :class-name="'sub-navbar'">

      <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
      <el-button v-loading="loading" type="success" style="margin-left: 10px" @click="submitForm">{{ isEdit? '编辑图书':'新增图书' }}</el-button>

    </sticky>

    <div class="detail-container">
      <warning />  <!-- 提醒组件 -->
      <el-row>
        <el-col :span="24">
          <EbookUpload
            :file-list="fileList"
            :disabled="isEdit"
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
        </el-col>
        <el-col :span="24">
          <el-form-item prop="title">
            <MdInput v-model="postForm.title" :max-length="100" name="name" required>
              书名
            </MdInput>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="作者: " prop="author" :label-width="labelWidth">
                <el-input v-model="postForm.author" placeholder="作者" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出版社: " prop="publisher" :label-width="labelWidth">
                <el-input v-model="postForm.publisher" placeholder="出版社" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="语言: " prop="language" :label-width="labelWidth">
                <el-input v-model="postForm.language" placeholder="语言" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="根文件: " prop="rootFile" :label-width="labelWidth">
                <el-input v-model="postForm.rootFile" placeholder="根文件" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="文件路径: " prop="filePath" :label-width="labelWidth">
                <el-input v-model="postForm.filePath" placeholder="文件路径" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="解压路径: " :label-width="labelWidth" prop="unzipPath">
                <el-input v-model="postForm.unzipPath" placeholder="解压路径" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="封面路径: " :label-width="labelWidth" prop="coverPath">
                <el-input v-model="postForm.coverPath" placeholder="封面路径" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件名称: " :label-width="labelWidth" prop="fileName">
                <el-input v-model="postForm.fileName" placeholder="文件名称" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="封面: " :label-width="labelWidth" prop="cover">
                <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                  <img :src="postForm.cover" class="preview-img">
                </a>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="目录: " :label-width="labelWidth">
                <div v-if="postForm.contents && postForm.contents.length > 0">
                  <el-tree :data="capterTree" @node-click="onContentClick" />
                </div>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

    </div>

  </el-form>
</template>

<script>

import Sticky from '../../../components/Sticky/index'
import Warning from './Warning'
import EbookUpload from '@/components/EbookUpload'
import MdInput from '@/components/MDinput'
import { createBook, getBook, updateBook } from '@/api/book'

const fields = {
  title: '标题',
  author: '作者',
  publisher: '出版社',
  language: '语言'
}

export default {

  components: {
    Sticky,
    Warning,
    EbookUpload,
    MdInput
  },
  props: {
    isEdit: Boolean
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(fields[rule.field] + '必须填写'))
      } else {
        callback()
      }
    }
    return {
      labelWidth: '120px',
      loading: false,
      postForm: {
        title: '',
        author: '',
        publisher: '',
        language: ''
      },
      fileList: [],
      capterTree: [],
      rules: {
        title: [{ validator: validateRequire }], // el-form-item 上绑定的prop属性
        author: [{ validator: validateRequire }], // el-form-item 上绑定的prop属性
        publisher: [{ validator: validateRequire }], // el-form-item 上绑定的prop属性
        language: [{ validator: validateRequire }] // el-form-item 上绑定的prop属性
      }
    }
  },
  created() { // vue 生命周期函数
    if (this.isEdit) {
      console.log(this.$route.params) // 当前动态路由
      const fileName = this.$route.params.fileName
      this.getBookData(fileName)
    }
  },
  methods: {
    getBookData(fileName) {
      getBook(fileName).then(response => {
        this.setData(response.data)
      })
    },
    submitForm() {
      if (!this.loading) {
        this.loading = true
        this.$refs.postForm.validate((valid, fields) => { // 提交之前的校验
          if (valid) { // 通过验证
            console.log(this.postForm)
            // 如果postForm有我们不需要提交的字段,可以将postForm拷贝一份出来,删除没有用的字段
            // 浅拷贝有两种方式
            // 方式一:
            // const book = Object.assign({}, this.postForm)
            // 方式二:
            const book = { ...this.postForm }
            // 删除不需要的字段
            delete book.url
            if (!this.isEdit) {
              createBook(book).then(response => {
                console.log(response)
                const { message } = response
                this.$notify({
                  title: '操作成功',
                  message: message,
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
                this.setDefault() // 上传完成以后,可以将字段清空
              }).catch(() => {
                this.loading = false
              })
            } else {
              updateBook(book).then(response => {
                const { message } = response
                this.$notify({
                  title: '操作成功',
                  message: message,
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            }
          } else {
            const validErrMsg = fields[Object.keys(fields)[0]][0].message
            this.$message({
              message: validErrMsg,
              type: 'error'
            })
            this.loading = false
          }
        })
      }
    },
    setData(data) {
      // this.postForm = data
      // this.capterTree = data.capterTree
      const {
        title,
        author,
        publisher,
        rootFile,
        cover,
        language,
        url,
        originalName,
        contents,
        fileName,
        coverPath,
        filePath,
        unzipPath,
        capterTree

      } = data
      this.postForm = {
        ...this.postForm,
        title,
        author,
        publisher,
        rootFile,
        cover,
        language,
        url,
        originalName,
        contents,
        fileName,
        coverPath,
        filePath,
        unzipPath
      }
      this.capterTree = capterTree
      this.fileList = [{ name: fileName, url: url }]
      console.log('========', capterTree)
    },
    showGuide() {
      alert('showGuide')
    },
    onUploadSuccess(data) {
      console.log('onUploadSuccess', data)
      this.setData(data)
    },
    onUploadRemove() {
      console.log('onUploadRemove')
      this.setDefault()
    },
    onContentClick(data) {
      console.log({ data })
      if (data.www) {
        window.open(data.www)
      }
    },
    setDefault() {
      // this.postForm = Object.assign({}, defaultForm) // 给一个空对象, defaultForm是默认值
      this.capterTree = []
      this.fileList = [] // 文件列表也移除
      this.$refs.postForm.resetFields() // 组件提供的移除字段的方法
    }
  }

}
</script>

<style lang="scss" scoped>

  .detail-container {
    padding: 40px 50px 20px;
    .preview-img {
      width: 200px;
      height: 270px;
    }
  }

</style>
