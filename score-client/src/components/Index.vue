<template>
<div class="indexWrap">
  <div class="m_b16">
    <span>当前正在打分：</span>
    <el-radio
      v-model="scopingId"
      :label="item.id"
      v-for="item in scopingList"
      :key="item.id"
    >{{item.name}}-{{item.title}}</el-radio>
    <span v-if="scopingList.length==0">暂无</span>
    <el-button v-if="scopingList.length" @click="gotoScore">立即前往</el-button>
  </div>
  <el-select
    :filterable="true"
    @change="changeSelect"
    v-model="selectScore"
    :clearable="true"
    style="width:500px;"
    class="m_b16"
  >
    <el-option
      v-for="(item,index) in scoreList"
      :key='index'
      :value="item.id"
      :label="item.name+'-'+item.title+'-'+item.scoreDate"
    />
  </el-select>
  <el-table style="width: 1200px;margin:0 auto;" :data="tableData">
    <el-table-column prop="id" label="ID" width="80">
    </el-table-column>
    <el-table-column prop="name" label="姓名">
    </el-table-column>
    <el-table-column prop="title" label="标题" width="300">
    </el-table-column>
    <el-table-column prop="remark" label="备注">
    </el-table-column>
    <el-table-column prop="scoreDate" label="日期">
    </el-table-column>
    <el-table-column prop="status" label="状态">
    </el-table-column>
    <el-table-column prop="sum" label="总分">
    </el-table-column>
    <el-table-column prop="operation" label="操作">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看明细</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="m_t18">
    <img src="@/assets/paiPic.jpeg" class="pay-pic" /><img src="@/assets/laoruan'pay.jpg" class="pay-pic2" />
  </div>
  <div class="sponsor">
    <h2>特别赞助</h2>
    <img src='@/assets/z1.png' />
  </div>

  <el-dialog
    width="1200px"
    title="查看明细"
    :visible.sync="scoreListVis"
    :before-close="handleClose"
  >
    <el-table :data="scoreListTableData">
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="scoreId" label="分享ID" width="80">
      </el-table-column>
      <el-table-column prop="scoreNum" label="分数">
      </el-table-column>
      <el-table-column prop="scoreNumSum" label="合计分数">
        <template slot-scope="scope">
          <span>{{scoreNumSum(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="scoreDate" label="分享日期">
        <template slot-scope="scope">
          <span>{{newDate(scope.row.scoreDate)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cookieId" label="打分人ID">
      </el-table-column>
      <el-table-column prop="isEffective" label="评分是否有效">
        <template slot-scope="scope">
          <span>{{['否','是'][scope.row.isEffective]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      scoreList: [],
      selectScore: '',
      scopingId: '',
      scopingList: [],
      tableData: [],
      scoreListVis: false,
      scoreListTableData: []
    }
  },
  created() {
    this.$ajax({
      method: "post",
      url: '/setCookies'
    }).then((res) => {
      this.$ajax({
        method: "get",
        url: '/getShareList'
      }).then((res) => {
        res.data.data.forEach((item) => {
          if (item.scoreIsEnd == 2) {
            this.scopingList.push(item);
          }
          item.scoreDate = this.formatDate(item.scoreDate);
          item.title = '《' + item.title + '》';
          item.status = ['未开始', '已结束', '进行中'][item.scoreIsEnd];
          this.scoreList.push(item);
        });
        this.tableData = this.scoreList;
      })
    })
  },

  methods: {
    newDate(str) {
      const date = new Date(Number(str));
      return this.formatDate(date);
    },
    changeSelect() {
      this.$ajax({
        method: "get",
        url: '/score-statistical-detail?',
        params: {
          id: this.selectScore
        }
      }).then((res) => {
        if (res.data.code != 200) {
          this.$message.error(res.data.message);
          return;
        } else {
          let data = res.data.data;
          data.forEach((item) => {
            item.scoreDate = this.formatDate(item.scoreDate);
            item.title = '《' + item.title + '》';
            item.status = ['未开始', '已结束', '进行中'][item.scoreIsEnd];
          });
          this.tableData = [...data];
        }

      })
    },
    formatDate(date) {
      let dateObj = new Date(date);
      return dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
    },
    gotoScore() {
      if (this.scopingId) {
        this.$router.push(`/detail?id=${this.scopingId}`)
      } else {
        this.$message.error('请选择项目');
      }

    },
    handleClose() {
      this.scoreListTableData = [];
      this.scoreListVis = false;
    },
    scoreNumSum(row) {
      return row.scoreNum.split(',').reduce((a, b) => {
        return Number(a) + Number(b);
      }).toFixed(2);
    },
    handleClick(row) {
      let t = this;
      this.$ajax({
        method: "get",
        url: "/score-statistical-list",
        params: {
          id: row.id
        }
      }).then((res) => {
        if (res.data.data.length == 0) {
          t.$message.error('没有记录！');
        } else {
          this.scoreListTableData = res.data.data;
          this.scoreListVis = true;
        }
      })
    }
  }
}
</script>

<style>
.m_b16 {
  margin-bottom: 16px;
}

.pay-pic {
  width: 300px;
}

.pay-pic2 {
  width: 150px;
}

.m_t18 {
  margin-top: 18px;
}
.sponsor img{
  width:60px;
}
</style>
