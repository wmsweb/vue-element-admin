<template>
  <el-form
    ref="numberForm"
    :model="numberForm"
    :rules="rules"
    :hide-required-asterisk="false"
    label-position="left"
    label-width="100px"
    size="medium"
  >

    <sticky :class-name="'sub-navbar'">
      <el-button @click="showGuide">显示帮助</el-button>
      <el-button type="success" icon="el-icon-caret-left" @click="returnBack">返回</el-button>
    </sticky>

    <div class="detail-container">
      <aside>
        <h2>添加机构</h2>
      </aside>

      <el-row>
        <el-col :span="24">
          <el-row>
            <el-col :span="8">
              <el-form-item label="机构名称" prop="name">
                <el-input v-model="numberForm.name" placeholder="机构名称" clearable maxlength="25" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="机构状态" prop="state">
                <el-select v-model="numberForm.state" placeholder="请选择机构状态">
                  <el-option label="启用" value="ENABLED" />
                  <el-option label="停用" value="DISABLED" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="业务类别" prop="category">
                <el-select v-model="numberForm.category" placeholder="请选择业务类别">
                  <el-option label="信发系统" value="CMS" />
                  <el-option label="价签系统" value="JEEGY" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="人数" prop="accountNum">
                <el-input v-model.number="numberForm.accountNum" placeholder="人数" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="带宽" prop="bandWidth">
                <el-input v-model.number="numberForm.bandWidth" placeholder="带宽(M)" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="空间" prop="diskSpace">
                <el-input v-model.number="numberForm.diskSpace" placeholder="空间(G)" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item>
                <el-button v-waves type="primary" icon="el-icon-check" :loading="loading" @click="submitForm('numberForm')">
                  立即创建
                </el-button>
                <el-button v-waves icon="el-icon-remove" @click="resetForm('numberForm')">
                  重置
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

    </div>
  </el-form>
</template>

<script>
import Sticky from '@/components/Sticky/index'
import { addInstitution } from '@/api/institution'
import waves from '@/directive/waves/waves' // 指令,在按钮上点击有水波效果

export default {

  name: 'Add',
  components: {
    Sticky
  },
  directives: {
    waves
  },
  data() {
    return {
      loading: false,
      numberForm: {},
      rules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择机构状态', trigger: 'change' }
        ],
        category: [
          { required: true, message: '请选择业务类别', trigger: 'change' }
        ],
        accountNum: [
          { required: true, message: '请输入人数', trigger: 'blur' },
          { type: 'number', message: '人数必须为数字值', trigger: 'blur' }

        ],
        bandWidth: [
          { required: true, message: '请输入带宽', trigger: 'blur' },
          { type: 'number', message: '带宽必须为数字值', trigger: 'blur' }
        ],
        diskSpace: [
          { required: true, message: '请输入空间', trigger: 'blur' },
          { type: 'number', message: '空间必须为数字值', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    submitForm(formName) { // 提交
      if (!this.loading) {
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addInstitution(this.numberForm).then(result => {
              const { message } = result
              this.$notify({
                title: '操作成功',
                message: message || '添加机构成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.loading = false
          }
        })
      }
    },
    resetForm(formName) { // 重置
      this.$refs[formName].resetFields()
    },
    showGuide() { // 显示帮组
      this.$notify({
        title: '提示',
        message: '这是一条不会自动关闭的消息',
        duration: 5000
      })
    },
    returnBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="css" scoped>
.detail-container {
    padding: 40px 50px 20px;
    .preview-img {
      width: 200px;
      height: 270px;
    }
  }
</style>
