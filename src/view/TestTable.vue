<template>
  <div class="test-table">
    <CommonTable
      selection
      border
      :tableColumnData="teamTableColumns"
      :data="data"
    >
      <template slot="avatar" slot-scope="{ scope }">
        <el-avatar size="small" :src="scope.row.avator"></el-avatar>
      </template>
      <template slot="departMentName" slot-scope="{ scope }">
        <el-avatar size="small" :src="scope.row.avator"></el-avatar>
      </template>
      <template slot="departMentName2" slot-scope="{ scope }">
        <el-avatar size="small" :src="scope.row.avator"></el-avatar>
      </template>
      <template slot="departMentName3" slot-scope="{ scope }">
        <el-avatar size="small" :src="scope.row.avator"></el-avatar>
      </template>
      <template slot="departMentName4" slot-scope="{ scope }">
        <el-avatar size="small" :src="scope.row.avator"></el-avatar>
      </template>
      <template slot="departMentName5" slot-scope="{ scope }">
        <el-avatar size="small" :src="scope.row.avator"></el-avatar>
      </template>
      <template slot="departMentName6" slot-scope="{ scope }">
        <el-avatar size="small" :src="scope.row.avator"></el-avatar>
      </template>
      <template slot="operate" slot-scope="{ scope }">
        <el-button @click="handleOpt(scope.row)">添加</el-button>
        <el-button @click="handleOpt(scope.row)">删除</el-button>
        <el-button @click="handleOpt(scope.row)">排序</el-button>
        <el-button @click="handleOpt(scope.row)">修改</el-button>
      </template>
    </CommonTable>
  </div>
</template>
<script>
import CommonTable from "@/components/CommonTable";
import { teamTableColumns } from "./config";
import { Random, mock } from "mockjs";
export default {
  name: "TestTable",
  components: {
    CommonTable,
  },
  data() {
    return {
      teamTableColumns: teamTableColumns,
      data: [
        {
          avatar: "",
          staffNo: "",
          chineseName: "",
          jobName: "",
          departMentName: "",
        },
      ],
    };
  },
  created() {
    console.log(Random.email());
    Random.image("50x50", "#50B347", "#FFF", "Mock.js");
    const data = mock({
      "array|200": [
        {
          avatar: Random.image("50x50", "#50B347", "#FFF", "Mock.js"),
          "staffNo|+1": ["Hello", "Mock.js", "!"],
          chineseName: "@cname()",
          jobName: "@cword(3)",
          departMentName: "@cword(3,6)",
          "email|+1": ["Hello", "Mock.js", "!"],
          "operate|+1": ["Hello", "Mock.js", "!"],
        },
      ],
    });
    this.data = data.array;
    console.log(data);
  },
};
</script>
<style scoped>
.test-table {
  padding: 50px;
}
</style>
