<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="mobile" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="toMobile" placeholder="名称"></el-input>
				</el-form-item>	
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="withdrawId" label="出款id" width="120" sortable>
			</el-table-column>
			<el-table-column prop="orderNo" label="订单号" width="180" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="申请时间" width="150" sortable>
			</el-table-column>
			<el-table-column prop="agentName" label="用户姓名" width="180" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="amount" label="提现金额" :formatter="formatAmount" width="160" sortable>
			</el-table-column>
			<el-table-column prop="fee" label="手续费" :formatter="formatFee" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="actualAmount" label="实际到账金额" :formatter="formatActualAmount" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="payBankNo" label="到账银行卡" min-width="220" sortable>
			</el-table-column>
			<el-table-column prop="payTime" label="付款时间" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" :formatter="formatState" min-width="180" sortable>
			</el-table-column>
			<el-table-column
		      fixed="right"
		      label="操作"
		      width="120">
		      <template slot-scope="scope">
		        <el-button @click="handleClick(scope.row)" type="text" size="small">出款</el-button>
		      </template>
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
				toMobile: '',
				users: [],
				total: '',
				listLoading: false,
				pageSize: 10,
				currentPage: 1,
				listLoading: false,
				sels: [],//列表选中列				
				editLoading: false,
				token: localStorage.getItem('token'),
			}
		},
		methods: {
		    formatAmount(row, column, cellValue) {
                let amount = (row.amount)/100;
                return amount;
		    },
		    formatFee(row, column, cellValue) {
                let fee = (row.fee)/100;
                return fee;
		    },
		    formatActualAmount(row, column, cellValue) {
                let actualAmount = (row.actualAmount)/100;
                return actualAmount;
		    },
		    formatState(row, column, cellValue) {
                if(cellValue == "1"){
	                return '处理中';
	            }else if (cellValue == "2"){
	                return '清算中';
	            }else if (cellValue == "3"){
	                return '成功';
	            }else if (cellValue == "10"){
	                return '失败';
	            }
		    },
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
                        toMobile: this.toMobile,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'ORD_006',params).then(function(response) {
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