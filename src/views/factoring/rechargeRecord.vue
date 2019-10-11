<template>
	<section>
	    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="mobile" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="agentName" placeholder="名称"></el-input>
				</el-form-item>	
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="orderNo" label="订单号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="充值时间" width="150" sortable>
			</el-table-column>
			<el-table-column prop="realName" label="充值用户" width="150" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="txnAmount" label="充值金额" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="txnFee" label="手续费" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="txnSelAmt" label="到账金额" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="agentName" label="所属代理商" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="code" label="所属保理编号" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="term" label="充值期数" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="txnState" label="状态" min-width="180" sortable>
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
				users: [],
				total: '',
				listLoading: false,
				mobile: '',
				agentName: '',
				addLoading: false,
				pageSize: 10,
				currentPage: 1,
				token: localStorage.getItem('token'),
			}
		},
		methods: {
		    handleCurrentChange(val) {
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
                this.$http.post(this.baseCont.JAVA_API + 'FNC_004',params).then(function(response) {
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
			
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>