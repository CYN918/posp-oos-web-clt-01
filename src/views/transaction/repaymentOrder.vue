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
			<el-table-column prop="orderNo" label="订单号" width="180" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="交易时间" width="150" sortable>
			</el-table-column>
			<el-table-column prop="realName" label="交易用户" width="150" sortable>
			</el-table-column>
			<el-table-column prop="payeeMobile" label="交易手机号" width="130" sortable>
			</el-table-column>
			<el-table-column prop="txnAmount" label="还款金额" :formatter="formatTxnAmount" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="agentName" label="所属代理商" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="txnState" label="交易状态" :formatter="formatTxnState" min-width="180" sortable>
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
		    formatTxnState(row, column, cellValue) {
                if(cellValue == "1"){
	                return '下单成功';
	            }else if (cellValue == "2"){
	                return '交易中';
	            }else if (cellValue == "3"){
	                return '交易成功';
	            }else if (cellValue == "4"){
	                return '冲正成功';
	            }else if (cellValue == "10"){
	                return '交易失败';
	            }else if (cellValue == "11"){
	                return '冲正失败';
	            }
		    },
		    formatTxnAmount(row, column, cellValue) {
                let txnAmount = (row.txnAmount)/100;
                return txnAmount;
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
                this.$http.post(this.baseCont.JAVA_API + 'ORD_001',params).then(function(response) {
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