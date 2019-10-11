<template>
	<section>
	    <!--工具条-->
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
			<el-table-column prop="code" label="保理编号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="交易时间" width="150" sortable>
			</el-table-column>
			<el-table-column prop="deductType" label="交易类型" width="120" sortable>
			</el-table-column>
			<el-table-column prop="bindSn" label="序列号" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="agentName" label="交易用户" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="交易用户手机号" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="txnRate" label="交易分润抵扣比例" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="activatioRate" label="激活返现抵扣比例" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="vipRate" label="VIP返现抵扣比例" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="activityRate" label="活动返现抵扣比例" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="amount" label="抵扣金额" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="toagentName" label="抵扣给" min-width="180" sortable>
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
                this.$http.post(this.baseCont.JAVA_API + 'FNC_003',params).then(function(response) {
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