<template>
<div class="hello" v-loading="loading">
  <h3 v-if="scoreDetail.name">{{scoreDetail.name+'-'+scoreDetail.title}}</h3>
  <el-form :rules="rule" ref="form" :model="form" v-if="scoreDetail.scoreIsEnd === 2">
    <el-table :data="tableData" :span-method="objectSpanMethod" style="width: 100%">
      <el-table-column label="评价模板" width="150">
        <el-table-column prop="a" label="评分维度" width="150">
        </el-table-column>
      </el-table-column>
      <el-table-column label="主题准备及分享思路主题准备及分享思路（总占比50分）">
        <el-table-column prop="name" label="主题不够突出。内容构思一般，思路不够清晰，逻辑混乱（0~20）">
          <template slot-scope="scope">
            <el-form-item prop="first">
              <el-input v-model="form.first" type="number" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="主题明确。能够结合实际和自身经验有所表述和感悟。（20~35）">
          <template slot-scope="scope">
            <el-form-item prop="second">
              <el-input v-model="form.second" type="number" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="主题鲜明、层次清晰。能够结合实例举一反三，应用性较强。（35~50）">
          <template slot-scope="scope">
            <el-form-item prop="third">
              <el-input v-model="form.third" type="number" />
            </el-form-item>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="表达能力及互动效果表达能力及互动效果（总占比30分）">
        <el-table-column prop="name" label="照本宣读、分享内容难以理解。气氛沉闷，无互动。（0~10）">
          <template slot-scope="scope">
            <p> </p>
          </template>
        </el-table-column>
        <el-table-column label="语言清晰，分享内容表述明确。分享氛围较好，有互点环节。（10~20）">
          <template slot-scope="scope">
            <p> </p>
          </template>
        </el-table-column>
        <el-table-column label="表达内容生动，语言表达流畅，分享内容深入人心，环环相扣，引起强烈反应。（20~30）">
          <template slot-scope="scope">
            <p> </p>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="分享文件制作（总占比20分）">
        <el-table-column label="版面一般、逻辑性较弱、有错别字等。（0~10）">
          <template slot-scope="scope">
            <p> </p>
          </template>
        </el-table-column>
        <el-table-column label="版面精美、逻辑清晰、具有独特的风格（10~20）">
          <template slot-scope="scope">
            <p> </p>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-button style="margin-top:30px;" type="primary" @click="submit" :disabled="theDisabled">提交</el-button>
  </el-form>
</div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      id:"",
      scoreDetail:{},
      theDisabled: false,
      loading: true,
      tableData: [{
        a: '评分'
      }],
      form: {
        first: "0",
        second: "0",
        third: "0"
      },
      rule: {
        first: [{
            validator: function (rule, value, callback) {
              if (isNaN(value)) {
                callback("请输入数字")
              } else if (value < 0 || value > 50) {
                callback("请输入0-50")
              } else if(parseInt(value * 100)/100 != value ){
                callback("最多两位小数");
              }else {
                callback();
              }
            }
          },
          {
            required: true,
            message: "不能为空"
          }
        ],
        second: [{
            validator: function (rule, value, callback) {
              if (isNaN(value)) {
                callback("请输入数字")
              } else if (value < 0 || value > 30) {
                callback("请输入0-30")
              } else if(parseInt(value * 100)/100 != value ){
                callback("最多两位小数");
              } else {
                callback();
              }
            }
          },
          {
            required: true,
            message: "不能为空"
          }
        ],
        third: [{
            validator: function (rule, value, callback) {
              if (isNaN(value)) {
                callback("请输入数字")
              } else if (value < 0 || value > 20) {
                callback("请输入0-20")
              } else if(parseInt(value * 100)/100 != value ){
                callback("最多两位小数");
              } else {
                callback();
              }
            }
          },
          {
            required: true,
            message: "不能为空"
          }
        ]
      }
    }
  },
  mounted() {
    let t = this;
    this.id = this.$route.query.id;
    this.$ajax({
      method:"get",
      url:'/score-statistical-detail?',
      params:{
        id:this.id
      }
    }).then((res)=>{
      t.loading = false;
      if(res.data.code!=200){
        this.$message.error(res.data.message);
        return;
      }else{
        if(res.data.data.scoreIsEnd == 1 || res.data.data.scoreIsEnd == 0 ){
          this.$message({
            type:'error',
            message:'打分通道'+['未开启……','已关闭……'][res.data.data.scoreIsEnd],
            onClose(){
              t.$router.push('/index');
            }
          })
        }
        this.scoreDetail = res.data.data[0];
      }

    })
  },
  methods: {
    submit() {
      const t = this;
      this.$refs.form.validate((val) => {
        if (val) {
          let num = t.form.first+','+t.form.second+','+t.form.third;
          this.$ajax({
            url:"/set-score-item",
            method:"post",
            data:{
              scoreId:t.id,
              scoreNum:num
            }
          })
          this.theDisabled=true;
          sessionStorage.setItem('dis',1);
          this.$message('提交成功');
          this.$router.push('/index');
        }
      })
    },
    objectSpanMethod({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 1 || columnIndex === 2) {
        return {
          colspan: 3,
          rowspan: 1
        };
      } else if (columnIndex === 3) {
        return {
          colspan: 2,
          rowspan: 1
        };
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
