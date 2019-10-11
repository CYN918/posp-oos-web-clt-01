<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="mobile" placeholder="划拨人手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="agentName" placeholder="划拨人名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="toMobile" placeholder="受理人手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="toAgentName" placeholder="受理人姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="code" label="保理编号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="划拨时间" width="150" sortable>
			</el-table-column>
			<el-table-column prop="acceptTime" label="订单生效时间" width="150" sortable>
			</el-table-column>
			<el-table-column prop="agentName" label="划拨人姓名" width="150" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="划拨人手机号" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="toAgentName" label="受理人姓名" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="toMobile" label="受理人手机号" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="num" label="机具数量" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="price" label="单价" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="amount" label="保理总额" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="term" label="期数" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="termAmount" label="每期金额" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="state" label="订单状态" min-width="180" sortable>
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
				toMobile: '',
				toAgentName: '',
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
                        toMobile: this.toMobile,
                        toAgentName: this.toAgentName,
			        }
			    }
			    this.listLoading = true;
                this.$http.post(this.baseCont.JAVA_API + 'FNC_001',params).then(function(response) {
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