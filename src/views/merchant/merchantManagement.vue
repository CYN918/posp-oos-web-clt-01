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
			<el-table-column prop="realName" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="bindsn" label="绑定设备号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="idCard" label="身份证号" width="180" sortable>
			</el-table-column>
			<el-table-column prop="policyName" label="终端政策" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="actnState" label="激活状态" :formatter="formatActnState" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="加入时间" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="vipState" label="是否VIP" :formatter="formatVipState" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="agentName" label="归属代理商" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="txnRate" label="交易费率" :formatter="formatTxnRate" min-width="180" sortable>
			</el-table-column>
			<el-table-column
		      fixed="right"
		      label="操作"
		      width="120">
		      <template slot-scope="scope">
		        <el-button @click="handleClick(scope.row)" type="text" size="small">重置密码</el-button>
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
		    formatActnState(row, column, cellValue) {
                if(cellValue == "1"){
	                return '未激活';
	            }else if (cellValue == "10"){
	                return '已激活';
	            }
		    },
		    formatVipState(row, column, cellValue) {
                if(cellValue == "1"){
	                return '是';
	            }else if (cellValue == "11"){
	                return '已过期';
	            }
		    },
		    formatTxnRate(row, column, cellValue) {
                let txnRate = (row.txnRate)*100;
                return txnRate;
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
                this.$http.post(this.baseCont.JAVA_API + 'CST_001',params).then(function(response) {
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