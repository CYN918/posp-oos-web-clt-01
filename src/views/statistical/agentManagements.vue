<template>
	<section>
	    <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="agentName" placeholder="代理商名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="mobile" placeholder="代理商手机号"></el-input>
				</el-form-item>	
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="agentLevel" label="代理商等级" width="130" sortable>
			</el-table-column>
			<el-table-column prop="agentName" label="名称" width="150" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="idCard" label="身份证号" width="180" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="加入时间" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="invitationCode" label="邀请码" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="parentName" label="上级代理" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="sumAgent" label="渠道数" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="sumSn" label="终端数" width="120" sortable>
			</el-table-column>
			<el-table-column prop="sumActivation" label="激活数" width="150" sortable>
			</el-table-column>
			<el-table-column prop="sumAmount" label="总交易" width="150" sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" width="120" sortable>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" v-if="total != 0">
			<el-pagination
		      @current-change="handleCurrentChange"
		      :current-page="currentPage"
		      :page-size="pageSize"
		      layout="prev, pager, next"
		      :total="total"
		      style="float:right;">
		    </el-pagination>
		</el-col>
		
	</section>
</template>

<script>
	export default {
		data() {
			return {
				mobile: '',
				agentName: '',
				users: [],
				total: '',
				listLoading: false,
				pageSize: 10,
				currentPage: 1,
				token: localStorage.getItem('token'),
			}
		},
		methods: {
		    handleCurrentChange(val) {
		        console.log(val);
				this.currentPage = val;	
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
			    var _this = this;
			    let params = {
			        "HEAD":{"TOKEN":this.token},
			        "BODY":{
			            currentPage: this.currentPage,
                        pageSize: this.pageSize,
                        mobile: this.mobile,
                        agentName: this.agentName,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'AGT_001',params).then(function(response) {
                    if(response.body.HEAD.CODE === '000'){
                        this.users = response.body.BODY.rows;
	                    this.total = response.body.BODY.total;
	                    this.listLoading = false;
                    }else if(response.body.HEAD.CODE === '001'){
                        this.listLoading = false;
                        this.$message({
			              message: response.body.HEAD.MSG,
			              type: 'error'
			            });
			            _this.$router.push('/login');
                    }
                    
                })
                .catch(function(error) {
                    console.log(error);
                })
				
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			handleClick(row) {
		        console.log(row);
		    },
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>