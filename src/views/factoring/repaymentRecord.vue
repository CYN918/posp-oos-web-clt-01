<template>
	<section>
	    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="mobile" placeholder="划拨人手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="agentName" placeholder="划拨人名称"></el-input>
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
			<el-table-column prop="term" label="本期期数" width="150" sortable>
			</el-table-column>
			<el-table-column prop="lastDay" label="约定还款时间" width="150" sortable>
			</el-table-column>
			<el-table-column prop="dealAmount" label="当期已还金额" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="remainAmount" label="当期剩余应还" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="frdkAmount" label="分润抵扣金额" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="fxdkAmount" label="返现抵扣金额" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="vipAmount" label="VIP返现抵扣金额" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="hddkAmount" label="活动返现抵扣金额" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="amount" label="抵扣后应还款金额" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="hkTime" label="还款时间" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="dealType" label="还款方式" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="state" label="本期还款状态" min-width="180" sortable>
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
				pageSize: 10,
				currentPage: 1,
				listLoading: false,
				sels: [],//列表选中列				
				editLoading: false,
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
                this.$http.post(this.baseCont.JAVA_API + 'FNC_002',params).then(function(response) {
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