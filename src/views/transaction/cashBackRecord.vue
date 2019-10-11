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
			<el-table-column prop="createTime" label="返现时间" width="150" sortable>
			</el-table-column>
			<el-table-column prop="bindSn" label="序列号" width="180" sortable>
			</el-table-column>
			<el-table-column prop="profitType" label="返现类型" :formatter="formatProfitType" width="130" sortable>
			</el-table-column>
			<el-table-column prop="realName" label="用户姓名" width="180" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="160" sortable>
			</el-table-column>
			<el-table-column prop="shareAmount" label="返现金额" :formatter="formatShareAmount" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="toPrice" label="抵扣金额" :formatter="formatToPrice" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="agentName" label="所属代理商" min-width="180" sortable>
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
		    formatProfitType(row, column, cellValue) {
                if(cellValue == "1"){
	                return '激活返现';
	            }else if (cellValue == "2"){
	                return 'VIP返现';
	            }else if (cellValue == "3"){
	                return '活动返现';
	            }
		    },
		    formatShareAmount(row, column, cellValue) {
                let shareAmount = (row.shareAmount)/100;
                return shareAmount;
		    },
		    formatToPrice(row, column, cellValue) {
                let toPrice = (row.toPrice)/100;
                return toPrice;
		    },
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
                        toMobile: this.toMobile,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'ORD_005',params).then(function(response) {
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