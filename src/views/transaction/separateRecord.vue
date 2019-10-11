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
			<el-table-column prop="orderNo" label="订单号" width="190" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="交易时间" width="150" sortable>
			</el-table-column>
			<el-table-column prop="sn" label="序列号" width="180" sortable>
			</el-table-column>
			<el-table-column prop="txnType" label="交易类型" :formatter="formatTxnType" width="130" sortable>
			</el-table-column>
			<el-table-column prop="realName" label="交易用户" width="150" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="交易用户手机号" width="160" sortable>
			</el-table-column>
			<el-table-column prop="agentName" label="分润用户" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="agentMobile" label="分润用户手机号" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="txnAmount" label="交易金额" :formatter="formatTxnAmount" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="shareAmount" label="分润金额" :formatter="formatShareAmount" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="profitState" label="分润状态" :formatter="formatProfitState" min-width="180" sortable>
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
		    formatTxnType(row, column, cellValue) {
                if(cellValue == "1"){
	                return '刷卡';
	            }else if (cellValue == "2"){
	                return 'NFC';
	            }else if (cellValue == "3"){
	                return 'QRCODE';
	            }
		    },
		    formatProfitState(row, column, cellValue) {
                if(cellValue == "1"){
	                return '未分润';
	            }else if (cellValue == "10"){
	                return '已分润';
	            }
		    },
		    formatTxnAmount(row, column, cellValue) {
                let txnAmount = (row.txnAmount)/100;
                return txnAmount;
		    },
		    formatShareAmount(row, column, cellValue) {
                let shareAmount = (row.shareAmount)/100;
                return shareAmount;
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
                this.$http.post(this.baseCont.JAVA_API + 'ORD_004',params).then(function(response) {
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