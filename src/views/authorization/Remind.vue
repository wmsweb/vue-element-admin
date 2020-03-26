<template>

  <el-dialog title="提醒设置" :visible.sync="dialogRemindVisible" :before-close="handleClose">
    <el-form
      ref="remindForm"
      :model="remindForm"
      :rules="rules"
      :hide-required-asterisk="false"
      label-position="left"
      label-width="150px"
    >
      <el-form-item label="机构名称: " prop="name" style="width: 500px">
        <el-input v-model="remindInstitutionName" placeholder="机构名称" autocomplete="off" clearable :disabled="true" maxlength="25" />
      </el-form-item>

      <el-form-item label="临超期提醒设置: " prop="remindDay" style="width: 500px">
        <el-input v-model="remindForm.remindDay" placeholder="临超期提醒设置" autocomplete="off" clearable maxlength="25">
          <template slot="prepend">剩余</template>
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="临超数提醒设置: " prop="remindNum" style="width: 500px">
        <el-input v-model="remindForm.remindNum" placeholder="临超数提醒设置" autocomplete="off" clearable maxlength="25">
          <template slot="prepend">剩余</template>
          <template slot="append">台</template>
        </el-input>
      </el-form-item>
      <el-form-item label="通知邮箱: " prop="email" style="width: 500px">
        <el-input v-model="remindForm.email" placeholder="通知邮箱" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
      <el-form-item label="通知短信: " prop="sms" style="width: 500px">
        <el-input v-model="remindForm.sms" placeholder="通知短信" autocomplete="off" clearable maxlength="25" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="handleRemind">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {

  name: 'Remind',
  props: {
    dialogRemindVisible: Boolean,
    remindInstitutionName: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      rules: {},
      remindForm: {},
      loading: false

    }
  },
  methods: {
    handleCancel() {
      this.$emit('handleCancel')
    },
    handleRemind() {
      this.$emit('handleCancel')
    },
    handleClose() {
      this.$emit('handleCancel')
    }
  }
}
</script>

<style lang="css" scoped>
</style>
